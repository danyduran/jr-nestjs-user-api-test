import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDoc = Document & User;

@Schema()
export class User {
  _id: string;

  @Prop({ type: Date })
  createdAt: string;

  @Prop({ index: true })
  firstName: string;

  @Prop({ index: true })
  lastName: string;

  @Prop()
  password: string;

  @Prop({ type: Date })
  updatedAt: string;

  @Prop({ unique: true, index: true })
  username: string;

  @Prop({ unique: true, index: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
