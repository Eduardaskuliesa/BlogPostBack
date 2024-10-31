import { APIGatewayProxyEvent} from "aws-lambda";
import { docClient } from "../utils/dynamodb";
import {
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { createResponse } from "../utils/response";
import config from "../config/config";

const tableName = config.aws.authorDynamo;

export const createAuthor = async (event: APIGatewayProxyEvent) => {
  try {
    const { name, surname } = JSON.parse(event.body || "{}");

    if (!name || !surname) {
      return createResponse(400, {
        success: false,
        message: "Name and surname required",
      });
    }

    const author = {
      id: uuidv4(),
      name: name.trim(),
      surname: surname.trim(),
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: author,
      })
    );

    return createResponse(201, {
      success: true,
      data: author,
    });
  } catch (error) {
    console.error("Error creating author:", error);
    return createResponse(500, {
      success: false,
      message: "Failed to create author",
    });
  }
};

export const getAllAuthors = async () => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName,
      })
    );

    return createResponse(200, {
      success: true,
      data: result.Items,
    });
  } catch (error) {
    console.error("Error getting authors:", error);
    return createResponse(500, {
      success: false,
      message: "Failed to fetch authors",
    });
  }
};

export const deleteAuthor = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return createResponse(400, {
        success: false,
        message: "Author ID is required",
      });
    }

    // Check if author exists first
    const author = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    if (!author.Item) {
      return createResponse(404, {
        success: false,
        message: "Author not found",
      });
    }

    await docClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    return createResponse(200, {
      success: true,
      message: "Author deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting author:", error);
    return createResponse(500, {
      success: false,
      message: "Failed to delete author",
    });
  }
};

export const updateAuthor = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id;
    const { name, surname } = JSON.parse(event.body || "{}");

    if (!id) {
      return createResponse(400, {
        success: false,
        message: "Author ID is required",
      });
    }

    if (!name || !surname) {
      return createResponse(400, {
        success: false,
        message: "Name and surname required",
      });
    }
    
    const author = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    if (!author.Item) {
      return createResponse(404, {
        success: false,
        message: "Author not found",
      });
    }

    const result = await docClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id },
        UpdateExpression:
          "set #name = :name, surname = :surname, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": name.trim(),
          ":surname": surname.trim(),
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return createResponse(200, {
      success: true,
      data: result.Attributes,
    });
  } catch (error) {
    console.error("Error updating author:", error);
    return createResponse(500, {
      success: false,
      message: "Failed to update author",
    });
  }
};
