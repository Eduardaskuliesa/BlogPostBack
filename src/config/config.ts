import * as dotenv from 'dotenv';

dotenv.config();

const {
  SERVER_PORT,
  SERVER_DOMAIN,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  DYNAMODB_TABLE,
  S3_BUCKET_NAME,
  JWT_SECRET,
  JWT_TIME
} = process.env;

if (
  SERVER_PORT === undefined
  || SERVER_DOMAIN === undefined
  || AWS_REGION === undefined
  || AWS_ACCESS_KEY_ID === undefined
  || AWS_SECRET_ACCESS_KEY === undefined
) {
  throw new Error("Please define constants in '.env' file");
}

const config = {
  server: {
    domain: SERVER_DOMAIN,
    port: SERVER_PORT,
  },
  aws: {
    region: AWS_REGION,
    accesKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    dynamoTable: DYNAMODB_TABLE,
    s3Bucket: S3_BUCKET_NAME,
  },
  jwt:{
   jwtSecret: JWT_SECRET,
   jwtTime: JWT_TIME
  }
};

export default config;