import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create directory if it doesn't exist
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique name
    const fileExtension = path.extname(file.name) || '.jpg';
    const filename = `${crypto.randomUUID()}${fileExtension}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ message: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
