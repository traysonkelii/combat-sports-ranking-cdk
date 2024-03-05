import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GSI1_INDEX, GSI1_PK, GSI1_SK, Roles } from "../../../shared/constants";
import { headers } from "../../../shared/headers/headers";

const TableName = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

export interface GetRoleBody {
  role: Roles;
}

export const GetUsersByRoleHandler = async (event: { body: any }) => {
  const body: GetRoleBody = JSON.parse(event.body);

  const params = {
    TableName,
    IndexName: GSI1_INDEX,
    KeyConditionExpression: `${GSI1_PK} = :gsi1pk and begins_with(${GSI1_SK}, :gsi1sk)`,
    ExpressionAttributeValues: {
      ":gsi1pk": body.role,
      ":gsi1sk": `${body.role}#`,
    },
  };

  try {
    const command = new QueryCommand(params);
    const results = await docClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Query executed successfully",
        items: results.Items,
      }),
      isBase64Encoded: false,
      headers,
    };
  } catch (error) {
    console.error("Error executing query:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error executing query",
        error,
      }),
    };
  }
};
