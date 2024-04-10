import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import {
  BuildSpec,
  LinuxBuildImage,
  PipelineProject,
} from "aws-cdk-lib/aws-codebuild";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import {
  CloudFormationCreateUpdateStackAction,
  CodeBuildAction,
  GitHubSourceAction,
} from "aws-cdk-lib/aws-codepipeline-actions";
import { Construct } from "constructs";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new Pipeline(this, "Pipeline", {
      pipelineName: "CombatSportsRankingPipeline",
      crossAccountKeys: false,
    });

    const sourceOutput = new Artifact("sourceOutput");

    pipeline.addStage({
      stageName: "Source",
      actions: [
        new GitHubSourceAction({
          owner: "traysonkelii",
          repo: "combat-sports-ranking-cdk",
          branch: "main",
          actionName: "Pipeline_Source",
          oauthToken: SecretValue.secretsManager(
            "token/github/combatSportsranking"
          ),
          output: sourceOutput,
        }),
      ],
    });

    const codeBuildOutput = new Artifact("codeBuildOutput");

    pipeline.addStage({
      stageName: "Build",
      actions: [
        new CodeBuildAction({
          actionName: "Code_Build",
          input: sourceOutput,
          outputs: [codeBuildOutput],
          project: new PipelineProject(this, "CodeBuildProject", {
            environment: {
              buildImage: LinuxBuildImage.STANDARD_7_0,
            },
            buildSpec: BuildSpec.fromSourceFilename(
              "build-specs/code-build.yml"
            ),
          }),
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Pipeline_Update",
      actions: [
        new CloudFormationCreateUpdateStackAction({
          actionName: "Pipeline_Update",
          stackName: "PipelineStack",
          templatePath: codeBuildOutput.atPath("PipelineStack.template.json"),
          adminPermissions: true,
        }),
      ],
    });

    pipeline.addStage({
      stageName: "DataStorage_Update",
      actions: [
        new CloudFormationCreateUpdateStackAction({
          actionName: "DataStorage_Update",
          stackName: "DataStorageStack",
          templatePath: codeBuildOutput.atPath(
            "DataStorageStack.template.json"
          ),
          adminPermissions: true,
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Authorization_Update",
      actions: [
        new CloudFormationCreateUpdateStackAction({
          actionName: "Authorization_Update",
          stackName: "AuthorizationStack",
          templatePath: codeBuildOutput.atPath(
            "AuthorizationStack.template.json"
          ),
          adminPermissions: true,
        }),
      ],
    });

    pipeline.addStage({
      stageName: "CsrService_Update",
      actions: [
        new CloudFormationCreateUpdateStackAction({
          actionName: "CsrService_Update",
          stackName: "CsrServiceStack",
          templatePath: codeBuildOutput.atPath("CsrServiceStack.template.json"),
          adminPermissions: true,
        }),
      ],
    });
  }
}
