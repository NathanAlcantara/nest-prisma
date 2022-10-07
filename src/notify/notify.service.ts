import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotifyService {
  constructor(private mailerService: MailerService) {}

  welcome(): void {
    this.mailerService
      .sendMail({
        to: 'test@nestjs.com',
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
          username: 'john doe',
          email: 'test@nestjs.com',
          password: '1234',
          loginUrl: 'https//localhost/login',
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

  resetPassword(): void {
    this.mailerService
      .sendMail({
        to: 'test@nestjs.com',
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
          resetPasswordUrl: 'https//localhost/resetPassword',
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
