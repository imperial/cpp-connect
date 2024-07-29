import { PoolOptions } from "mysql2"
import mysql from "mysql2/promise"

// NOTE: This is a workaround to avoid creating multiple connections to the database
// See https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices for inspiration
const createMysqlPool = (): mysql.Pool => {
  return mysql.createPool(access)
}

const access: PoolOptions = {
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE_NAME,
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT ?? "3306"),
  password: process.env.MYSQL_PASSWORD,
}

declare const globalThis: {
  mysqlPoolGlobal: ReturnType<(typeof mysql)["createPool"]>
} & typeof global

const connection = globalThis.mysqlPoolGlobal ?? createMysqlPool()

export default connection

if (process.env.NODE_ENV !== "production") globalThis.mysqlPoolGlobal = connection
