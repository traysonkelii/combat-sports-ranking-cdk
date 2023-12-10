import { AttributeType, StreamViewType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class MainTable extends Construct {
  readonly table: Table;

  constructor(scope: Construct, name: string) {
    super(scope, name);

    this.table = new Table(scope, "CombatSportsRanking-MainTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      tableName: "CombatSportsRanking",
      timeToLiveAttribute: "ExpiryDate",
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });
  }
}
