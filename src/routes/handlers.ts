'use strict';
import * as Boom from '@hapi/boom';
import { User } from '../entities';
import { createToken } from './helpers';
import { getUserCounter } from './metrics';

export const status = (request, h) => {
  return { status: 'Alive!' };
};

export const createUser = async (request, h) => {
  const { username, password } = request.payload;
  const connection = request.getConnection().manager;
  const user = connection.save(User, { username, password });
  return {
    ...user,
    token: createToken(user.username),
  };
};

export const getUsers = async (request, h) => {
  const connection = request.getConnection().manager;

  try {
    // custom instrumentation
    getUserCounter.inc();
    // logging using pino, default hapi log or with pino decorated logger
    request.log(['api'], 'about to retrieve all users.')
    request.logger.info('info about to retrieve all users.')
    return connection.find(User);
  } catch (e) {
    throw Boom.badRequest('Unable to retrieve users', e);
  }
};
