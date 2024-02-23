import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { LambdaBase } from "../../shared/lambda-base/lambda-base";

export interface CreateTournamentLambdaProps {
  table: ITable;
  region: string;
  layers?: lambda.ILayerVersion[];
}

export class CreateTournamentLambda extends Construct {
  readonly lambda: lambda.IFunction;
  constructor(
    scope: Construct,
    id: string,
    { table, region, layers }: CreateTournamentLambdaProps
  ) {
    super(scope, id);

    this.lambda = new LambdaBase(this, id, {
      table,
      region,
      handler: "index.createTournamentHandler",
      codePath: "resources/lambda/src/handlers",
    }).lambdaFunction;

    const putItemMainTablePolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:PutItem"],
      resources: [table.tableArn],
    });

    this.lambda.addToRolePolicy(putItemMainTablePolicyStatement);
    table.grantReadWriteData(this.lambda);
  }
}
