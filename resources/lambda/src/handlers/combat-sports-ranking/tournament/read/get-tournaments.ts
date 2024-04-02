import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  GSI1_INDEX,
  GSI1_PK,
  GSI1_SK,
  KEY_TOURNAMENT,
  TournamentPartitionKey,
} from "../../../shared/constants";
import { headers } from "../../../shared/headers/headers";

const TableName = process.env.MAIN_TABLE || "CombatSportsRanking";
const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

export interface GetTournamentBody {
  tournamentPartition: TournamentPartitionKey;
}

export const GetTournamentsHandler = async (event: { body: any }) => {
  const body: GetTournamentBody = JSON.parse(event.body);
  const sortKey = buildSortKey(body.tournamentPartition ?? "LIVE");
  const params = {
    TableName,
    IndexName: GSI1_INDEX,
    KeyConditionExpression: `${GSI1_PK} = :gsi1pk and begins_with(${GSI1_SK}, :gsi1sk)`,
    ExpressionAttributeValues: {
      ":gsi1pk": `${KEY_TOURNAMENT}`,
      ":gsi1sk": `${sortKey}`,
    },
  };
  try {
    const command = new QueryCommand(params);
    const results = await docClient.send(command);

    const data = results.Items?.map((dynamoTournament) => {
      return {
        tournamentName: dynamoTournament.pk.split("#")[1],
        data: dynamoTournament.data,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Get Tournament query executed successfully",
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

const buildSortKey = (tournamentPartition: TournamentPartitionKey) => {
  const base = `${KEY_TOURNAMENT}#`;
  switch (tournamentPartition) {
    case "ALL":
      return base;
    case "LIVE":
      return base + "LIVE#";
    case "DONE":
      return base + "DONE#";
  }
};
