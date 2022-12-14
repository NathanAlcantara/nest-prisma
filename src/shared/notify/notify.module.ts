import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotifyService } from './notify.service';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: 587,
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: '"Contact No-Reply" <contact@no-reply.com>',
        },
        template: {
          dir: process.cwd() + '/templates/pages',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: process.cwd() + '/templates/partials',
            options: {
              strict: true,
            },
          },
        },
      }),
    }),
    TokenModule,
  ],
  exports: [NotifyService, TokenModule],
  providers: [NotifyService],
})
export class NotifyModule {}
