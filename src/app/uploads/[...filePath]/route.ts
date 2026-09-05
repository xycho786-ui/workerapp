import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// MIME type map for images and videos
const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".ogg": "video/ogg",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".pdf": "application/pdf",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filePath: string[] }> }
) {
  try {
    const { filePath } = await params;
    if (!filePath || filePath.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Sanitize path to prevent directory traversal
    const safeSubPath = filePath.map((p) => path.basename(p)).join("/");
    
    // Resolve absolute file path inside public/uploads
    const fullPath = path.join(process.cwd(), "public", "uploads", safeSubPath);

    try {
      const fileBuffer = await fs.readFile(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Fallback: try searching in flat public/uploads directory if subpath fails
      const fileName = path.basename(safeSubPath);
      const flatPath = path.join(process.cwd(), "public", "uploads", fileName);
      const fileBuffer = await fs.readFile(flatPath);
      const ext = path.extname(flatPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (error) {
    return new NextResponse("File Not Found", { status: 404 });
  }
}
