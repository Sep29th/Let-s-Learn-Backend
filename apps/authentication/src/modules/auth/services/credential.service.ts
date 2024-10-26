import { Injectable } from '@nestjs/common';
import { Auth } from '../classes/auth.class';
import { Observable } from 'rxjs';
import { IToken } from '../interfaces/token.interface';

@Injectable()
export class CredentialService extends Auth {
  signIn(...args: any): IToken | Promise<IToken> | Observable<IToken> {
    throw new Error('Method not implemented.');
  }
}
