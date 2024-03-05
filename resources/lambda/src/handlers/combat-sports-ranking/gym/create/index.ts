import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { headers } from "../../../shared/headers/headers";
import { randomUUID } from "crypto";
import { KEY_DATA, KEY_GYM } from "../../../shared/constants";

const TableName = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

export interface AddGymBody {
  ownerIds: string[];
  coachIds: string[];
  gymName: string;
  gymLocations: string[];
}

export const CreateGymHandler = async (event: { body: any }) => {
  try {
    const { ownerIds, coachIds, gymName, gymLocations }: AddGymBody =
      JSON.parse(event.body);
    const response = {
      statusCode: 200,
      body: {
        message: `Successfully created gym ${gymName}`,
      },
    };

    const gymId = randomUUID();
    const pk = `${KEY_GYM}#${gymId}`;
    const sk = KEY_DATA;
    const data = {
      gymName,
      ownerIds,
      coachIds,
      gymLocations,
    };

    const command = new PutCommand({
      TableName,
      Item: {
        pk,
        sk,
        data,
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
    throw new Error("Error in gym creation: " + error);
  }
};
