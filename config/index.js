require('dotenv').config()

const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
    MYSQL_PORT,
    REDIS_HOST,
    REDIS_PORT,
    PORT = 8803,
    isProd = false,
    HOST = 'localhost',
    JWT_SECRET,
} = process.env

const objconf = {
    host: HOST,
    port: PORT,
    secret: JWT_SECRET,
    db_host: MYSQL_HOST,
    db_user: MYSQL_USER,
    db_password: MYSQL_PASSWORD,
    db_database: MYSQL_DATABASE,
    db_port: MYSQL_PORT,
    redis_host: REDIS_HOST,
    redis_port: REDIS_PORT,
    isProd: isProd,
}

module.exports = objconf
