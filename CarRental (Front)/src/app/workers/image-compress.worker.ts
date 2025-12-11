addEventListener('message', async ({ data }) => {
  const { file, maxWidth, quality } = data;

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(maxWidth / bitmap.width, maxWidth / bitmap.height);

    const newW = bitmap.width * scale;
    const newH = bitmap.height * scale;

    const canvas = new OffscreenCanvas(newW, newH);
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('OffscreenCanvas context is null');

    ctx.drawImage(bitmap, 0, 0, newW, newH);

    const blob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: quality,
    });

    const base64 = await convertBlobToBase64(blob);

    postMessage(base64);
  } catch (err) {
    console.error('[Worker] ERROR compressing image:', err);
    postMessage(null);
  }
});

function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
