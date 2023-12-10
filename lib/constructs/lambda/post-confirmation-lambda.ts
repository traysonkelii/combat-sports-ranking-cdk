import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface PostConfirmationLambdaProps {
  table: ITable;
  region: string;
}

export class PostConfirmationLambda extends Construct {
  readonly lambdaFunction: lambda.Function;
  constructor(
    scope: Construct,
    id: string,
    { table, region }: PostConfirmationLambdaProps
  ) {
    super(scope, id);

    this.lambdaFunction = new lambda.Function(this, id + "Implementation", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.postConfirmationHandler",
      code: lambda.Code.fromAsset("lib/service/src/handlers"),
      environment: {
        ["MAIN_TABLE"]: table.tableName,
        ["REGION"]: region,
      },
    });

    const putItemMainTablePolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:PutItem"],
      resources: [table.tableArn],
    });

    this.lambdaFunction.addToRolePolicy(putItemMainTablePolicyStatement);
  }
}
