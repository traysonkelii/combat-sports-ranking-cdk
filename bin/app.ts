#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AuthorizationStack } from "../lib/stacks/authorization-stack";
import { DataStorageStack } from "../lib/stacks/data-storage-stack";
import { baseConfig } from "../lib/config/configuration";

const app = new cdk.App();
const dataStorageStack = new DataStorageStack(app, "DataStorageStack");

const authorizationStack = new AuthorizationStack(app, "AuthorizationStack", {
  mainTableArn: dataStorageStack.tableArn,
  globalIndexes: dataStorageStack.globalIndexes,
  region: baseConfig.region,
});
