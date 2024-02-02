import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export interface PostAuthenticationProps {
  version: string;
  region: string;
  userPoolId: string;
  userName: string;
  callerContext: {
    awsSdkVersion: string;
    clientId: string;
  };
  triggerSource: string;
  request: {
    userAttributes: {
      sub: string;
      email_verified: string;
      birthdate: string;
      "cognito:user_status": string;
      "cognito:email_alias": string;
      given_name: string;
      family_name: string;
      email: string;
    };
    newDeviceUsed: boolean;
  };
  response: {};
}

const table = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

export const PostAuthenticationHandler = async (
  event: PostAuthenticationProps
) => {
  try {
    const pk = `USER#${event.userName}`;
    const sk = `DATA`;

    const putParams = new UpdateCommand({
      TableName: table,
      Key: {
        pk: pk,
        sk: sk,
      },
      UpdateExpression: "SET LastLogin = :lastLogin",
      ExpressionAttributeValues: {
        ":lastLogin": Date.now(),
      },
      ReturnValues: "ALL_NEW",
    });

    await docClient.send(putParams);
    return event;
  } catch (error: any) {
    throw new Error("Error with account creation: " + error);
  }
};
