import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { KEY_DATA, KEY_HOST, KEY_TOURNAMENT } from "../../../shared/constants";
import { headers } from "../../../shared/headers/headers";
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const TableName = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export interface AddTournamentBody {
  host: string;
  tournamentName: string;
  dateStart?: string;
  dateEnd?: string;
  location?: string;
}

export const CreateTournamentHandler = async (event: { body: any }) => {
  try {
    const body: AddTournamentBody = JSON.parse(event.body);
    const userName = body.host;
    const data = {
      dateStart: body.dateStart ?? "",
      dateEnd: body.dateEnd ?? "",
      location: body.location ?? "",
      tournamentName: body.tournamentName,
    };

    console.log("body: ", data);

    const response = {
      statusCode: 200,
      body: {
        message: `Successfully created the tournament role for ${userName}`,
      },
    };

    const tournamentID = body.tournamentName;
    const params = {
      TransactItems: [
        {
          Put: {
            TableName,
            Item: {
              pk: `${KEY_TOURNAMENT}#${tournamentID}`,
              sk: `${KEY_TOURNAMENT}#${tournamentID}`,
              gsi1pk: `${KEY_HOST}#${userName}`,
              gsi1sk: `${KEY_HOST}#${userName}`,
              createdAt: new Date().getTime(),
            },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
        {
          Put: {
            TableName,
            Item: {
              pk: `${KEY_TOURNAMENT}#${tournamentID}`,
              sk: `${KEY_DATA}`,
              gsi1pk: `${KEY_TOURNAMENT}`,
              gsi1sk: `${KEY_TOURNAMENT}#${tournamentID}`,
              createdAt: new Date().getTime(),
              data: data,
            },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
      ],
    };

    const results = await ddbDocClient.send(new TransactWriteCommand(params));

    console.log(results);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      isBase64Encoded: false,
      headers,
    };
  } catch (error: any) {
    console.error("Error in creating tournament:", error);
    // Here, ensure the error is serialized properly
    const message =
      typeof error === "string" ? error : error.message || "Unknown error";

    const isConditionalCheckFailed = /ConditionalCheckFailed/.test(message);

    const errorMessage = isConditionalCheckFailed
      ? "Tournament with that name already exists."
      : `Error in creating tournament: ${error.message || "Unknown error"}`;

    return {
      statusCode: isConditionalCheckFailed ? 409 : 500,
      body: JSON.stringify({
        error: `Error in creating tournament: ${errorMessage}`,
      }),
      headers,
    };
  }
};
