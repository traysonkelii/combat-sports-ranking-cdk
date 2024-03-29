import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { KEY_ROLE, KEY_USER, Roles } from "../../../shared/constants";
import { headers } from "../../../shared/headers/headers";

const TableName = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

export interface AddRoleBody {
  userName: string;
  role: Roles;
  firstName: string;
  lastName: string;
}

export const CreateRoleHandler = async (event: { body: any }) => {
  try {
    const { userName, role, firstName, lastName }: AddRoleBody = JSON.parse(
      event.body
    );
    const response = {
      statusCode: 200,
      body: { message: `Successfully add the ${role} role to ${userName}` },
    };

    const command = new PutCommand({
      TableName,
      Item: {
        pk: `${KEY_USER}#${userName}`,
        sk: `${KEY_ROLE}#${role}`,
        gsi1pk: `${role}`,
        gsi1sk: `${role}#${userName}`,
        data: {
          firstName,
          lastName,
        },
      },
    });
    await docClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
      isBase64Encoded: false,
      headers,
    };
  } catch (error) {
    throw new Error("Error in role creation: " + error);
  }
};
