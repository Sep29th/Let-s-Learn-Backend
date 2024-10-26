import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Authentication } from './authentication.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthenticationRepositoryService {
  constructor(@InjectModel(Authentication.name) private authenticationModel: Model<Authentication>) {}

  async getAuthenticationById(id: string): Promise<Authentication> {
    return this.authenticationModel.findById(id).exec();
  }

  async getAuthenticationByNickname(nickname: string): Promise<Authentication> {
    return this.authenticationModel.findOne({ nickname: nickname }).exec();
  }

  async getAuthenticationByEmail(email: string): Promise<Authentication> {
    return this.authenticationModel.findOne({ email: email }).exec();
  }

  async getAuthenticationByPhoneNumber(phoneNumber: string): Promise<Authentication> {
    return this.authenticationModel.findOne({ phone_number: phoneNumber }).exec();
  }

  async getAuthenticationByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<Authentication> {
    return this.authenticationModel.findOne({ $or: [{ email: emailOrPhoneNumber }, { phone_number: emailOrPhoneNumber }] }).exec();
  }
}
