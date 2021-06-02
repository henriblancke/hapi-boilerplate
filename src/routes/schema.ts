'use strict';

import * as Joi from '@hapi/joi';

export const createUser = {
  payload: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).label('CreateUser'),
};
