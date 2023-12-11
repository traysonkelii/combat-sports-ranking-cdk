import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { LambdaBase } from "../shared/lambda-base/lambda-base";

export interface PostConfirmationLambdaProps {
  table: ITable;
  region: string;
}

export class PostConfirmationLambda extends Construct {
  readonly lambdaFunction: lambda.IFunction;
  constructor(
    scope: Construct,
    id: string,
    { table, region }: PostConfirmationLambdaProps
  ) {
    super(scope, id);

    this.lambdaFunction = new LambdaBase(this, id, {
      table,
      region,
      handler: "index.postConfirmationHandler",
      codePath: "resources/src/handlers",
    }).lambdaFunction;

    const putItemMainTablePolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:PutItem"],
      resources: [table.tableArn],
    });

    this.lambdaFunction.addToRolePolicy(putItemMainTablePolicyStatement);
  }
}
