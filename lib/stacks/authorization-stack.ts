import { Stack, StackProps } from "aws-cdk-lib";
import {
  UserPool,
  VerificationEmailStyle,
  AccountRecovery,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AuthorizationStack extends Stack {
  public readonly userPool: UserPool;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
    });
  }
}
