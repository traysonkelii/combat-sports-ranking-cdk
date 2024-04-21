import { Stack } from "aws-cdk-lib";
import {
  UserPool,
  VerificationEmailStyle,
  AccountRecovery,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { PostConfirmationLambda } from "../../constructs/lambda/cognito/post-confirmation-lambda";
import { PostAuthenticationLambda } from "../../constructs/lambda/cognito/post-authentication-lambda";
import { EnvironmentConfig, projectName } from "../../config/configuration";

export interface AuthorizationStackProps extends EnvironmentConfig {
  readonly mainTableArn: string;
  readonly globalIndexes: string[];
}

export class AuthorizationStack extends Stack {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props: AuthorizationStackProps) {
    super(scope, id, props);
    const {
      mainTableArn,
      globalIndexes,
      env: { region },
      stageName,
    } = props;

    const table = Table.fromTableAttributes(this, `mainTableArnAuthStack`, {
      tableArn: mainTableArn,
      globalIndexes: globalIndexes,
    });

    const postConfirmationLambda = new PostConfirmationLambda(
      this,
      "PostConfirmationLambda",
      { table, region }
    );

    const postAuthenticationLambda = new PostAuthenticationLambda(
      this,
      "PostAuthenticationLambda",
      { table, region }
    );

    this.userPool = new UserPool(
      this,
      `${projectName}-${stageName}-CognitoPool`,
      {
        selfSignUpEnabled: true,
        userVerification: {
          emailStyle: VerificationEmailStyle.CODE,
        },
        signInAliases: {
          email: true,
        },
        standardAttributes: {
          email: {
            required: true,
            mutable: true,
          },
          birthdate: {
            required: true,
            mutable: false,
          },
          givenName: {
            required: true,
            mutable: true,
          },
          familyName: {
            required: true,
            mutable: true,
          },
        },
        passwordPolicy: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: true,
          requireDigits: true,
          requireSymbols: true,
        },
        accountRecovery: AccountRecovery.EMAIL_ONLY,
        lambdaTriggers: {
          postConfirmation: postConfirmationLambda.lambdaFunction,
          postAuthentication: postAuthenticationLambda.lambdaFunction,
        },
      }
    );

    this.userPoolClient = new UserPoolClient(
      this,
      `${projectName}-${stageName}-CognitoWebClient`,
      {
        userPool: this.userPool,
        authFlows: {
          userPassword: true,
          userSrp: true,
        },
        generateSecret: false,
      }
    );
  }
}
