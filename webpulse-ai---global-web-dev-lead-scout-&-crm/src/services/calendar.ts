import { getAccessToken } from './auth';

export interface CalendarEventParams {
  summary: string;
  description: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  attendeeEmail?: string;
  location?: string;
}

export interface CalendarEventResult {
  success: boolean;
  eventId?: string;
  htmlLink?: string;
  hangoutLink?: string;
}

export async function createGoogleCalendarEvent(params: CalendarEventParams): Promise<CalendarEventResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google authentication required. Please sign in with Google to create calendar events.');
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const body: any = {
    summary: params.summary,
    description: params.description,
    start: {
      dateTime: params.startDateTime,
      timeZone,
    },
    end: {
      dateTime: params.endDateTime,
      timeZone,
    },
  };

  if (params.location) {
    body.location = params.location;
  }

  if (params.attendeeEmail) {
    body.attendees = [{ email: params.attendeeEmail }];
  }

  // Request Google Meet conference if supported
  body.conferenceData = {
    createRequest: {
      requestId: `webpulse-${Date.now()}`,
      conferenceSolutionKey: { type: 'hangoutsMeet' },
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `Google Calendar API responded with status ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return {
    success: true,
    eventId: data.id,
    htmlLink: data.htmlLink,
    hangoutLink: data.hangoutLink,
  };
}
