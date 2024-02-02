import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

const send = (command: any) => docClient.send(command);
const put = (command: PutItemCommand) => docClient.send(command);
const update = (command: UpdateCommand) => docClient.send(command);
const query = (input: QueryCommandInput) => {
  const command = new QueryCommand(input);
  client.send(command);
};

export const dbClient = {
  put,
  update,
  query,
  send,
};
