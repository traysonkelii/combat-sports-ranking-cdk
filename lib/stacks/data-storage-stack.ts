import * as cdk from "aws-cdk-lib";
import {
  AttributeType,
  GlobalSecondaryIndexProps,
  ProjectionType,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { MainTable } from "../constructs/dynamo-db/main-table";

export class DataStorageStack extends cdk.Stack {
  public readonly tableArn: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new MainTable(this, "CombatSportsRankingMainTable").table;

    const gsi1: GlobalSecondaryIndexProps = {
      indexName: "GSI-1",
      partitionKey: { name: "gsi1pk", type: AttributeType.STRING },
      sortKey: { name: "gsi1sk", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    };

    const gsi2: GlobalSecondaryIndexProps = {
      indexName: "GSI-2",
      partitionKey: { name: "gsi2pk", type: AttributeType.STRING },
      sortKey: { name: "gsi2sk", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    };

    const gsi3: GlobalSecondaryIndexProps = {
      indexName: "GSI-3",
      partitionKey: { name: "gsi3pk", type: AttributeType.STRING },
      sortKey: { name: "gsi3sk", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    };

    table.addGlobalSecondaryIndex(gsi1);
    table.addGlobalSecondaryIndex(gsi2);
    table.addGlobalSecondaryIndex(gsi3);

    this.tableArn = table.tableArn;

    /**
     * TODO: Monitoring Stack
     */
  }
}
