'use strict';
import * as fs from 'fs';
import * as Path from 'path';
import * as Config from '../config';
import * as jwt from '@hapi/jwt';
import * as Boom from '@hapi/boom';
import { User } from '../entities';

const pk = fs.readFileSync(
  Path.resolve(__dirname, Config.get('/system/privateKeyPath')),
);

export const createToken = (user, expiresIn = 14400) => {
  return jwt.token.generate(
    {
      aud: 'twine',
      iss: 'twine',
      user: user,
      group: 'twine',
    },
    {
      key: pk,
      algorithm: 'ES512',
    },
    {
      ttlSec: expiresIn,
    },
  );
};

export const userExists = async (request, h) => {
  const { username } = request.payload;
  const connection = request.getConnection().manager;
  const user = await connection.findOne(User, { username });

  if (user) {
    throw Boom.conflict('Username already in use.');
  }

  return h.continue;
};
