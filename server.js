require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.MAILTRAP_PORT || 2525,
    auth: {
        user: process.env.MAILTRAP_USER || 'YOUR_MAILTRAP_USER',
        pass: process.env.MAILTRAP_PASS || 'YOUR_MAILTRAP_PASS'
    }
});

app.post('/api/register-notify', async (req, res) => {
    const { fullName, username, email } = req.body;

    if (!email || !fullName) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const mailOptions = {
        from: '"Grade Tracker App" <no-reply@gradetracker.com>',
        to: email,
        subject: 'Welcome to Grade Tracker!',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #fdf2f4; border-radius: 12px; max-width: 500px;">
                <h2 style="color: #800020; margin-top: 0;">Welcome, ${fullName}! 🎉</h2>
                <p>Your account for <strong>Grade Tracker</strong> has been successfully registered.</p>
                <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #f7ced5;">
                    <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                </div>
                <p style="margin-top: 20px;">You can now log in and start tracking your grades!</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 11px; color: #888;">Grade Tracker System Notification</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to ${email} via Mailtrap`);
        res.status(200).json({ success: true, message: 'Notification sent successfully to Mailtrap!' });
    } catch (error) {
        console.error('Mailtrap Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email notification.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
