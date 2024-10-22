import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.DB_PORT
});

export const query = async (text, params) => {
    // invocation timestamp for the query
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        //time elapsed since invocation to execution
        const duration = Date.now() - start;
        console.log(
            'executed query',
            { text, duration, rows: res.rowCount }
        );
        return res;

    } catch (error) {
        console.log('error in query', { text });
        throw error;
    }
};