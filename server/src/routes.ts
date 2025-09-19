import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema, loginSchema, updateUserSchema } from "./schema";
import { z } from "zod";
import { sendWinnerEmail, sendTestEmail, WinnerEmailData } from "./emailTemplates";
import path from "path";

// Extend Request type to include session
interface AuthRequest extends Request {
  session: any;
}


// Middleware: ensure game exists
async function ensureGameExists(req: Request, res: Response, next: any) {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ message: "Slug is required" });

    let game = await storage.getGameBySlug(slug);
    if (!game) {
      // auto-create the game
      game = await storage.createGame({
        name: slug,   // or req.body.name if you want custom name
        slug,
      });
      console.log(`Game created automatically with slug: ${slug}`);
    }

    // Attach game to request for downstream routes
    (req as any).game = game;
    next();
  } catch (err) {
    console.error("ensureGameExists error:", err);
    res.status(500).json({ message: "Failed to ensure game exists" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {


  // Authentication middleware
  const requireAuth = async (req: AuthRequest, res: Response, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Login endpoint
  app.post("/api/auth/login", async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ 
          message: "Invalid username or password" 
        });
      }
      
      // Store user session
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.json({ 
        message: "Login successful", 
        user: { id: user.id, username: user.username, role: user.role }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      }
      
      console.error("Login error:", error);
      res.status(500).json({ 
        message: "Login failed. Please try again." 
      });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: AuthRequest, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Check auth status
  app.get("/api/auth/me", async (req: AuthRequest, res: Response) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    res.json({ 
      user: { id: user.id, username: user.username, role: user.role }
    });
  });

  // Registration endpoint
 app.post("/api/:slug/register", ensureGameExists, async (req, res) => {
  try {
    const { slug } = req.params;
    const game = await storage.getGameBySlug(slug);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const validatedData = insertRegistrationSchema.parse(req.body);

    // Check duplicate email setting
    const emailCheckSetting = await storage.getSetting(game.id, "duplicate_email_check");
    const emailCheckEnabled = emailCheckSetting?.value === "true";

    if (emailCheckEnabled) {
      const existingRegistration = await storage.getRegistrationByEmail(
        game.id,
        validatedData.email
      );
      if (existingRegistration) {
        return res.status(400).json({
          message: "Email already registered. Please use a different email address.",
        });
      }
    }

    const registration = await storage.createRegistration(game.id, validatedData);
    res.json({
      message: "Registration successful!",
      id: registration.id,
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register. Please try again." });
  }
});


app.get("/api/:slug/stats", ensureGameExists, async (req, res) => {
  try {
    const { slug } = req.params;
    const game = await storage.getGameBySlug(slug);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const count = await storage.getRegistrationCount(game.id);
    res.json({ registrationCount: count });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
});


  // Admin routes (protected)
app.get("/api/:slug/admin/registrations", requireAuth, async (req, res) => {
  const { slug } = req.params;
  const game = await storage.getGameBySlug(slug);
  if (!game) return res.status(404).json({ message: "Game not found" });

  const registrations = await storage.getAllRegistrations(game.id);
  res.json(registrations);
});

app.delete("/api/:slug/admin/registrations/:id", requireAuth, async (req, res) => {
  const { slug, id } = req.params;
  const game = await storage.getGameBySlug(slug);
  if (!game) return res.status(404).json({ message: "Game not found" });

  const regId = parseInt(id);
  await storage.deleteRegistration(regId, game.id);
  res.json({ message: "Registration deleted successfully" });
});

app.post("/api/:slug/admin/registrations/bulk-delete", requireAuth, async (req, res) => {
  const { slug } = req.params;
  const game = await storage.getGameBySlug(slug);
  if (!game) return res.status(404).json({ message: "Game not found" });

  const { ids } = req.body;
  await storage.bulkDeleteRegistrations(ids, game.id);
  res.json({ message: `${ids.length} registrations deleted successfully` });
});


  // Update admin credentials
app.put("/api/admin/update-credentials", requireAuth, async (req: AuthRequest, res: Response) => {
  try {

    // Validate body
    const validatedData = updateUserSchema.parse(req.body);
    
    const userId = req.session.userId;
   

    if (!userId) {
      console.warn("❌ No userId in session. User not authenticated.");
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Update user in DB
    const updatedUser = await storage.updateUser(userId, validatedData);

    // Update session username if it changed
    if (validatedData.username) {
      console.log(`Updating session username → ${validatedData.username}`);
      req.session.username = validatedData.username;
    }

    res.json({
      message: "Credentials updated successfully",
      user: { id: updatedUser.id, username: updatedUser.username, role: updatedUser.role }
    });

  } catch (error) {
    console.error("🔥 Update credentials error:", error);

    if (error instanceof z.ZodError) {
      console.warn("❌ Validation failed:", error.errors);
      return res.status(400).json({
        message: "Invalid data provided",
        errors: error.errors
      });
    }

    res.status(500).json({
      message: "Failed to update credentials"
    });
  }
});


  // Email routes
  app.post("/api/email/winner", async (req, res) => {
    try {
      const winnerEmailSchema = z.object({
        userEmail: z.string().email(),
        userName: z.string().min(1),
        prizeName: z.string().min(1),
        prizeValue: z.string().min(1),
        phoneNumber: z.string().min(1)
      });

      const validatedData = winnerEmailSchema.parse(req.body);
      
      const success = await sendWinnerEmail(validatedData);
      
      if (success) {
        res.json({ message: "Winner email sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send winner email" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data provided", 
          errors: error.errors 
        });
      }
      
      console.error("Email sending error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // Test email route (for testing purposes)
  app.post("/api/email/test", async (req, res) => {
    try {
      const testEmailSchema = z.object({
        email: z.string().email()
      });

      const { email } = testEmailSchema.parse(req.body);
      
      const success = await sendTestEmail(email);
      
      if (success) {
        res.json({ message: "Test email sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send test email" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid email format", 
          errors: error.errors 
        });
      }
      
      console.error("Test email error:", error);
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  // Public settings routes (for frontend consumption)
 app.get("/api/:slug/settings/video_requirement_enabled", async (req, res) => {
  try {
    const { slug } = req.params;
    const game = await storage.getGameBySlug(slug);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const setting = await storage.getSetting(game.id, "video_requirement_enabled");

    if (!setting) {
      // Default to true if setting doesn't exist
      res.json({ value: "true" });
    } else {
      res.json(setting);
    }
  } catch (error) {
    console.error("Setting fetch error:", error);
    res.status(500).json({ message: "Failed to fetch setting" });
  }
});

  // Settings routes (admin protected)
  app.get("/api/:slug/settings/:key", async (req, res) => {
  const { slug, key } = req.params;
  const game = await storage.getGameBySlug(slug);
  if (!game) return res.status(404).json({ message: "Game not found" });

  const setting = await storage.getSetting(game.id, key);
  res.json(setting || { value: "true" }); // default
});

app.get("/api/:slug/admin/settings", requireAuth, async (req, res) => {
  const { slug } = req.params;
  const game = await storage.getGameBySlug(slug);
  if (!game) return res.status(404).json({ message: "Game not found" });

  const settings = await storage.getAllSettings(game.id);
  res.json(settings);
});

app.put("/api/:slug/admin/settings/:key", requireAuth, async (req, res) => {
  const { slug, key } = req.params;
  const { value, description } = req.body;
  const game = await storage.getGameBySlug(slug);
  if (!game) return res.status(404).json({ message: "Game not found" });

  const setting = await storage.setSetting(game.id, key, value, description);
  res.json({ message: "Setting updated successfully", setting });
});


  // Serve logo image
  app.get("/logo.png", (req, res) => {
    const logoPath = path.resolve("attached_assets/logo_1752555507955.png");
    res.sendFile(logoPath, (err) => {
      if (err) {
        console.error("Error serving logo:", err);
        res.status(404).send("Logo not found");
      }
    });
  });


  const httpServer = createServer(app);
  return httpServer;
}
