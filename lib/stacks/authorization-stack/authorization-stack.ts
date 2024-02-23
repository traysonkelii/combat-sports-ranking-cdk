import { Stack, StackProps } from "aws-cdk-lib";
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

export interface AuthorizationStackProps extends StackProps {
  readonly mainTableArn: string;
  readonly globalIndexes: string[];
  readonly region: string;
}

export class AuthorizationStack extends Stack {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props: AuthorizationStackProps) {
    super(scope, id, props);
    const { mainTableArn, globalIndexes, region } = props;

    const table = Table.fromTableAttributes(this, "mainTableArnAuthStack", {
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

    this.userPool = new UserPool(this, "CombatSportsRankingCognitoPool", {
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
    });

    this.userPoolClient = new UserPoolClient(
      this,
      "CombatSportsRankingCognitoWebClient",
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
