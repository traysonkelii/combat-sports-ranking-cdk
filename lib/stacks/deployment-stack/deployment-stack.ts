import {
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { devConfig, prodConfig, projectName } from "../../config/configuration";
import { PipelineStage } from "../../config/pipeline-stage";

export class DeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, `${projectName}-backend-Pipeline`, {
      pipelineName: `${projectName}-backend-pipeline`,
      selfMutation: true,
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub(
          "traysonkelii/combat-sports-ranking-cdk",
          "main",
          {
            authentication: SecretValue.secretsManager("github-token"),
          }
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    const devStage = pipeline.addStage(
      new PipelineStage(this, "development-stage", devConfig)
    );

    devStage.addPost(new ManualApprovalStep("Deploy to production"));

    const prodStage = pipeline.addStage(
      new PipelineStage(this, "production-stage", prodConfig)
    );
  }
}
