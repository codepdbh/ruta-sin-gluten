import { apiFetch } from "../client";

export function uploadMedia(file: File) {
  const body = new FormData();
  body.append("file", file);

  return apiFetch<{
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>("/media/upload", {
    method: "POST",
    auth: true,
    body,
  });
}
