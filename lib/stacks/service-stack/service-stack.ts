import * as cdk from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { CreateHostLambda } from "../../constructs/lambda/create-host-lambda/create-host-lambda";

interface ServiceStackPrompts extends cdk.StackProps {
  readonly tableArn: string;
  readonly globalIndexes: string[];
  readonly userPool: UserPool;
  readonly region: string;
}

export class ServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ServiceStackPrompts) {
    super(scope, id, props);
    const { tableArn, globalIndexes, userPool, region } = props;

    const table = Table.fromTableAttributes(this, "MainTableArn", {
      tableArn,
      globalIndexes,
    });

    const api = new apigateway.RestApi(this, "CombatSportsRankingApi", {
      restApiName: "CombatSportsRanking",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
        ],
        allowCredentials: true,
      },
    });

    /**
     * Lambdas
     */

    const createHostLambda = new CreateHostLambda(this, "CreateHostLambda", {
      table,
      region,
    }).lambda;

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "CognitoAuthorizer",
      {
        cognitoUserPools: [userPool],
      }
    );

    /**
     * Endpoints
     */
    const baseApi = api.root.addResource("api");
    const v1 = baseApi.addResource("v1");
    const host = v1.addResource("host");

    host.addMethod("POST", new apigateway.LambdaIntegration(createHostLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });
  }
}
