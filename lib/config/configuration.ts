export const projectName = "CombatSportsRanking";

export interface EnvironmentConfig {
  projectName: string;
  env: {
    account: string;
    region: string;
  };
  stageName: string;
  isProd: boolean;
}

export const enum Stage {
  dev = "dev",
  prod = "prod",
}

export const devConfig: EnvironmentConfig = {
  projectName: projectName,
  env: {
    account: "908064770691",
    region: "us-east-1",
  },
  stageName: Stage.dev,
  isProd: false,
};

export const prodConfig: EnvironmentConfig = {
  projectName: projectName,
  env: {
    account: "908064770691",
    region: "us-east-1",
  },
  stageName: Stage.prod,
  isProd: true,
};
