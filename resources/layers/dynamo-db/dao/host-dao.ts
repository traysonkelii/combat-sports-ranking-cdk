// import { PutItemCommand } from "@aws-sdk/client-dynamodb";
// import { put } from "../dynamo-db-client";

// const TableName = process.env.MAIN_TABLE || "CombatSportsRanking";

// export interface CreateHostDaoProps {
//   pk: string;
//   sk: string;
//   gsi1pk: string;
//   gsi1sk: string;
// }

// export const createHostDao = async ({
//   pk,
//   sk,
//   gsi1pk,
//   gsi1sk,
// }: CreateHostDaoProps) => {
//   const command = new PutItemCommand({
//     TableName,
//     Item: {
//       pk: { S: pk },
//       sk: { S: sk },
//       gsi1pk: { S: gsi1pk },
//       gsi1sk: { S: gsi1sk },
//     },
//   });

//   await put(command);
// };
