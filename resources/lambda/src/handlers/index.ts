import { PostAuthenticationHandler } from "./cognito/post-authentication-lambda";
import { PostConfirmationHandler } from "./cognito/post-confirmation-lambda";
import { CreateRoleHandler } from "./combat-sports-ranking/role/create";

export const postConfirmationHandler = PostConfirmationHandler;
export const postAuthenticationHandler = PostAuthenticationHandler;
export const createRoleHandler = CreateRoleHandler;
