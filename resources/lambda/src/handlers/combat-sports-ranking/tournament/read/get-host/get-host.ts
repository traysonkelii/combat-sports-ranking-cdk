import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { KEY_TOURNAMENT } from "../../../../shared/constants";
import { headers } from "../../../../shared/headers/headers";

const TableName = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

export interface GetTournamentHostBody {
  tournamentId: string;
}

export const GetTournamentHostHandler = async (event: { body: any }) => {
  const body: GetTournamentHostBody = JSON.parse(event.body);
  const pk = `${KEY_TOURNAMENT}#${body.tournamentId}`;
  const sk = `${KEY_TOURNAMENT}#${body.tournamentId}`;
  const params = {
    TableName,
    Key: {
      pk: `${pk}`,
      sk: `${sk}`,
    },
  };
  try {
    const command = new GetCommand(params);
    const result = await docClient.send(command);
    const host = result.Item
      ? result.Item.gsi1pk.split("#")[1]
      : "No Host ID found";
    const data = {
      host,
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Get Tournament Host query executed successfully",
        data,
      }),
      isBase64Encoded: false,
      headers,
    };
  } catch (error) {
    console.error("Error executing get tournament query:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error executing tournament query",
        error,
      }),
    };
  }
};
