// import * as lambda from "aws-cdk-lib/aws-lambda";
// import { Construct } from "constructs";

// export interface LambdaBaseProps extends lambda.FunctionProps {
//   codePath: string;
//   handlerName: string;
// }

// export class LambdaBase {
//   readonly lambdaFunction: lambda.Function;
//   constructor(
//     scope: Construct,
//     id: string,
//     {
//       codePath,
//       handlerName,
//       runtime = lambda.Runtime.NODEJS_18_X,
//     }: LambdaBaseProps
//   ) {
//     this.lambdaFunction = new lambda.Function(scope, id, {
//       runtime,
//       handler: handlerName,
//       code: lambda.Code.fromAsset(codePath),
//     });
//   }
// }
