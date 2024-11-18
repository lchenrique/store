import { env } from "@/env";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// Configurações de conexão para o bucket
const s3Config = {
  endpoint: env.S3_END_POINT, // Endpoint local do Supabase
  region: "local", // Região configurada como "local" para o Supabase local
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
};

const s3Client = new S3Client(s3Config);

export async function uploadImage(file: File, folder: string, filename:string): Promise<string> {
  try {
    const buffer = await file.arrayBuffer(); // Converte o File para ArrayBuffer

    const uploadParams = {
      Bucket: "store-images",
      Key: `${folder}/${filename}`,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    const imageUrl = `${s3Config.endpoint.replace("/s3", "/object/public")}/store-images/${folder}/${filename}`;
    console.log("Image uploaded successfully:", imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}



export async function deleteImage(imageUrl: string, folder: string): Promise<void> {
  try {
    // Extrair o nome do arquivo da URL
    const filename = imageUrl.split('/').pop();
    
    if (!filename) {
      throw new Error("Invalid image URL");
    }

    const deleteParams = {
      Bucket: "store-images",
      Key: `${folder}/${filename}`,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);

    console.log("Image deleted successfully:", filename);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

