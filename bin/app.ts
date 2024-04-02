#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { baseConfig } from "../lib/config/configuration";
import { AuthorizationStack } from "../lib/stacks/authorization-stack/authorization-stack";
import { DataStorageStack } from "../lib/stacks/data-storage-stack/data-storage-stack";
import { ServiceStack } from "../lib/stacks/service-stack/service-stack";
import { PipelineStack } from "../lib/stacks/code-pipeline-stack/code-pipeline-stack";

const app = new cdk.App();
const dataStorageStack = new DataStorageStack(app, "DataStorageStack");

const authorizationStack = new AuthorizationStack(app, "AuthorizationStack", {
  mainTableArn: dataStorageStack.tableArn,
  globalIndexes: dataStorageStack.globalIndexes,
  region: baseConfig.region,
});

const serviceStack = new ServiceStack(app, "CsrServiceStack", {
  tableArn: dataStorageStack.tableArn,
  globalIndexes: dataStorageStack.globalIndexes,
  region: baseConfig.region,
  userPool: authorizationStack.userPool,
});

const pipelineStack = new PipelineStack(app, "PipelineStack");
