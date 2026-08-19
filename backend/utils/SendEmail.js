const nodemailer = require('nodemailer');

const SendEmail = async ({ to, receiverName, trackingNumber, sourceCity, destinationCity, estimatedDelivery }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const trackingLink = `${process.env.CLIENT_URL}/track/${trackingNumber}`;

        const mailOptions = {
            from: `"Shipment Tracker" <${process.env.EMAIL_USER}>`,
            to,
            subject: `Your Shipment is on its way- Tracking Number: ${trackingNumber}`,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #3b82f6;">Shipment Notification</h2>
          <p>Hello <strong>${receiverName}</strong>,</p>
          <p>A shipment has been created for you. Here are the details:</p>

          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p style="margin: 6px 0;"><strong>From:</strong> ${sourceCity}</p>
            <p style="margin: 6px 0;"><strong>To:</strong> ${destinationCity}</p>
            <p style="margin: 6px 0;"><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toDateString()}</p>
          </div>

          <p>Click the button below to track your shipment at any time:</p>
          
            href="${trackingLink}"
            style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;"
          >
            Track My Shipment
          </a>

          <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
            Or copy this link: ${trackingLink}
          </p>

          <hr style="margin-top: 32px; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #9ca3af; font-size: 12px;">
            This is an automated message from Shipment Tracker. Please do not reply to this email.
          </p>
        </div>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.log('Email sending failed:', err);
    }
};

module.exports = SendEmail;