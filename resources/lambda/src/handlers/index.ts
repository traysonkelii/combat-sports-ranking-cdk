import { AddRoleHandler } from "./combat-sports-ranking/add-role";
import { PostAuthenticationHandler } from "./cognito/post-authentication-lambda";
import { PostConfirmationHandler } from "./cognito/post-confirmation-lambda";

export const postConfirmationHandler = PostConfirmationHandler;
export const postAuthenticationHandler = PostAuthenticationHandler;
export const createHostHandler = AddRoleHandler;
