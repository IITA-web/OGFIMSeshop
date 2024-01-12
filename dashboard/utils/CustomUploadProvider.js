import fs from "fs";
import { S3 as AWS_S3, PutObjectCommand } from "@aws-sdk/client-s3";
import * as uuid from "uuid";
import { BaseProvider } from "@adminjs/upload";

class CustomUploadProvider extends BaseProvider {
  constructor(options, bucket) {
    super(bucket);

    this.s3 = new AWS_S3(options);
  }

  async upload(file, key) {
    try {
      console.log("uploading file");
      const tmpFile = fs.createReadStream(file.path);
      const fileName = `${uuid.v4()}-${key}`;
      const params = {
        Bucket: this.bucket,
        Key: fileName,
        Body: tmpFile,
        ACL: "public-read",
        ContentType: file.mimetype,
      };

      await this.s3.send(new PutObjectCommand(params));

      console.log(
        `File uploaded successfully. ${process.env.STORAGE_CDN}${fileName}`
      );
      return {
        url: `${process.env.STORAGE_CDN}${fileName}`,
        id: fileName,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async delete(key) {
    return this.s3.deleteObject({ Key: key, Bucket: this.bucket });
  }

  async path(key) {
    return `${process.env.STORAGE_CDN}${key}`;
    // return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
}

export default CustomUploadProvider;
