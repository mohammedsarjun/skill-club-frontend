function getMediaType(file: { url: string; mediaType?: string }) {
  if (file.mediaType) return file.mediaType;

  if (file.url.includes("/video/upload/")) return "video";
  if (file.url.includes("/image/upload/")) return "image";

  return "file";
}
export default getMediaType;