import { ITable } from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export type LambdaBaseProps = Omit<lambda.FunctionProps, "runtime" | "code"> & {
  codePath: string;
  table: ITable;
  region: string;
  layers?: lambda.ILayerVersion[];
};

export class LambdaBase {
  readonly lambdaFunction: lambda.Function;
  constructor(scope: Construct, id: string, props: LambdaBaseProps) {
    const { codePath, handler, table, region, layers } = props;

    this.lambdaFunction = new lambda.Function(scope, id + "Implementation", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler,
      code: lambda.Code.fromAsset(codePath),
      environment: {
        ["MAIN_TABLE"]: table.tableName,
        ["REGION"]: region,
      },
      layers,
    });
  }
}
