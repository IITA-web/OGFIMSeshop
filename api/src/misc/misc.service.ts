import { System } from './../schemas/settings.schema';
import * as uuid from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  S3,
  PutObjectCommand,
  PutObjectCommandInput,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class MiscService {
  s3 = new S3({
    forcePathStyle: false,
    endpoint: process.env.STORAGE_ENDPOINT,
    region: process.env.STORAGE_REGION,
    credentials: {
      accessKeyId: process.env.STORAGE_KEY,
      secretAccessKey: process.env.STORAGE_SECRET,
    },
  });

  constructor(
    @InjectModel(System.name, 'NEW')
    private systemModel: mongoose.Model<System>,
  ) {}

  async uploadFile(file) {
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      process.env.STORAGE_NAME,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const fileName = `${uuid.v4()}-${name}`;
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: fileName,
      Body: file,
      ACL: 'public-read' as ObjectCannedACL,
      ContentType: mimetype,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));

      return {
        url: `${process.env.STORAGE_CDN}${fileName}`,
        id: fileName,
      };
    } catch (e) {
      throw new BadRequestException('Error uploading file: ' + e.message);
    }
  }

  async deleteFile(key: string) {
    try {
      await this.s3.deleteObject({
        Key: key,
        Bucket: process.env.STORAGE_NAME,
      });

      return true;
    } catch (e) {
      throw new BadRequestException('Error deleting file: ' + e.message);
    }
  }

  async getPrivacyPolicy() {
    const system = await this.systemModel.find();

    if (system && system.length === 0) {
      return {
        content: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
        lastUpdated: new Date(),
      };
    } else {
      return {
        content: system[0].privacyPolicy,
        lastUpdated: system[0].privacyPolicyLastUpdated,
      };
    }
  }

  async getTermsAndConditions() {
    const system = await this.systemModel.find();

    if (system && system.length === 0) {
      return {
        content: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
        lastUpdated: new Date(),
      };
    } else {
      return {
        content: system[0].termsAndConditions,
        lastUpdated: system[0].termsAndConditionsLastUpdated,
      };
    }
  }

  async getSocialMedia() {
    const system = await this.systemModel.find();

    if (system && system.length === 0) {
      return {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
      };
    } else {
      return {
        facebook: system[0].facebook,
        twitter: system[0].twitter,
        instagram: system[0].instagram,
        linkedin: system[0].linkedin,
      };
    }
  }
}
