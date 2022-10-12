import * as Joi from 'joi';

enum Environment {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
}

interface EnvironmentVariables {
  NODE_ENV: Environment;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXP: number;
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  SMTP_HOST: string;
  SMTP_USER: string;
  SMTP_PASS: string;
}

export const validationSchema = Joi.object<EnvironmentVariables>({
  NODE_ENV: Joi.string()
    .valid(Environment.DEVELOPMENT, Environment.PRODUCTION)
    .default(Environment.DEVELOPMENT),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string()
    .default('postgresql://postgres:postgres@localhost:5432/postgres')
    .when('NODE_ENV', { is: Environment.PRODUCTION, then: Joi.required() }),
  JWT_SECRET: Joi.string()
    .default('s3cr3t')
    .when('NODE_ENV', { is: Environment.PRODUCTION, then: Joi.required() }),
  JWT_EXP: Joi.number().default(60),
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(10),
  SMTP_HOST: Joi.string()
    .default('smtp.ethereal.email')
    .when('NODE_ENV', { is: Environment.PRODUCTION, then: Joi.required() }),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
});
