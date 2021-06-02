'use strict';

import { Server } from '@hapi/hapi';
import { Options } from '@hapi/glue';
import * as Handlers from './handlers';
import * as Helpers from './helpers';
import * as Schemas from './schema';
import { getSummary, getContentType } from '@promster/hapi';

const register = async (server: Server, options: Options) => {
  server.route([
    {
      method: 'GET',
      path: '/status',
      options: {
        auth: false,
        tags: ['api'],
        description: 'Check if the service is alive',
        handler: Handlers.status,
      },
    },
    {
      method: 'GET',
      path: '/users',
      options: {
        tags: ['api', 'users'],
        description: 'Returns all users',
        notes: 'We should paginate instead of returning all users at once',
        handler: Handlers.getUsers,
      },
    },
    {
      method: 'POST',
      path: '/users',
      options: {
        auth: false,
        tags: ['api', 'users'],
        description: 'Creates a new user',
        pre: [
          {
            assign: 'userExists',
            method: Helpers.userExists,
          },
        ],
        handler: Handlers.createUser,
        validate: Schemas.createUser,
      },
    },
    {
      method: 'GET',
      path: '/metrics',
      options: {
        auth: false,
        tags: ['api', 'metrics'],
        handler: async (request, h) => {
          const summary = await getSummary();
          return h.response(summary).header('Content-Type', getContentType());
        },
      },
    },
  ]);
};

module.exports = {
  plugin: {
    register,
    name: 'routes',
    version: '1.0.0',
  },
};
