const express    = require('express');
const nodemailer = require('nodemailer');
const fs         = require('fs');
const path       = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

// Configuración envio 
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

// EP para enviar el mail - simplemente es hacer el post.
app.post('/send-email', async (req, res) => {
  try {
    const { nombre, email, empresa, mensaje } = req.body;

    if (!nombre || !email || !empresa) {
      return res.status(400).json({
        message: 'Completá nombre, email y empresa para enviar la consulta.',
      });
    }

    // Carga email a enviar
    const templatePath = path.join(__dirname, 'templates', process.env.EMAIL_NOMBRE_ARCHIVO);
    let html = fs.readFileSync(templatePath, 'utf8');

    const values = {
      nombre,
      email,
      empresa,
      mensaje: mensaje || 'No especificado',
      fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' }),
    };

    html = Object.entries(values).reduce((content, [key, value]) => {
      return content.split(`{{${key}}}`).join(escapeHtml(value));
    }, html);

    // Envia
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `Nueva consulta web de ${nombre} - ${empresa}`,
      html
    });

    return res.json({ message: 'Consulta enviada correctamente.', messageId: info.messageId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'No pudimos enviar la consulta.', error: err.message });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
}

module.exports = app;
