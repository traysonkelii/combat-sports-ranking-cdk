import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { LambdaBase } from "../../shared/lambda-base/lambda-base";

export interface PostConfirmationLambdaProps {
  table: ITable;
  region: string;
  layers?: lambda.ILayerVersion[];
}

export class PostConfirmationLambda extends Construct {
  readonly lambdaFunction: lambda.IFunction;
  constructor(
    scope: Construct,
    id: string,
    { table, region, layers }: PostConfirmationLambdaProps
  ) {
    super(scope, id);

    this.lambdaFunction = new LambdaBase(this, id, {
      table,
      region,
      handler: "index.postConfirmationHandler",
      codePath: "resources/lambda/src/handlers",
      layers,
    }).lambdaFunction;

    const putItemMainTablePolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:PutItem"],
      resources: [table.tableArn],
    });

    this.lambdaFunction.addToRolePolicy(putItemMainTablePolicyStatement);
  }
}
