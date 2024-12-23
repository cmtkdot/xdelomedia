export const validateWebhookAuth = (
  authHeader: string | null,
  webhookSecret: string | null
): boolean => {
  if (!authHeader || !webhookSecret || authHeader !== webhookSecret) {
    console.error("Authentication failed - invalid or missing webhook secret");
    return false;
  }
  return true;
};

export const validateBotToken = (botToken: string | null): boolean => {
  if (!botToken) {
    console.error("Missing bot token");
    return false;
  }
  return true;
};