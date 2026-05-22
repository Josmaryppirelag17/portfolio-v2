/** Registro local de mensajes de contacto (simulación cliente / panel admin). */
export const CYBER_MESSAGES_KEY = "cyber_messages";

export const CYBER_MESSAGES_EVENT = "cyber-messages-updated";

export interface CyberMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  secured: boolean;
}

/** Mensajes demo cuando aún no hay envíos reales en localStorage. */
export const DEMO_CYBER_MESSAGES: CyberMessage[] = [
  {
    id: "demo_01",
    name: "Satoshi_N",
    email: "sat@bitcoin.org",
    message:
      "The interface aesthetics perfectly capture the raw retrofuturistic essence. Excellent Web Audio implementations.",
    timestamp: "2026-05-19 14:22:05 UTC",
    secured: true,
  },
  {
    id: "demo_02",
    name: "Ada_Lovelace",
    email: "ada@analytical.net",
    message:
      "Impressive inverse kinematics live in the bio avatar. Your compiler pipeline outputs extreme performance ratios.",
    timestamp: "2026-05-19 10:14:52 UTC",
    secured: true,
  },
  {
    id: "demo_03",
    name: "Neo_The_Chosen",
    email: "neo@matrix.io",
    message:
      "Following the white rabbit... Checked your skills cluster, assimilation rate is off the charts.",
    timestamp: "2026-05-18 20:45:11 UTC",
    secured: true,
  },
];

export function loadCyberMessages(): CyberMessage[] {
  try {
    const stored = localStorage.getItem(CYBER_MESSAGES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CyberMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendCyberMessage(
  entry: Omit<CyberMessage, "id" | "timestamp" | "secured"> & {
    id?: string;
    timestamp?: string;
    secured?: boolean;
  }
): CyberMessage {
  const record: CyberMessage = {
    id: entry.id ?? `usr_${Date.now()}`,
    name: entry.name,
    email: entry.email,
    message: entry.message,
    timestamp:
      entry.timestamp ??
      `${new Date().toISOString().replace("T", " ").substring(0, 19)} UTC`,
    secured: entry.secured ?? true,
  };

  const existing = loadCyberMessages();
  localStorage.setItem(
    CYBER_MESSAGES_KEY,
    JSON.stringify([record, ...existing])
  );
  window.dispatchEvent(new CustomEvent(CYBER_MESSAGES_EVENT));
  return record;
}

/** Mensajes para el panel admin: reales si existen; si no, demo. */
export function getAdminDisplayMessages(): CyberMessage[] {
  const user = loadCyberMessages();
  return user.length > 0 ? user : [...DEMO_CYBER_MESSAGES];
}

export function clearUserCyberMessages(): void {
  localStorage.removeItem(CYBER_MESSAGES_KEY);
  window.dispatchEvent(new CustomEvent(CYBER_MESSAGES_EVENT));
}

export function hasUserCyberMessages(): boolean {
  return loadCyberMessages().length > 0;
}
