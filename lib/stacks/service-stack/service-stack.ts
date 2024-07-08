import * as cdk from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { CreateRoleLambda } from "../../constructs/lambda/role/create";
import { CreateTournamentLambda } from "../../constructs/lambda/tournament/create";
import { CreateGymLambda } from "../../constructs/lambda/gym/create";
import { GetUsersByRoleLambda } from "../../constructs/lambda/role/read";
import { GetGymLambda } from "../../constructs/lambda/gym/read";
import { EnvironmentConfig, projectName } from "../../config/configuration";
import { GetTournamentsLambda } from "../../constructs/lambda/tournament/read/get-tournaments";
import { GetTournamentHostLambda } from "../../constructs/lambda/tournament/read/get-tournament-host";

interface ServiceStackPrompts extends EnvironmentConfig {
  readonly tableArn: string;
  readonly globalIndexes: string[];
  readonly userPool: UserPool;
}

export class ServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ServiceStackPrompts) {
    super(scope, id, props);
    const {
      tableArn,
      globalIndexes,
      userPool,
      env: { region },
      stageName,
    } = props;

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
     * Lambdas
     */

    const createRoleLambda = new CreateRoleLambda(this, `CreateRoleLambda`, {
      table,
      region,
    }).lambda;

    const getUsersByRoleLambda = new GetUsersByRoleLambda(
      this,
      `GetUsersByRoleLambda`,
      {
        table,
        region,
      }
    ).lambda;

    const createTournamentLambda = new CreateTournamentLambda(
      this,
      `CreateTournamentLambda`,
      { table, region }
    ).lambda;

    const getTournamentsLambda = new GetTournamentsLambda(
      this,
      `GetTournamentsLambda`,
      { table, region }
    ).lambda;

    const getTournamentHostLambda = new GetTournamentHostLambda(
      this,
      `GetTournamentHostLambda`,
      { table, region }
    ).lambda;

    const createGymLambda = new CreateGymLambda(this, `CreateGymLambda`, {
      table,
      region,
    }).lambda;

    const getGymLambda = new GetGymLambda(this, `GetGym`, {
      table,
      region,
    }).lambda;

    /**
     * API Endpoints
     */

    const api = new apigateway.RestApi(this, `CombatSportsRankingApi`, {
      restApiName: `CombatSportsRanking-${stageName}`,
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
    const getGym = v1.addResource("get-gym");

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

    tournament
      .addResource("get-host")
      .addMethod(
        "POST",
        new apigateway.LambdaIntegration(getTournamentHostLambda)
      );

    /**
     * Gym endpoints
     */

    gym.addMethod("POST", new apigateway.LambdaIntegration(createGymLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    getGym.addMethod("POST", new apigateway.LambdaIntegration(getGymLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });
  }
}
