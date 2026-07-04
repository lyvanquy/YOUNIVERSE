export const GUEST_SESSION_ID_PATTERN = /^(?:order-)?[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const parseGuestSessionId = (value: string | string[] | undefined): string | undefined => {
  const sessionId = Array.isArray(value) ? value[0] : value;
  return sessionId && GUEST_SESSION_ID_PATTERN.test(sessionId) ? sessionId : undefined;
};
