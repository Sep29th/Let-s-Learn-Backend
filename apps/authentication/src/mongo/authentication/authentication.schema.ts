import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AuthenticationDocument = mongoose.HydratedDocument<Authentication>;

export enum AccountType {
  CREDENTIAL = 'CREDENTIAL',
  GOOGLE = 'GOOGLE',
  META = 'META',
}

export type RoleType = ('LEARNER' | 'TEACHER')[] | 'ACADEMY';

export enum Status {
  ACTIVE = 'ACTIVE',
  UNACTIVE = 'UNACTIVE',
  DELETED = 'DELETED',
  LOCKED = 'LOCKED',
}

@Schema({ timestamps: true })
export class Authentication {
  @Prop({ _id: true })
  _id: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.String, unique: true })
  nickname: string;

  @Prop({ type: mongoose.Schema.Types.String })
  avatar: string;

  @Prop({ type: mongoose.Schema.Types.String, unique: true })
  phone_number: string;

  @Prop({ type: mongoose.Schema.Types.Boolean, default: false })
  phone_number_verified: boolean;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.Boolean, default: false })
  email_verified: boolean;

  @Prop({ type: mongoose.Schema.Types.String, enum: Object.values(Status), default: Status.UNACTIVE })
  status: Status;

  @Prop({ type: mongoose.Schema.Types.String, enum: Object.values(AccountType), required: true })
  account_type: AccountType;

  @Prop([{ type: mongoose.Schema.Types.Mixed, required: true }])
  roles: RoleType;
}

export const AuthenticationSchema = SchemaFactory.createForClass(Authentication);
