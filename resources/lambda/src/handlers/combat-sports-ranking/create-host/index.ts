import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const TableName = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

export const CreateHostHandler = async (event: { body: any }) => {
  try {
    const body = JSON.parse(event.body);
    const userName = body.userName;
    const response = {
      statusCode: 200,
      body: { message: "success", event },
    };

    const command = new PutItemCommand({
      TableName,
      Item: {
        pk: { S: `USER#${userName}` },
        sk: { S: `ROLE#HOST` },
        gsi1pk: { S: `HOST` },
        gsi1sk: { S: `USER#${userName}` },
      },
    });
    await docClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
      isBase64Encoded: false,
      headers: {
        "Content-Type": "application/json",
        // 👇 allow CORS for all origins
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
        "Access-Control-Allow-Credentials": "true", // Required for cookies, authorization headers with HTTPS
        "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE",
      },
    };
  } catch (error) {
    throw new Error("Error in host creation: " + error);
  }
};
