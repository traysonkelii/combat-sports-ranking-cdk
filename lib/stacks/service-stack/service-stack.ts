import * as cdk from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { LayerVersion, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { CreateRoleLambda } from "../../constructs/lambda/role/create";

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

    /**
     * Authorization
     */

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "CognitoAuthorizer",
      {
        cognitoUserPools: [userPool],
      }
    );

    /**
     * Lambda Layers
     */

    const dbClientLambdaLayer = new LayerVersion(this, "LambdaLayer", {
      code: Code.fromAsset("./resources/layers/db-client"),
      compatibleRuntimes: [Runtime.NODEJS_18_X],
      description: "db-client shared layer package",
    });

    /**
     * Lambdas
     */

    const createRoleLambda = new CreateRoleLambda(this, "CreateRoleLambda", {
      table,
      region,
      layers: [dbClientLambdaLayer],
    }).lambda;

    /**
     * API Endpoints
     */

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

    const baseApi = api.root.addResource("api");
    const v1 = baseApi.addResource("v1");
    const role = v1.addResource("add-role");
    const tournament = v1.addResource("tournament");

    /**
     * Role creation endpoints
     */

    role.addMethod("POST", new apigateway.LambdaIntegration(createRoleLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    /**
     * Tournament endpoints
     */

    // tournament.addMethod("GET", new apigateway.LambdaIntegration(), {
    //   authorizer,
    //   authorizationType: apigateway.AuthorizationType.COGNITO,
    // });
  }
}
