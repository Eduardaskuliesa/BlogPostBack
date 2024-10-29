import { Request, Response } from "express";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "../config/awsConfig";
import config from "../config/config";
import { v4 as uuidv4 } from "uuid";

const docClient = DynamoDBDocument.from(dynamoDBClient);
const dynamoTable = config.aws.dynamoTable;


export const createAuthor = async (req: Request, res: Response) => {
  try {
    const { name, surname } = req.body;

    if (!name || !surname) {
        res.status(400).json({
        success: false,
        error: "Name and surname are required",
      });
    }

    const newAuthor = {
      id: uuidv4(),
      name: name.trim(),
      surname: surname.trim(),
      createdAt: new Date().toISOString(),
    };

    await docClient.put({
      TableName: dynamoTable,
      Item: newAuthor,
    });

    res.status(201).json({
      success: true,
      data: newAuthor,
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      error: "Could not create author",
    });
  }
};

export const getAllAuthor = async (req: Request, res: Response) => {
  try {
    const result = await docClient.scan({
      TableName: dynamoTable,
    });
    const author = result.Items || [];
    res.json(author);
  } catch (error) {
    console.error("Get authors error:", error);
    res.status(500).json({ error: "Could not fetch authors" });
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await docClient.get({
      TableName: dynamoTable,
      Key: {
        id: id,
      },
    });

    if (!author.Item) {
      return res.status(404).json({ error: "Author not found" });
    }

    await docClient.delete({
      TableName: dynamoTable,
      Key: { id: id },
    });

    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could delete author" });
  }
};
