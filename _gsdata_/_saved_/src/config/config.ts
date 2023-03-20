import dotenv from 'dotenv';

dotenv.config();

const {
    PG_ROOT_USER,
    PG_ROOT_PASS,
    PG_ROOT_DB,
    POSTGRES_HOST,
    POSTGRES_PORT,
    PG_STORE_DB,
    PG_STORE_TEST_DB,
    PG_STORE_USER,
    PG_STORE_PASSWORD,
    ENV,
    BCRYPT_PASSWORD,
    SALT_ROUNDS,
    TOKEN_SECRET,
} = process.env;

export const config = {
    username: `${process.env.POSTGRES_USERNAME}`,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    aws_region: process.env.AWS_REGION,
    aws_profile: process.env.AWS_PROFILE,
    aws_media_bucket: process.env.AWS_BUCKET,
    url: process.env.URL,
    jwt: {
        secret: process.env.JWT_SECRET,
    },
};