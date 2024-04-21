import * as cdk from "aws-cdk-lib";
import { DeploymentStack } from "../lib/stacks/deployment-stack/deployment-stack";

const app = new cdk.App();

new DeploymentStack(app, "CombatSportsRanking-DeploymentStack", {
  env: {
    account: "908064770691",
    region: "us-east-1",
  },
});

app.synth();
