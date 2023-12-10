#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AuthorizationStack } from "../lib/stacks/authorization-stack";
import { DataStorageStack } from "../lib/stacks/data-storage-stack";

const app = new cdk.App();
new AuthorizationStack(app, "AuthorizationStack");
new DataStorageStack(app, "DataStorageStack");
