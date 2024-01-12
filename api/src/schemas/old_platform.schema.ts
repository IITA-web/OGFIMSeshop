import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  profileImage: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  alternateMobileNumber: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
