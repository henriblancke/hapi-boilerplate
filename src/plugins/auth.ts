'use strict';
import * as fs from 'fs';
import * as Path from 'path';
import * as Config from '../config';
import { Server } from '@hapi/hapi';
import { Options } from '@hapi/glue';

const puk = fs.readFileSync(
  Path.resolve(__dirname, Config.get('/system/publicKeyPath')),
);

const register = async (server: Server, options: Options, next: Function) => {
  server.auth.strategy('jwt', 'jwt', {
    keys: {
      key: puk,
      algorithms: ['ES512'],
    },
    verify: {
      aud: 'twine',
      iss: 'twine',
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 120, // 4 hours
      timeSkewSec: 0,
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload.user },
      };
    },
  });

  // Set the strategy
  server.auth.default('jwt');
};

module.exports = {
  plugin: {
    register,
    name: 'auth',
    version: '1.0.0',
  },
};
