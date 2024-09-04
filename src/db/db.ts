import knex from 'knex';
import dotenv from 'dotenv'

dotenv.config()

const configDB = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'ReferalProgram'
    },
    migrations: {
        directory: './migrations'
    }
}

export const db = knex(configDB);
