import { PostAuthenticationHandler } from "./cognito/post-authentication-lambda";
import { PostConfirmationHandler } from "./cognito/post-confirmation-lambda";
import { CreateRoleHandler } from "./combat-sports-ranking/role/create";
import { GetUsersByRoleHandler } from "./combat-sports-ranking/role/read";
import { CreateTournamentHandler } from "./combat-sports-ranking/tournament/create";
import { GetTournamentsHandler } from "./combat-sports-ranking/tournament/read/get-tournaments";

export const postConfirmationHandler = PostConfirmationHandler;
export const postAuthenticationHandler = PostAuthenticationHandler;
export const createRoleHandler = CreateRoleHandler;
export const createTournamentHandler = CreateTournamentHandler;
export const getTournamentsHander = GetTournamentsHandler;
export const getUsersByRoleHandler = GetUsersByRoleHandler;
