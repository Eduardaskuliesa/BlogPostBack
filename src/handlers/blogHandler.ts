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

const tableName = config.aws.blogDynamo;

export const createPost = async (event: APIGatewayProxyEvent) => {
  try {
    const { title, shorDescription, authorId } = JSON.parse(event.body || "{}");

    if (!title || !shorDescription || !authorId) {
      return createResponse(404, {
        success: false,
        message: "Title, shordesc, authorId is required",
      });
    }

    const blogPost = {
      id: uuidv4(),
      title: title.trim(),
      shorDescription: shorDescription.trim(),
      authorId: authorId.trim(),
      createAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: blogPost,
      })
    );

    return createResponse(200, {
      success: true,
      data: blogPost,
    });
  } catch (error) {
    console.error("Error creating blogPost:", error);
    return createResponse(500, {
      success: false,
      message: "Failed to create blogPost",
    });
  }
};

export const getAllPosts = async () => {
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
    console.error("Error getting posts:", error);
    return createResponse(500, {
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

export const getPost = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return createResponse(400, {
        success: false,
        message: "Post ID is required",
      });
    }

    const result = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    if (!result.Item) {
      return createResponse(404, {
        success: false,
        message: "Post not found",
      });
    }

    return createResponse(200, {
      success: true,
      data: result.Item,
    });
  } catch (error) {
    console.error("Error getting post:", error);
    return createResponse(500, {
      success: false,
      message: "Failed to fetch post",
    });
  }
};

export const deletePost = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return createResponse(400, {
        success: false,
        message: "Post ID is required",
      });
    }

    const post = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    if (!post.Item) {
      return createResponse(404, {
        success: false,
        message: "Post not found",
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
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return createResponse(500, {
      success: false,
      message: "Failed to delete post",
    });
  }
};

export const updatePost = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id;
    const { title, shorDescription } = JSON.parse(event.body || "{}");

    if (!id) {
      return createResponse(400, {
        success: false,
        message: "Post ID is required",
      });
    }

    if (!title || !shorDescription) {
      return createResponse(400, {
        success: false,
        message: "Title and shortDescription are required",
      });
    }

    const post = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    if (!post.Item) {
      return createResponse(404, {
        success: false,
        message: "Post not found",
      });
    }

    const result = await docClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id },
        UpdateExpression:
          "set title = :title, shorDescription = :shorDescription, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":title": title.trim(),
          ":shorDescription": shorDescription.trim(),
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
    console.error("Error updating post:", error);
    return createResponse(500, {
      success: false,
      message: "Failed to update post",
    });
  }
};
