import * as Confidence from '@hapipal/confidence';

const criteria = {
  env: process.env.NODE_ENV,
};

const config = {
  $meta: 'This file configures the plot device.',
  projectName: 'Boilerplate',
  port: {
    web: {
      $filter: 'env',
      test: 8000,
      production: process.env.PORT,
      $default: 8000,
    },
  },
  authAttempts: {
    forIp: 25,
    forIpAndUser: 5,
  },
  system: {
    privateKeyPath: {
      $filter: 'env',
      test: process.env.JWT_PK_AUTH,
      production: process.env.JWT_PK_AUTH,
      $default: '../../.certs/api-jwt-private.pem',
    },
    publicKeyPath: {
      $filter: 'env',
      test: process.env.JWT_PUK_AUTH,
      production: process.env.JWT_PUK_AUTH,
      $default: '../../.certs/api-jwt-public.pem',
    },
  },
  email: {
    apiKey: {
      $filter: 'env',
      production: process.env.SENDGRID_API_KEY,
      $default: '',
    },
    fromAddress: {
      $filter: 'env',
      production: process.env.EMAIL_FROM_ADDRESS,
      $default: 'hello@domain.com',
    },
  },
  sentry: {
    release: `${process.env.APP_NAME}@${process.env.VERSION}`,
    dsn: process.env.SENTRY_DSN || false,
  },
};

const store = new Confidence.Store(config);

export const get = (key: string) => store.get(key, criteria);
export const meta = (key: string) => store.meta(key, criteria);
