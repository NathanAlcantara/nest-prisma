import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { intervalToDuration } from 'date-fns';
import { promisify } from 'util';
import { TokenType } from './token.enum';

@Injectable()
export class TokenService {
  private readonly algorithm = 'aes-256-ctr';
  private readonly iv = randomBytes(16);

  private password: string;

  constructor() {
    this.password = 'Password used to generate key';
  }

  create(type: TokenType, email: string, toUrl = false): Promise<string> {
    return this.encrypt(`${type}-${email}-${Date.now()}`, toUrl);
  }

  async getEmail(tokenInput: string) {
    const token = await this.decrypt(tokenInput);

    const tokenIsValid = this.validateExpirationDate(token);

    if (!tokenIsValid) {
      throw new UnauthorizedException();
    }

    return token.split('-')[1];
  }

  private validateExpirationDate(token: string) {
    const tokenSplitted = token.split('-');

    const tokenType = tokenSplitted[0] as TokenType;
    const tokenCreationDate = tokenSplitted[2];

    const tokenDuration: Duration = intervalToDuration({
      start: new Date(parseInt(tokenCreationDate)),
      end: new Date(Date.now()),
    });

    if (tokenType === TokenType.WELCOME) {
      return tokenDuration.weeks ? tokenDuration.weeks < 2 : true;
    } else {
      return tokenDuration.days < 2;
    }
  }

  private async encrypt(textToEncrypt: string, toUrl = false): Promise<string> {
    const key = await this.generateKey();

    const cipher = createCipheriv(this.algorithm, key, this.iv);

    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    return encryptedText.toString(`base64${toUrl ? 'url' : ''}`);
  }

  private async decrypt(encryptedText: string): Promise<string> {
    const encryptedBuffer = Buffer.from(encryptedText, 'base64');

    const key = await this.generateKey();

    const decipher = createDecipheriv(this.algorithm, key, this.iv);
    const decryptedText = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }

  private async generateKey() {
    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    return (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
  }
}
