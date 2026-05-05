const nodemailer = require('nodemailer');

// Create a test transporter using Ethereal (fake SMTP for development)
let transporter = null;

const getTransporter = async () => {
    if (transporter) return transporter;

    // Use Ethereal for dev/testing — no real emails sent
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    return transporter;
};

const sendEmail = async (to, subject, html) => {
    try {
        const t = await getTransporter();
        const info = await t.sendMail({
            from: '"SpaceShare" <noreply@spaceshare.com>',
            to,
            subject,
            html
        });
        console.log(`[Email] Sent to ${to}: ${subject}`);
        console.log(`[Email] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        return info;
    } catch (err) {
        console.error('[Email] Failed to send:', err.message);
    }
};

const sendWelcomeEmail = async (user) => {
    await sendEmail(
        user.email,
        'Welcome to SpaceShare!',
        `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px">
            <h2 style="color:#2563eb">Welcome to SpaceShare, ${user.name}!</h2>
            <p>Your account has been created successfully as a <strong>${user.role}</strong>.</p>
            <p>Start exploring spaces or list your own today!</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
            <p style="color:#9ca3af;font-size:12px">This is an automated email from SpaceShare.</p>
        </div>`
    );
};

const sendBookingConfirmationEmail = async (renterEmail, renterName, spaceName, startDate, endDate) => {
    await sendEmail(
        renterEmail,
        'Booking Confirmed - SpaceShare',
        `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px">
            <h2 style="color:#16a34a">Booking Confirmed!</h2>
            <p>Hi ${renterName},</p>
            <p>Your booking for <strong>${spaceName}</strong> has been approved.</p>
            <p><strong>Dates:</strong> ${new Date(startDate).toLocaleDateString()} — ${new Date(endDate).toLocaleDateString()}</p>
            <p>You can now proceed with payment from your dashboard.</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
            <p style="color:#9ca3af;font-size:12px">This is an automated email from SpaceShare.</p>
        </div>`
    );
};

module.exports = { sendEmail, sendWelcomeEmail, sendBookingConfirmationEmail };
