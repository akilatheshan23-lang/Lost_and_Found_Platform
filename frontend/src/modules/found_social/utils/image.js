export async function fileToDataUrl(file, maxBytes = 1_500_000) {
  if (!file) return "";
  if (file.size > maxBytes) {
    throw new Error("Image too large. Please choose an image under 1.5MB.");
  }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}
