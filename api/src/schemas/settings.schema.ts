import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SystemDocument = System & Document;

@Schema()
export class System {
  @Prop({ required: true })
  termsAndConditions: string;

  @Prop({ required: true })
  termsAndConditionsLastUpdated: Date;

  @Prop({ required: true })
  privacyPolicyLastUpdated: Date;

  @Prop({ required: true })
  privacyPolicy: string;

  @Prop()
  facebook: string;

  @Prop()
  twitter: string;

  @Prop()
  instagram: string;

  @Prop()
  linkedin: string;
}

export const SystemSchema = SchemaFactory.createForClass(System);
