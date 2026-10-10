export async function preparePhoto(file: File): Promise<string> {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error('PHOTO_INVALID');
  const image = await createImageBitmap(file);
  try {
    const scale = Math.min(1,700 / Math.max(image.width,image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1,Math.round(image.width*scale));canvas.height = Math.max(1,Math.round(image.height*scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('PHOTO_INVALID');
    context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(image,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/jpeg',0.9);
  } finally { image.close(); }
}
