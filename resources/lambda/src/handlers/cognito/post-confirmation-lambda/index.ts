import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export interface PostConfirmationProps {
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
  };
  response: {};
}

const table = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

export const PostConfirmationHandler = async (event: PostConfirmationProps) => {
  try {
    const userData = event.request.userAttributes;
    const pk = `USER#${event.request.userAttributes.sub}`;
    const sk = `DATA`;

    const data = {
      firstName: userData.given_name,
      lastName: userData.family_name,
      email: userData.email,
      birth: userData.birthdate,
    };

    const putParams = new PutCommand({
      TableName: table,
      Item: {
        pk: pk,
        sk: sk,
        Data: data,
      },
      ReturnValues: "ALL_OLD",
    });

    await docClient.send(putParams);
    return event;
  } catch (error: any) {
    throw new Error("Error with account creation: " + error);
  }
};
