import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { EnvironmentConfig, projectName } from "./configuration";
import { DataStorageStack } from "../stacks/data-storage-stack/data-storage-stack";
import { AuthorizationStack } from "../stacks/authorization-stack/authorization-stack";
import { ServiceStack } from "../stacks/service-stack/service-stack";

export class PipelineStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: EnvironmentConfig) {
    super(scope, id, props);
    const {
      stageName,
      env: { region },
    } = props;

    const dataStorageStack = new DataStorageStack(
      this,
      `${projectName}-${stageName}-DataStorageStack`
    );

    const authorizationStack = new AuthorizationStack(
      this,
      `${projectName}-${stageName}-AuthorizationStack`,
      {
        mainTableArn: dataStorageStack.tableArn,
        globalIndexes: dataStorageStack.globalIndexes,
        region,
      }
    );

    const serviceStack = new ServiceStack(
      this,
      `${projectName}-${stageName}-ServiceStack`,
      {
        tableArn: dataStorageStack.tableArn,
        globalIndexes: dataStorageStack.globalIndexes,
        region,
        userPool: authorizationStack.userPool,
      }
    );
  }
}
