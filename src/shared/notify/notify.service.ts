import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { TokenType } from './token/token.enum';
import { TokenService } from './token/token.service';

@Injectable()
export class NotifyService {
  constructor(
    private mailerService: MailerService,
    private tokenService: TokenService,
  ) {}

  async welcome(user: User): Promise<void> {
    const token = await this.tokenService.create(
      TokenType.WELCOME,
      user.email,
      true,
    );

    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Welcome!!',
        template: 'welcome',
        attachments: [
          {
            filename: 'logo.png',
            path: process.cwd() + '/templates/images/logo.png',
            cid: 'logo',
          },
          {
            filename: 'welcome.jpg',
            path: process.cwd() + '/templates/images/welcome.jpg',
            cid: 'welcome',
          },
        ],
        context: {
          username: user.name,
          createPasswordUrl: `https//localhost/welcome/${token}`,
          unsubscribeUrl: 'https//localhost/unsubscribe',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async resetPassword(email: string): Promise<void> {
    const token = await this.tokenService.create(
      TokenType.RESET_PASSWORD,
      email,
      true,
    );

    this.mailerService
      .sendMail({
        to: email,
        subject: 'Reset Password',
        template: 'reset-password',
        attachments: [
          {
            filename: 'logo.png',
            path: process.cwd() + '/templates/images/logo.png',
            cid: 'logo',
          },
        ],
        context: {
          resetPasswordUrl: `https//localhost/resetPassword/${token}`,
          unsubscribeUrl: 'https//localhost/unsubscribe',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
