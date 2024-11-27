import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccountType, Authentication, AuthenticationDocument } from './authentication.schema';
import { CreateOptions, Model, MongooseBaseQueryOptionKeys, QueryOptions, RootFilterQuery, UpdateQuery, UpdateWithAggregationPipeline, UpdateWriteOpResult } from 'mongoose';
import { UpdateOptions } from 'mongodb';
import { InjectCache } from '@app/module/cache/decorators/inject-cache.decorator';
import { CacheService } from '@app/module/cache/interfaces';

@Injectable()
export class AuthenticationRepositoryService {
  constructor(
    @InjectModel(Authentication.name) private authenticationModel: Model<AuthenticationDocument>,
    @InjectCache('authentication') private readonly authenticationCache: CacheService,
  ) {}

  // Nếu sau này các truy vấn bằng Fields không phải ID, thì sử dụng kỹ thuật cache lookup

  async getAuthenticationById(id: string): Promise<AuthenticationDocument> {
    // read cache
    const cacheHit = await this.authenticationCache.get<AuthenticationDocument | boolean>(id);
    if (cacheHit) return cacheHit == true ? null : cacheHit;

    // write cache
    const auth = await this.authenticationModel.findById(id).exec();
    this.authenticationCache.set(auth._id.toString(), auth ?? true);

    return auth;
  }

  async getAuthenticationByNickname(nickname: string): Promise<AuthenticationDocument> {
    const auth = await this.authenticationModel.findOne({ nickname: nickname }).exec();
    this.authenticationCache.set(auth._id.toString(), auth ?? true);
    return auth;
  }

  async getAuthenticationByEmailAndAccountTypeOrNicknameOrPhoneNumber(email: string, accountType: AccountType, nickname?: string, phoneNumber?: string): Promise<AuthenticationDocument> {
    const query: any = { $or: [{ email, account_type: accountType }] };
    if (nickname) query.$or.push({ nickname: `@${nickname}` });
    if (phoneNumber) query.$or.push({ phone_number: phoneNumber });
    const auth = await this.authenticationModel.findOne(query).exec();
    this.authenticationCache.set(auth._id.toString(), auth ?? true);
    return auth;
  }

  async getAuthenticationByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<AuthenticationDocument> {
    const auth = await this.authenticationModel.findOne({ $or: [{ email: emailOrPhoneNumber }, { phone_number: emailOrPhoneNumber }] }).exec();
    this.authenticationCache.set(auth._id.toString(), auth ?? true);
    return auth;
  }

  async getAuthenticationByEmailOrPhoneNumberOrNickname(emailOrPhoneNumberOrNickname: string, accountType?: AccountType): Promise<AuthenticationDocument> {
    let filter: any = { $or: [{ email: emailOrPhoneNumberOrNickname, phone_number: emailOrPhoneNumberOrNickname, nickname: emailOrPhoneNumberOrNickname }] };
    if (accountType) filter.account_type = accountType;
    const auth = await this.authenticationModel.findOne(filter).exec();
    this.authenticationCache.set(auth._id.toString(), auth ?? true);
    return auth;
  }

  async createAuthentication(model: Partial<Authentication>, options?: CreateOptions): Promise<AuthenticationDocument> {
    const auth = (await this.authenticationModel.create([model], options))[0];
    this.authenticationCache.set(auth._id.toString(), auth ?? true);
    return auth;
  }

  async updateAuthentication(
    filter: RootFilterQuery<AuthenticationDocument>,
    update: UpdateWithAggregationPipeline | UpdateQuery<AuthenticationDocument>,
    options?: UpdateOptions & Pick<QueryOptions<AuthenticationDocument>, MongooseBaseQueryOptionKeys | 'timestamps'>,
  ): Promise<UpdateWriteOpResult> {
    return await this.authenticationModel.updateOne(filter, update, options).exec();
  }
}
