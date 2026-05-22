import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "pg";
import { Resend } from "resend";
import fs from "fs/promises";
import path from "path";
import { checkContactRateLimit } from "./lib/rateLimit";

// ─────────────────────────────────────────────
// CORS: lista blanca de orígenes permitidos
// ─────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://josmarypirela.dev",
  "https://www.josmarypirela.dev",
];

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Permitir localhost en cualquier puerto para desarrollo local
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

// ─────────────────────────────────────────────
// XSS: escapar caracteres HTML peligrosos
// ─────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// ─────────────────────────────────────────────
// Validación básica de formato de email
// ─────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;

  // ── Configurar cabeceras CORS ──
  if (isOriginAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin!);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, X-Requested-With, Accept"
    );
  }

  // ── Preflight OPTIONS ──
  if (req.method === "OPTIONS") {
    if (isOriginAllowed(origin)) {
      res.status(200).end();
    } else {
      res.status(403).end();
    }
    return;
  }

  // ── Rechazar orígenes no permitidos ──
  if (origin && !isOriginAllowed(origin)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  // ── Solo se aceptan POST ──
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rate = await checkContactRateLimit(req);
  if (!rate.allowed) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((rate.reset - Date.now()) / 1000)
    );
    res.setHeader("Retry-After", String(retryAfterSec));
    res.setHeader("X-RateLimit-Limit", String(rate.limit));
    res.setHeader("X-RateLimit-Remaining", String(rate.remaining));
    return res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: retryAfterSec,
    });
  }

  const { name, email, message, fax } = req.body;

  // ── Honeypot anti-spam ──
  // Si el campo "fax" viene relleno, es un bot. Respondemos 200 para no alertarle
  // pero NO procesamos nada (no guardamos en BD, no enviamos correo ni Telegram).
  if (fax) {
    console.warn("[HONEYPOT] Bot detectado — petición descartada silenciosamente");
    return res.status(200).json({ success: true });
  }

  // ── Validación de campos requeridos ──
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ── Validación de formato de email ──
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // ── Longitud máxima de campos (protección contra payloads masivos) ──
  if (name.length > 120 || email.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: "Input exceeds maximum allowed length" });
  }

  const dbUrl = process.env.DATABASE_URL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO || "josmaryppirelag17@gmail.com";
  const resendFrom =
    process.env.RESEND_FROM ||
    "Josmary Pirela <hola@josmarypirela.dev>";
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!dbUrl || dbUrl.includes("<TU_CONTRASEÑA_DE_SUPABASE>")) {
    console.error("DATABASE_URL no está configurada o contiene el placeholder.");
    return res.status(500).json({
      error: "Base de datos no configurada. Edita el archivo .env e introduce la contraseña de Supabase.",
    });
  }

  let dbSuccess = false;
  let emailSuccess = false;
  let telegramSuccess = false;
  const errorLog: string[] = [];

  // ── 1. Guardar en Supabase PostgreSQL ──
  const parsedUrl = new URL(dbUrl);
  const sslMode = parsedUrl.searchParams.get("sslmode");
  const sslRootCert = parsedUrl.searchParams.get("sslrootcert");

  const sslOptions: Record<string, any> | undefined = sslMode
    ? { rejectUnauthorized: sslMode === "verify-full" }
    : undefined;

  if (sslRootCert) {
    try {
      const certPath = path.isAbsolute(sslRootCert)
        ? sslRootCert
        : path.resolve(process.cwd(), sslRootCert);
      sslOptions.ca = await fs.readFile(certPath, "utf8");
    } catch (err: any) {
      console.error("Error cargando sslrootcert:", err);
      return res.status(500).json({
        error: `No se pudo leer sslrootcert desde ${sslRootCert}.`,
        details: err.message,
      });
    }
  }

  parsedUrl.searchParams.delete("sslmode");
  parsedUrl.searchParams.delete("sslrootcert");

  const client = new Client({
    connectionString: parsedUrl.toString(),
    ssl: sslOptions,
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    dbSuccess = true;
  } catch (err: any) {
    console.error("Error en Base de Datos PostgreSQL:", err);
    errorLog.push(`DB_ERR: ${err.message}`);
  } finally {
    await client.end();
  }

  // ── 2. Envío de Correo Electrónico mediante Resend (con HTML escapado) ──
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);

      // Sanitizar la entrada antes de inyectarla en el HTML del correo
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

      const emailResult = await resend.emails.send({
        from: resendFrom,
        to: emailTo,
        subject: `🌌 Nuevo mensaje de contacto de ${safeName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #111232; border-radius: 8px;">
            <h2 style="color: #FD1EB1; border-bottom: 2px solid #18BEC7; padding-bottom: 8px;">Mensaje de Contacto (Portfolio v2)</h2>
            <p><strong>Nombre:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Mensaje:</strong></p>
            <div style="background-color: #111232; color: #DBEAEC; padding: 15px; border-radius: 6px; border-left: 4px solid #18BEC7; font-family: monospace;">
              ${safeMessage}
            </div>
            <p style="font-size: 11px; color: #888; margin-top: 20px;">Este correo fue generado automáticamente desde tu portfolio retrofuturista en josmarypirela.dev</p>
          </div>
        `,
      });
      if (emailResult.error) {
        throw new Error(emailResult.error.message);
      }
      emailSuccess = true;
    } catch (err: any) {
      console.error("Error en Servicio de Email:", err);
      errorLog.push(`EMAIL_ERR: ${err.message}`);
    }
  } else {
    errorLog.push("EMAIL_ERR: RESEND_API_KEY no configurada");
  }

  // ── 3. Envío de Notificación a Telegram ──
  if (telegramBotToken && telegramChatId) {
    try {
      const escapeMarkdown = (text: string) =>
        text.replace(/[_*[\]()~`>#+=|{}.!\-]/g, "\\$&");

      const escapedName = escapeMarkdown(name);
      const escapedEmail = escapeMarkdown(email);
      const escapedMessage = escapeMarkdown(message);

      const telegramText =
        `*🌌 Nuevo mensaje de contacto en josmarypirela\\.dev*\n\n` +
        `*Nombre:* ${escapedName}\n` +
        `*Email:* ${escapedEmail}\n\n` +
        `*Mensaje:*\n` +
        `> ${escapedMessage}`;

      const tgUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const response = await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramText,
          parse_mode: "MarkdownV2",
        }),
      });

      if (!response.ok) {
        const tgErrData = await response.json();
        throw new Error(
          tgErrData.description || "Respuesta errónea de la API de Telegram"
        );
      }
      telegramSuccess = true;
    } catch (err: any) {
      console.error("Error en Telegram Notification:", err);
      errorLog.push(`TELEGRAM_ERR: ${err.message}`);
    }
  } else {
    errorLog.push(
      "TELEGRAM_ERR: TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados"
    );
  }

  // ── Respuesta final ──
  const hasAnySuccess = dbSuccess || emailSuccess || telegramSuccess;
  const payload = {
    success: hasAnySuccess,
    db: dbSuccess,
    email: emailSuccess,
    telegram: telegramSuccess,
    warnings: errorLog.length > 0 ? errorLog : undefined,
  };

  if (hasAnySuccess) {
    return res.status(200).json(payload);
  }

  return res.status(500).json({
    ...payload,
    errors: errorLog,
  });
}
