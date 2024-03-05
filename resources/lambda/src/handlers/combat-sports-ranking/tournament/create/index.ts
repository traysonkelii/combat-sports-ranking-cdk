import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { KEY_DATA, KEY_HOST, KEY_TOURNAMENT } from "../../../shared/constants";
import { headers } from "../../../shared/headers/headers";

const TableName = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });

export interface AddTournamentBody {
  userName: string;
}

export const CreateTournamentHandler = async (event: { body: any }) => {
  try {
    const body: AddTournamentBody = JSON.parse(event.body);
    const userName = body.userName;
    const response = {
      statusCode: 200,
      body: {
        message: `Successfully created the tournament role for ${userName}`,
      },
    };
    const tournamentID = randomUUID();
    const params = {
      TransactItems: [
        {
          Put: {
            TableName,
            Item: {
              pk: { S: `${KEY_TOURNAMENT}#${tournamentID}` },
              sk: { S: `${KEY_TOURNAMENT}#${tournamentID}` }, // Using sort key
              gsi1pk: { S: `${KEY_HOST}#${userName}` },
              gsi1sk: { S: `${KEY_HOST}#${userName}` },
              createdAt: { S: new Date().toISOString() }, // Example of adding a timestamp
            },
          },
        },
        {
          Put: {
            TableName,
            Item: {
              pk: { S: `${KEY_TOURNAMENT}#${tournamentID}` },
              sk: { S: `${KEY_DATA}` }, // Using sort key
              gsi1pk: { S: `${KEY_TOURNAMENT}` },
              gsi1sk: { S: `${KEY_TOURNAMENT}#${tournamentID}` },
              createdAt: { S: new Date().toISOString() }, // Example of adding a timestamp
            },
          },
        },
      ],
    };

    const command = new TransactWriteItemsCommand(params);
    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      isBase64Encoded: false,
      headers,
    };
  } catch (error) {
    throw new Error("Error in tournament creation: " + error);
  }
};
