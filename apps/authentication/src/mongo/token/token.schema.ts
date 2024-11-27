import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Authentication } from '../authentication/authentication.schema';

export type TokenDocument = mongoose.HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Authentication' })
  authentication_id: Authentication;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  refresh_token: string;

  @Prop({ type: mongoose.Schema.Types.String })
  device_token: string;

  @Prop({ type: mongoose.Schema.Types.String })
  OS: string;

  @Prop({ type: mongoose.Schema.Types.String })
  platform: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
