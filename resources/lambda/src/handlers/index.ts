import { PostAuthenticationHandler } from "./cognito/post-authentication-lambda";
import { PostConfirmationHandler } from "./cognito/post-confirmation-lambda";
import { GetGymsHandler } from "./combat-sports-ranking/gym/read/get-gym";
import { CreateRoleHandler } from "./combat-sports-ranking/role/create";
import { GetUsersByRoleHandler } from "./combat-sports-ranking/role/read";
import { CreateTournamentHandler } from "./combat-sports-ranking/tournament/create";
import { GetTournamentHostHandler } from "./combat-sports-ranking/tournament/read/get-host/get-host";
import { GetTournamentsHandler } from "./combat-sports-ranking/tournament/read/get-tournaments";

export const postConfirmationHandler = PostConfirmationHandler;
export const postAuthenticationHandler = PostAuthenticationHandler;
export const createRoleHandler = CreateRoleHandler;
export const createTournamentHandler = CreateTournamentHandler;
export const getTournamentsHander = GetTournamentsHandler;
export const getTournamentHostHander = GetTournamentHostHandler;
export const getUsersByRoleHandler = GetUsersByRoleHandler;
export const getGymHandler = GetGymsHandler;
