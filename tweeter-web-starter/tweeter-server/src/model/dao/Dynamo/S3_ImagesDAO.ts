import {ObjectCannedACL, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {ImagesDAO} from "../interfaces/ImagesDAO";

export class S3_ImagesDAO implements ImagesDAO {
  readonly BUCKET = "jacobt-tweeter-images";

  async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: this.BUCKET,
      Key: "images/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client();
    try {
      await client.send(c);
      return `https://${this.BUCKET}.s3.amazonaws.com/images/${fileName}`;
    } catch (error) {
      throw Error("[Server Error] s3 put image failed with: " + error);
    }
  }
}