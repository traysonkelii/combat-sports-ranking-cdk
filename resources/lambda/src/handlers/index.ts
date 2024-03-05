import { PostAuthenticationHandler } from "./cognito/post-authentication-lambda";
import { PostConfirmationHandler } from "./cognito/post-confirmation-lambda";
import { CreateRoleHandler } from "./combat-sports-ranking/role/create";
import { GetUsersByRoleHandler } from "./combat-sports-ranking/role/read";
import { CreateTournamentHandler } from "./combat-sports-ranking/tournament/create";

export const postConfirmationHandler = PostConfirmationHandler;
export const postAuthenticationHandler = PostAuthenticationHandler;
export const createRoleHandler = CreateRoleHandler;
export const createTournamentHandler = CreateTournamentHandler;
export const getUsersByRoleHandler = GetUsersByRoleHandler;
