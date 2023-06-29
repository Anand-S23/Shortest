import { Pool } from 'pg';
import { createClient } from 'redis';

export const pg_pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password123',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB || 'shortest_db'
});

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380';
export const redis_client = createClient({
    url: REDIS_URL
});

// TODO: Error handling
export const query = async (query: string, params: any[]) => {
    const {rows, fields} = await pg_pool.query(query, params);
    return rows;
}

