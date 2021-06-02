'use strict';

require('dotenv-safe').config({ allowEmptyValues: true });

module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_NAME || 'authentication',
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrationsRun: true,
    entities: ['src/entities/**/*.{ts,js}'],
    migrations: ['src/migrations/**/*.{ts,js}'],
    subscribers: ['src/subscribers/**/*.{ts,js}'],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers'
    }
};
