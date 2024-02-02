import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const region = process.env.REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

export const put = (command: PutCommand) => docClient.send(command);
export const update = (command: UpdateCommand) => docClient.send(command);

export const query = (input: QueryCommandInput) => {
  const command = new QueryCommand(input);
  client.send(command);
};
