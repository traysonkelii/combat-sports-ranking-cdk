import * as cdk from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { LayerVersion, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { CreateRoleLambda } from "../../constructs/lambda/role/create";
import { CreateTournamentLambda } from "../../constructs/lambda/tournament/create";
import { CreateGymLambda } from "../../constructs/lambda/gym/create";
import { GetUsersByRoleLambda } from "../../constructs/lambda/role/read";
import { GetTournamentsLambda } from "../../constructs/lambda/tournament/read";

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

    const getUsersByRoleLambda = new GetUsersByRoleLambda(
      this,
      "GetUsersByRoleLambda",
      {
        table,
        region,
      }
    ).lambda;

    const createTournamentLambda = new CreateTournamentLambda(
      this,
      "CreateTournamentLambda",
      { table, region }
    ).lambda;

    const getTournamentsLambda = new GetTournamentsLambda(
      this,
      "GetTournamentsLambda",
      { table, region }
    ).lambda;

    const createGymLambda = new CreateGymLambda(this, "CreateGymLambda", {
      table,
      region,
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

    // user api
    const addRole = v1.addResource("add-role");
    const getUsersByRole = v1.addResource("get-by-role");

    // tournament api
    const tournament = v1.addResource("tournament");
    const getTournamentsByStatus = v1.addResource("get-by-status");

    // gym api
    const gym = v1.addResource("gym");

    /**
     * Role creation endpoints
     */

    addRole.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createRoleLambda),
      { authorizer, authorizationType: apigateway.AuthorizationType.COGNITO }
    );

    getUsersByRole.addMethod(
      "POST",
      new apigateway.LambdaIntegration(getUsersByRoleLambda),
      { authorizer, authorizationType: apigateway.AuthorizationType.COGNITO }
    );

    /**
     * Tournament endpoints
     */

    tournament.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createTournamentLambda),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      }
    );

    getTournamentsByStatus.addMethod(
      "POST",
      new apigateway.LambdaIntegration(getTournamentsLambda)
    );

    /**
     * Gym endpoints
     */

    gym.addMethod("POST", new apigateway.LambdaIntegration(createGymLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });
  }
}
