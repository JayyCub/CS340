import {AuthToken} from "tweeter-shared";

export abstract class AuthTokensDAO {
  abstract putAuthToken(authtoken: AuthToken, alias: string): Promise<AuthToken>;

  abstract validateToken(authToken: AuthToken): Promise<boolean>;

  abstract deleteToken(authToken: AuthToken): Promise<boolean>;
}