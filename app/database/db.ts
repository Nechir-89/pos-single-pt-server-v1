// https://stackoverflow.com/questions/34382796/where-should-i-initialize-pg-promise
import pgPromise from "pg-promise";
import dotenv from 'dotenv'

dotenv.config();
const PG_SSL = false
const PG_SERVER = 'warehouse'
const PG_HOST = 'localhost'
const PG_PORT = 5432
const PG_DBNAME = 'postgres'
const PG_USER = 'postgres'
const PG_PASSWORD = 'pgpass'

const pgp = pgPromise();

export const db = pgp(`${PG_SERVER}://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${Number(PG_PORT)}/${PG_DBNAME}`);
// we need to DATABASE_URL
// export const db = pgp({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DBNAME,
//   password: process.env.PG_PASSWORD,
//   port: Number(process.env.PG_PORT),
// });
