export const generateSafeFileName = (text: string, fileExt: string): string => {
  const safeName = text
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase()
    .slice(0, 50);
  return `${safeName}_${Date.now()}.${fileExt}`;
};

export const determineMediaType = (message: any): string => {
  if (message.photo) return 'photo';
  if (message.video) return 'video';
  if (message.audio) return 'audio';
  if (message.voice) return 'voice';
  if (message.animation) return 'animation';
  if (message.sticker) return 'sticker';
  if (message.document) return 'document';
  throw new Error('Unsupported media type');
};

export const getMediaItem = (message: any) => {
  if (message.photo) return message.photo[message.photo.length - 1];
  if (message.video) return message.video;
  if (message.audio) return message.audio;
  if (message.voice) return message.voice;
  if (message.animation) return message.animation;
  if (message.sticker) return message.sticker;
  if (message.document) return message.document;
  return null;
};