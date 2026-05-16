import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.S3_API, // Tu URL de Cloudflare
    credentials: {
        accessKeyId: process.env.CLOUD_API!,
        secretAccessKey: process.env.CLOUD_API_SECRET!,
    },
});

export const uploadToR2 = async (file: Express.Multer.File): Promise<string> => {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    await s3.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));

    return `${process.env.R2_PUBLIC_URL}/${fileName}`;
};