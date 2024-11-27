import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './token.schema';
import { CreateOptions, Model, MongooseBaseQueryOptionKeys, QueryOptions, RootFilterQuery, UpdateWriteOpResult } from 'mongoose';
import { DeleteOptions, DeleteResult, UpdateOptions } from 'mongodb';

@Injectable()
export class TokenRepositoryService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

  async getTokenByRefreshToken(refreshToken: string): Promise<TokenDocument> {
    return this.tokenModel.findOne({ refresh_token: refreshToken }).exec();
  }

  async updateTokenByRefreshToken(
    refreshToken: string,
    newRefreshToken: string,
    options?: UpdateOptions & Pick<QueryOptions<Token>, MongooseBaseQueryOptionKeys | 'timestamps'>,
  ): Promise<UpdateWriteOpResult> {
    return this.tokenModel.updateOne({ refresh_token: refreshToken }, { refresh_token: newRefreshToken }, options).exec();
  }

  async deleteTokenByRefreshToken(refreshToken: string, options?: DeleteOptions & Pick<QueryOptions<Token>, MongooseBaseQueryOptionKeys>): Promise<DeleteResult> {
    return this.tokenModel.deleteOne({ refresh_token: refreshToken }, options).exec();
  }

  async deleteManyTokenByAuthenticationId(
    authenticationId: string,
    exceptRefreshToken?: string,
    options?: DeleteOptions & Pick<QueryOptions<Token>, MongooseBaseQueryOptionKeys>,
  ): Promise<DeleteResult> {
    let filter: RootFilterQuery<Token> = { authentication_id: authenticationId };
    if (exceptRefreshToken) filter.refresh_token = { $ne: exceptRefreshToken };
    return this.tokenModel.deleteMany(filter, options).exec();
  }

  async createTokenByRefreshToken(model: Partial<Token>, options?: CreateOptions): Promise<TokenDocument> {
    return (await this.tokenModel.create([model], options))[0];
  }
}
