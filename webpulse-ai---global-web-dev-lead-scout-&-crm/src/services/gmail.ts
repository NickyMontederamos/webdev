import { getAccessToken } from './auth';

function makeBase64UrlEmail(to: string, subject: string, body: string): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    body,
  ];
  const message = messageParts.join('\r\n');
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  draftId?: string;
  error?: string;
}

export async function sendGmailMessage({ to, subject, body }: SendEmailParams): Promise<SendEmailResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google authentication required. Please sign in with Google to send via Gmail.');
  }

  const raw = makeBase64UrlEmail(to, subject, body);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `Gmail API responded with status ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return {
    success: true,
    messageId: data.id,
  };
}

export async function createGmailDraft({ to, subject, body }: SendEmailParams): Promise<SendEmailResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google authentication required. Please sign in with Google to create drafts in Gmail.');
  }

  const raw = makeBase64UrlEmail(to, subject, body);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: { raw },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `Gmail API responded with status ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return {
    success: true,
    draftId: data.id,
    messageId: data.message?.id,
  };
}
