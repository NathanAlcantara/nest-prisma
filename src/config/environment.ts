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
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
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
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(10),
});
