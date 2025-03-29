import { ConnectionPool } from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

let pool;

export async function getConnection() {
    if (!pool) {
        try {
            pool = new ConnectionPool(config);
            await pool.connect();
            console.log("Database connected successfully");
        } catch (error) {
            console.error("Database connection failed:", error);
            throw new Error("Failed to connect to the database");
        }
    }
    return pool;
}
