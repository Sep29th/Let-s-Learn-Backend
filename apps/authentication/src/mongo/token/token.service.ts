import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './token.schema';
import { Model, RootFilterQuery, UpdateWriteOpResult } from 'mongoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class TokenRepositoryService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async getTokenByRefreshToken(refreshToken: string): Promise<Token> {
    return this.tokenModel.findOne({ refresh_token: refreshToken }).exec();
  }

  async updateTokenByRefreshToken(refreshToken: string, newRefreshToken: string): Promise<UpdateWriteOpResult> {
    return this.tokenModel.updateOne({ refresh_token: refreshToken }, { refresh_token: newRefreshToken }).exec();
  }

  async deleteTokenByRefreshToken(refreshToken: string): Promise<DeleteResult> {
    return this.tokenModel.deleteOne({ refresh_token: refreshToken }).exec();
  }

  async deleteManyTokenByAuthenticationId(authenticationId: string, exceptRefreshToken?: string) {
    let filter: RootFilterQuery<Token> = { authentication_id: authenticationId };
    if (exceptRefreshToken) filter.refresh_token = { $ne: exceptRefreshToken };
    return this.tokenModel.deleteMany(filter).exec();
  }
}
