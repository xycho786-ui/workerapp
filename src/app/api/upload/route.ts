import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload directory always at public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Infer appropriate file extension
    let fileExt = path.extname(file.name);
    if (!fileExt || fileExt === ".") {
      if (file.type.startsWith("image/")) {
        const mimeSub = file.type.split("/")[1] || "png";
        fileExt = `.${mimeSub === "jpeg" ? "jpg" : mimeSub}`;
      } else if (file.type.startsWith("video/")) {
        fileExt = `.${file.type.split("/")[1] || "mp4"}`;
      } else {
        fileExt = ".png";
      }
    }

    // Generate clean unique filename
    const fileId = crypto.randomUUID();
    const filename = `${fileId}${fileExt}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to public/uploads
    await fs.writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: relativeUrl }, { status: 200 });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
