import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: `"Café Ludoteca ARLA" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Código de Verificación - ARLA',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Bienvenido a Café Ludoteca ARLA</h2>
        <p style="font-size: 16px; color: #555;">Hola,</p>
        <p style="font-size: 16px; color: #555;">Tu código de verificación es:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; padding: 10px 20px; background: #f3f4f6; border-radius: 5px;">
            ${code}
          </span>
        </div>
        <p style="font-size: 14px; color: #777;">Este código expirará en 15 minutos.</p>
        <p style="font-size: 14px; color: #777;">Si no solicitaste este código, por favor ignora este correo.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">© 2026 Café Ludoteca ARLA. Todos los derechos reservados.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('[MAILER ERROR] Failed to send email:', error);
    throw new Error('Error al enviar el correo de verificación');
  }
};
