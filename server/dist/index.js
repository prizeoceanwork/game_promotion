import express from "express";
import session from "express-session";
import { registerRoutes } from "./routes.js";
import dotenv from "dotenv";
dotenv.config();
import pg from 'pg';
import pgSession from "connect-pg-simple";
import cors from "cors";
const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
const PgSessionStore = pgSession(session);
const app = express();
app.disable("etag");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: ['https://amazingworldmedia.net'],
    credentials: true
}));
app.set('trust proxy', 1);
// Configure session middleware
app.use(session({
    store: new PgSessionStore({
        pool: pgPool,
        tableName: "session",
        // set to true to automatically prune expired sessions
        pruneSessionInterval: 60 * 60, // every hour
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "your-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 5, // 5 hours session cookie
        secure: true, // set true if HTTPS
        httpOnly: true,
        sameSite: "none",
    },
}));
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;
    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }
            console.log(logLine);
        }
    });
    next();
});
(async () => {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        throw err;
    });
    app.get("/", (req, res) => {
        res.send("Railway backend is rununig !!!");
    });
    const port = 3000;
    server.listen(port, () => {
        console.log(`serving on port ${port}`);
    });
})();
