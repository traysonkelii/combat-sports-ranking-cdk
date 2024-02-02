import { CreateHostHandler } from "./combat-sports-ranking/create-host";
import { PostAuthenticationHandler } from "./cognito/post-authentication-lambda";
import { PostConfirmationHandler } from "./cognito/post-confirmation-lambda";

export const postConfirmationHandler = PostConfirmationHandler;
export const postAuthenticationHandler = PostAuthenticationHandler;
export const createHostHandler = CreateHostHandler;
