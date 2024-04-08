import {AuthToken, Follow, User} from "tweeter-shared";
import {AuthTokensDAO} from "../dao/interfaces/AuthTokensDAO";
import {DAOFactory} from "../dao/interfaces/DAOFactory";
import {FollowsDAO} from "../dao/interfaces/FollowsDAO";

export class FollowService {
  private followsDAO: FollowsDAO;
  private authTokensDAO: AuthTokensDAO;

  constructor(daoFactory: DAOFactory) {
    this.authTokensDAO = daoFactory.getAuthTokensDAO();
    this.followsDAO = daoFactory.getFollowsDAO();
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }
    let auth: boolean = await this.authTokensDAO.validateToken(newToken);
    if (!auth) {
      throw new Error("[Bad Request] Could not validate Auth Token");
    }

    let currUser = User.fromJson(JSON.stringify(user));
    if (!currUser?.alias) {
      throw new Error("[Bad Request] Could not validate current user")
    }

    let lastUserAlias: string | undefined = undefined;
    if (lastItem !== null) {
      let lastUser: User | null = User.fromJson(JSON.stringify(lastItem));
      if (lastUser?.alias) {
        lastUserAlias = lastUser.alias;
      }
    }

    let response = await this.followsDAO.getPageOfFollowers(currUser.alias, pageSize, lastUserAlias)
    return [response.values, response.hasMorePages];
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }
    let auth: boolean = await this.authTokensDAO.validateToken(newToken);
    if (!auth) {
      throw new Error("[Bad Request] Could not validate Auth Token");
    }

    let currUser = User.fromJson(JSON.stringify(user));
    if (!currUser?.alias) {
      throw new Error("[Bad Request] Could not validate current user")
    }

    let lastUserAlias: string | undefined = undefined;
    if (lastItem !== null) {
      let lastUser: User | null = User.fromJson(JSON.stringify(lastItem));
      if (lastUser?.alias) {
        lastUserAlias = lastUser.alias;
      }
    }

    let response = await this.followsDAO.getPageOfFollowees(currUser.alias, pageSize, lastUserAlias)
    return [response.values, response.hasMorePages];
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }
    let auth: boolean = await this.authTokensDAO.validateToken(newToken);
    if (!auth) {
      throw new Error("[Bad Request] Could not validate Auth Token");
    }

    let currUser = User.fromJson(JSON.stringify(user));
    if (!currUser?.alias) {
      throw new Error("[Bad Request] Could not validate current user")
    }

    let secondUser = User.fromJson(JSON.stringify(selectedUser));
    if (!secondUser?.alias) {
      throw new Error("[Bad Request] Could not validate user to check status")
    }

    return await this.followsDAO.getFollow(new Follow(currUser, secondUser)) !== undefined
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    follow: Follow
  ): Promise<number> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }

    let auth: boolean = await this.authTokensDAO.validateToken(newToken);
    if (!auth) {
      throw new Error("[Bad Request] Could not validate Auth Token");
    }

    let newFollow = Follow.fromJson(JSON.stringify(follow));
    if (!newFollow || !newFollow?.follower || !newFollow?.followee) {
      throw new Error("[Bad Request] Could not parse follow object")
    }
    return await this.followsDAO.getNumFollowees(newFollow.follower.alias);
  }

  public async getFollowersCount(
    authToken: AuthToken,
    follow: Follow
  ): Promise<number> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }

    let auth: boolean = await this.authTokensDAO.validateToken(newToken);
    if (!auth) {
      throw new Error("[Bad Request] Could not validate Auth Token");
    }

    let newFollow = Follow.fromJson(JSON.stringify(follow));
    if (!newFollow || !newFollow?.follower || !newFollow?.followee) {
      throw new Error("[Bad Request] Could not parse follow object")
    }

    return await this.followsDAO.getNumFollowers(newFollow.followee.alias);
  }

  public async follow(
    authToken: AuthToken,
    follow: Follow
  ): Promise<[boolean, string]> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }

    let auth: boolean = await this.authTokensDAO.validateToken(newToken);
    if (!auth) {
      throw new Error("[Bad Request] Could not validate Auth Token");
    }

    let newFollow = Follow.fromJson(JSON.stringify(follow));
    if (!newFollow || !newFollow?.follower || !newFollow?.followee) {
      throw new Error("[Bad Request] Could not parse follow object")
    }

    await this.followsDAO.addFollow(newFollow)

    return [true, "Successfully followed user"]
  }

  public async unfollow(
    authToken: AuthToken,
    follow: Follow
  ): Promise<[boolean, string]> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }

    let auth: boolean = await this.authTokensDAO.validateToken(newToken);
    if (!auth) {
      throw new Error("[Bad Request] Could not validate Auth Token");
    }

    let newFollow = Follow.fromJson(JSON.stringify(follow));
    if (!newFollow || !newFollow?.follower || !newFollow?.followee) {
      throw new Error("[Bad Request] Could not parse follow object")
    }

    await this.followsDAO.removeFollow(newFollow)

    return [true, "Successfully unfollowed user"]
  }
}
