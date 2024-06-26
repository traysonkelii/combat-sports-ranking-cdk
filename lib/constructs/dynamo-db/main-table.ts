import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface MainTableProps {
  tableName: string;
}

export class MainTable extends Construct {
  readonly table: Table;

  constructor(scope: Construct, name: string, props: MainTableProps) {
    super(scope, name);

    const { tableName } = props;

    this.table = new Table(scope, `${tableName}-impl`, {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      tableName: `${tableName}`,
      timeToLiveAttribute: "ExpiryDate",
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
