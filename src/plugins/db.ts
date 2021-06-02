'use strict';

import { createConnection } from 'typeorm';
import { Server } from '@hapi/hapi';
import { Options } from '@hapi/glue';

const register = async (server: Server, options: Options, next: Function) => {
  const connection = await createConnection();
  console.log('Connected to database.');
  server.decorate('request', 'getConnection', () => {
    return connection;
  });
};

module.exports = {
  plugin: {
    register,
    name: 'db-wrapper',
    version: '1.0.0',
  },
};
