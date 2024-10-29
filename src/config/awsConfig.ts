import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import config from "./config";

export const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accesKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const dynamoDBClient = new DynamoDBClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accesKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});
