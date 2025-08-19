import { Resend } from "resend";
let resend = null;
const getResend = () => {
    if (!resend) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error("RESEND_API_KEY environment variable is not set");
        }
        resend = new Resend(apiKey);
    }
    return resend;
};
// Winner email template with brand colors
export const createWinnerEmailTemplate = (data) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prize Notification - Done FOR YOU PROS</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
       
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
       
        body {
            font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background: #ffffff;
            margin: 0;
            padding: 20px;
        }
       
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
       
        .header {
            background: linear-gradient(135deg, #2C5CDC 0%, #F76D46 100%);
            padding: 30px;
            text-align: center;
        }
       
        .company-name {
            color: #ffffff;
            font-size: 28px;
            font-weight: 900;
            margin: 0;
            letter-spacing: 1px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
       
        .company-info {
            color: #FFD700;
            font-size: 16px;
            font-weight: 600;
            margin: 8px 0 0 0;
        }
       
        .content {
            padding: 35px 30px;
            background: #ffffff;
        }
       
        .greeting {
            font-size: 18px;
            color: #2C5CDC;
            margin-bottom: 25px;
            font-weight: 600;
        }
       
        .notification-text {
            font-size: 16px;
            line-height: 1.7;
            color: #34495e;
            margin-bottom: 25px;
        }
       
        .prize-section {
            background: linear-gradient(135deg, #ffb22a 0%, #FFD700 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            color: #2c3e50;
        }
       
        .prize-header {
            font-size: 20px;
            font-weight: 800;
            color: #2C5CDC;
            margin-bottom: 15px;
            text-align: center;
        }
       
        .prize-details {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255,255,255,0.8);
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 8px;
        }
       
        .prize-label {
            font-weight: 700;
            color: #2C5CDC;
            flex-shrink: 0;
            width: 140px;
        }
       
        .prize-value {
            color: #2c3e50;
            font-weight: 600;
            text-align: right;
            flex-grow: 1;
        }
       
        .contact-section {
            background: linear-gradient(135deg, #2C5CDC 0%, #F76D46 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
        }
       
        .contact-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 15px;
            color: #FFD700;
            text-align: center;
        }
       
        .contact-text {
            font-size: 15px;
            margin-bottom: 15px;
            line-height: 1.6;
            text-align: center;
        }
       
        .phone-number {
            background: #FFD700;
            color: #2C5CDC;
            padding: 15px 25px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 18px;
            font-weight: 800;
            display: inline-block;
            border: none;
            margin: 10px auto;
            display: block;
            text-align: center;
            max-width: 250px;
        }
       
        .phone-number:hover {
            background: #ffb22a;
            transform: translateY(-1px);
            transition: all 0.2s ease;
        }
       
        .important-note {
            background: #fff3cd;
            border: 2px solid #FFD700;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            color: #856404;
        }
       
        .note-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #F76D46;
        }
       
        .note-list {
            margin: 10px 0;
            padding-left: 20px;
        }
       
        .note-list li {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.5;
        }
       
        .footer {
            background: linear-gradient(135deg, #2C5CDC 0%, #F76D46 100%);
            padding: 20px 30px;
            text-align: center;
        }
       
        .footer-text {
            color: #ffffff;
            font-size: 13px;
            margin: 0;
        }
       
        .contact-link {
            color: #FFD700;
            text-decoration: none;
            font-weight: 600;
        }
       
        .contact-link:hover {
            color: #ffb22a;
            text-decoration: underline;
        }
       
        @media (max-width: 650px) {
            .email-container {
                margin: 0 10px;
                border-radius: 8px;
            }
           
            .content {
                padding: 25px 20px;
            }
           
            .prize-section, .contact-section, .important-note {
                padding: 20px;
            }
           
            .phone-number {
                padding: 12px 20px;
                font-size: 16px;
            }
           
            .prize-details {
                flex-direction: column;
                text-align: center;
            }
           
            .prize-label {
                width: 100%;
                margin-bottom: 5px;
            }
           
            .prize-value {
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1 class="company-name">Done FOR YOU PROS</h1>
            <p class="company-info">Prize Notification Service</p>
        </div>
       
        <div class="content">
            <div class="greeting">
                Dear ${data.userName},
            </div>
           
            <p class="notification-text">
                Congratulations, and thank you for participating in our
                Nationwide Match 3 and Win Connection Protection Campaign.
            </p>
           
            <p class="notification-text">
                We are pleased to inform you that you have won one of our all inclusive Services to help protect your home.
            </p>
           
            <div class="prize-section">
                <div class="prize-header">🏆 Prize Details</div>
                <div class="prize-details">
                    <span class="prize-label">Service:</span>
                    <span class="prize-value">Home Appliance New Connection Part Professionally Installed.</span>
                </div>
                <div class="prize-details">
                    <span class="prize-label">Estimated Value:</span>
                    <span class="prize-value">$197.00</span>
                </div>
                <div class="prize-details">
                    <span class="prize-label">Limitation:</span>
                    <span class="prize-value">Limited to One Prize Per Home</span>
                </div>
            </div>
           
            <div class="contact-section">
                <div class="contact-title">📞 Next Steps</div>
                <p class="contact-text">
                    Claim your prize, and Schedule your winning prize installation by calling or texting
                    our customer service team.
                </p>
                <p class="contact-text">
                    Available: Monday - Friday, 9:00 AM - 3PM PST
                </p>
                <a href="tel:+16198712110" class="phone-number">+1 (619) 871-2110</a>
              <p class="contact-text" style="margin-top: 20px; font-size: 14px;">
                When you call, please provide:<br>
                • Your full name: <span style="color: white; text-decoration: none;">${data.userName}</span><br>
                • Your email address: <span style="color: white; text-decoration: none;">${data.userEmail}</span><br>
                • Reference this prize notification
            </p>
            </div>
           
            <div class="important-note">
                <div class="note-title">⚠️ Important Notes</div>
                <ul class="note-list">
                    <li>This offer is valid for 30 days from the date of this email</li>
                    <li>Prize must be claimed by the winner personally</li>
                    <li>Additional terms and conditions may apply</li>
                    <li>Southern California area restrictions apply.</li>
                </ul>
            </div>
           
            <p class="notification-text">
                Thank you for your participation in our promotion. We look forward to serving you.
            </p>
        </div>
       
        <div class="footer">
            <p class="footer-text">
                For inquiries, contact us at <a href="tel:+16198712110" class="contact-link">+1 (619) 871-2110</a><br>
                Visit our website: <a href="https://doneforyoupros.com/english" class="contact-link">doneforyoupros.com</a>
            </p>
        </div>
    </div>
</body>
</html>
  `;
};
export const sendWinnerEmail = async (data) => {
    try {
        const resend = getResend();
        console.log("Attempting to send email to:", data.userEmail);
        const { data: result, error } = await resend.emails.send({
            from: "Done For You Pros Winner <winner@amazingworldmedia.com>",
            to: data.userEmail,
            subject: "Prize Notification - Done FOR YOU PROS",
            html: createWinnerEmailTemplate(data),
        });
        if (error) {
            console.error("Resend error:", error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
        console.log("Winner email sent successfully:", result);
        return { success: true, messageId: result?.id };
    }
    catch (error) {
        console.error("Error sending winner email:", error);
        throw error;
    }
};
export const sendTestEmail = async (email) => {
    return sendWinnerEmail({
        userEmail: email,
        userName: "Test Winner",
        prizeName: "Home Appliance New Connection Part Professionally Installed",
        prizeValue: "$197.00",
        phoneNumber: "+1 (619) 871-2110",
    });
};
