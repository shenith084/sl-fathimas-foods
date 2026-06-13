import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using env variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Missing file" }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: `sl-fathimas-foods/receipts`,
      public_id: `receipt_${Date.now()}`,
      overwrite: true,
      resource_type: "auto", // Allows PDF
    });

    return NextResponse.json({ success: true, url: uploadResponse.secure_url });
  } catch (err: any) {
    console.error("POST /api/v1/upload-receipt (Cloudinary) error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to upload receipt to Cloudinary" }, { status: 500 });
  }
}
