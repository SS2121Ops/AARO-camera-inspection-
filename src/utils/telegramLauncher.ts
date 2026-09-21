/**
 * Telegram Direct Integration Helper
 * Enables direct connection with Telegram Desktop & Mobile applications
 * as well as direct Bot API messaging and web fallbacks.
 */

export interface TelegramLaunchOptions {
  text: string;
  username?: string;
  mode?: 'app' | 'web';
  autoCopy?: boolean;
}

export interface TelegramSavedContact {
  id: string;
  label: string;
  handle: string; // @username or phone or channel name
  role?: string;
}

export const DEFAULT_TELEGRAM_CONTACTS: TelegramSavedContact[] = [
  { id: '1', label: 'የስራ ሂደት አስተባባሪ', handle: '', role: 'Supervisor' },
  { id: '2', label: 'የክፍለ ከተማው ኃላፊ', handle: '', role: 'Branch Head' },
  { id: '3', label: 'የኦፕሬሽን ግሩፕ / ቻናል', handle: '', role: 'Operations Group' }
];

/**
 * Copies text safely to clipboard across various browser environments
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Directly triggers the Telegram Application using native `tg://` deep links
 * or falls back to Web (`https://t.me/`).
 */
export async function launchTelegram({
  text,
  username = '',
  mode = 'app',
  autoCopy = true
}: TelegramLaunchOptions): Promise<{ method: 'app' | 'web'; copied: boolean }> {
  let copied = false;
  if (autoCopy) {
    copied = await copyTextToClipboard(text);
  }

  const cleanUser = username.replace(/^@+/, '').trim();
  const encodedText = encodeURIComponent(text);

  if (mode === 'app') {
    // Native Telegram App Protocol
    let tgAppUrl = '';
    if (cleanUser) {
      // Direct message to specific user or channel inside Telegram app
      tgAppUrl = `tg://resolve?domain=${encodeURIComponent(cleanUser)}&text=${encodedText}`;
    } else {
      // General share dialog inside Telegram app
      tgAppUrl = `tg://msg_url?text=${encodedText}`;
    }

    // Try navigating to native protocol
    try {
      const link = document.createElement('a');
      link.href = tgAppUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { method: 'app', copied };
    } catch {
      // Fallback to web link
      const webUrl = cleanUser
        ? `https://t.me/${cleanUser}?text=${encodedText}`
        : `https://t.me/share/url?text=${encodedText}`;
      window.open(webUrl, '_blank', 'noopener,noreferrer');
      return { method: 'web', copied };
    }
  } else {
    // Web Browser Mode
    const webUrl = cleanUser
      ? `https://t.me/${cleanUser}?text=${encodedText}`
      : `https://t.me/share/url?text=${encodedText}`;
    window.open(webUrl, '_blank', 'noopener,noreferrer');
    return { method: 'web', copied };
  }
}

/**
 * Tests connection to a Telegram Bot using `getMe`
 */
export async function testTelegramBotConnection(botToken: string): Promise<{
  ok: boolean;
  botName?: string;
  username?: string;
  error?: string;
}> {
  const cleanToken = botToken.trim();
  if (!cleanToken) {
    return { ok: false, error: 'የቦት ቶከን አልተሞላም' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
    const data = await res.json();
    if (data.ok && data.result) {
      return {
        ok: true,
        botName: data.result.first_name,
        username: data.result.username
      };
    } else {
      return {
        ok: false,
        error: data.description || 'ቦት ቶከኑ ትክክል አይደለም'
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || 'ከቴሌግራም ሰርቨር ጋር መገናኘት አልተቻለም'
    };
  }
}

/**
 * Sends message directly to Telegram via Bot API, handling message splitting if > 4000 characters
 */
export async function sendTelegramBotMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean; message: string; messageIds?: number[] }> {
  const cleanToken = botToken.trim();
  const cleanChatId = chatId.trim();

  if (!cleanToken || !cleanChatId) {
    return {
      ok: false,
      message: 'የቦት ቶከን እና የቻት አይዲ (Chat ID) ያስፈልጋል።'
    };
  }

  // Telegram message character limit is 4096
  const MAX_CHUNK = 3900;
  const chunks: string[] = [];

  if (text.length <= MAX_CHUNK) {
    chunks.push(text);
  } else {
    let remaining = text;
    while (remaining.length > 0) {
      if (remaining.length <= MAX_CHUNK) {
        chunks.push(remaining);
        break;
      }
      // Split at nearest newline if possible
      let splitIdx = remaining.lastIndexOf('\n', MAX_CHUNK);
      if (splitIdx === -1 || splitIdx < 1000) {
        splitIdx = MAX_CHUNK;
      }
      chunks.push(remaining.substring(0, splitIdx));
      remaining = remaining.substring(splitIdx).trimStart();
    }
  }

  const messageIds: number[] = [];

  try {
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const partNotice = chunks.length > 1 ? `[ክፍል ${i + 1}/${chunks.length}]\n` : '';
      const payload = {
        chat_id: cleanChatId,
        text: partNotice + chunk
      };

      const response = await fetch(`https://api.telegram.org/bot${cleanToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resJson = await response.json();
      if (!resJson.ok) {
        return {
          ok: false,
          message: `የቴሌግራም ስህተት: ${resJson.description || 'መልዕክቱን መላክ አልተቻለም'}`
        };
      }
      if (resJson.result?.message_id) {
        messageIds.push(resJson.result.message_id);
      }
    }

    return {
      ok: true,
      message: `ሪፖርቱ በቴሌግራም ቦት አማካኝነት በተሳካ ሁኔታ ተልኳል! (${chunks.length} መልዕክት)`,
      messageIds
    };
  } catch (err: any) {
    return {
      ok: false,
      message: `የግንኙነት ስህተት: ${err.message || 'ወደ ቴሌግራም መላክ አልተቻለም'}`
    };
  }
}
