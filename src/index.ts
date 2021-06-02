'use strict';

require('dotenv-safe').config({
  allowEmptyValues: true,
  example: '.env.example',
});

import * as Config from './config';
import * as Glue from '@hapi/glue';
const { createPlugin } = require('@promster/hapi');

// Catch unhandling unexpected exceptions
process.on('uncaughtException', (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
  // application specific logging, throwing an error, or other logic here
});

// Catch unhandling rejected promises
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const manifest = {
  server: {
    port: Config.get('/port/web'),
  },
  register: {
    plugins: [
      { plugin: '@hapi/jwt' },
      { plugin: '@hapi/inert' },
      {
        plugin: '@hapi/vision',
      },
      {
        // prometheus
        plugin: createPlugin(),
      },
      {
        plugin: 'hapi-pino',
        options: {
          prettyPrint: process.env.NODE_ENV !== 'production',
          // Redact Authorization headers, see https://getpino.io/#/docs/redaction
          redact: ['req.headers.authorization'],
        },
      },
      {
        plugin: 'hapi-sentry',
        options: {
          client: {
            dsn: Config.get('/sentry/dsn'),
            release: Config.get('/sentry/release'),
            environment: process.env.NODE_ENV,
          },
          catchLogErrors: true,
        },
      },
      {
        plugin: 'hapi-swagger',
        options: {
          info: {
            title: 'Boilerplate API Documentation',
          },
        },
      },
      {
        plugin: 'blipp',
        options: { showAuth: true },
      },
      {
        plugin: '@hapi/good',
        options: {
          reporters: {
            console: [
              {
                module: '@hapi/good-squeeze',
                name: 'Squeeze',
                args: [
                  {
                    response: '*',
                    log: '*',
                    error: '*',
                  },
                ],
              },
              {
                module: '@hapi/good-console',
              },
              'stdout',
            ],
          },
        },
      },
      { plugin: './plugins/db' },
      { plugin: './plugins/auth' },
      {
        plugin: './routes',
        routes: { prefix: '/v1' },
      },
    ],
  },
};

const startServer = async function () {
  try {
    const server = await Glue.compose(manifest, {
      relativeTo: __dirname,
    });
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
