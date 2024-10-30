import e, { Request, Response } from "express";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "../config/awsConfig";
import config from "../config/config";
import { v4 as uuidv4 } from "uuid";
import { error } from "console";

const docClient = DynamoDBDocument.from(dynamoDBClient);
const dynamoTable = config.aws.blogDynamo;

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, shortDescription, authorId } = req.body;
    const post = {
      id: uuidv4(),
      authorId,
      title,
      shortDescription,
      createdAt: new Date().toISOString(),
    };

    await docClient.put({
      TableName: dynamoTable,
      Item: post,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create blog post" });
  }
};

export const getAllPost = async (req: Request, res: Response) => {
  try {
    const result = await docClient.scan({
      TableName: dynamoTable,
    });
    res.json(result.Items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await docClient.get({
      TableName: dynamoTable,
      Key: { id },
    });

    if (!result.Item) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(result.Item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fecth blog post" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, shortDescription } = req.body;

    const result = await docClient.update({
      TableName: dynamoTable,
      Key: { id },
      UpdateExpression:
        "set title =:title, shortDescription = :desc, updatedAt =:date",
      ExpressionAttributeValues: {
        ":title": title,
        ":desc": shortDescription,
        ":date": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    });
    res.json(result.Attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update blog post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await docClient.delete({
      TableName: dynamoTable,
      Key: { id },
    });

    res.json({ message: "Post delete successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
};
