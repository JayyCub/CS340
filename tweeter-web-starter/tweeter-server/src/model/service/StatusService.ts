import { AuthToken, User, Status } from "tweeter-shared";
import {AuthTokensDAO} from "../dao/interfaces/AuthTokensDAO";
import {DAOFactory} from "../dao/interfaces/DAOFactory";
import {StatusesDAO} from "../dao/interfaces/StatusesDAO";
import {FeedsDAO} from "../dao/interfaces/FeedsDAO";

export class StatusService {
  private authTokensDAO: AuthTokensDAO;
  private statusesDAO: StatusesDAO;
  private feedsDAO: FeedsDAO

  constructor(daoFactory: DAOFactory) {
    this.authTokensDAO = daoFactory.getAuthTokensDAO();
    this.statusesDAO = daoFactory.getStatusesDAO();
    this.feedsDAO = daoFactory.getFeedsDAO();
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
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
      throw new Error("[Bad Request] Could not validate current user");
    }

    let lastItemTimeStamp: number | undefined = undefined;
    if (lastItem !== null) {
      let lastStatus: Status | null = Status.fromJson(JSON.stringify(lastItem));
      if (lastStatus?.timestamp) {
        lastItemTimeStamp = lastStatus.timestamp;
      }
    }

    let response = await this.feedsDAO.loadMoreFeedItems(currUser?.alias, pageSize, lastItemTimeStamp);
    return [response.values, response.hasMorePages];
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
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
      throw new Error("[Bad Request] Could not validate current user");
    }

    let lastItemTimeStamp: number | undefined = undefined;
    if (lastItem !== null) {
      let lastStatus: Status | null = Status.fromJson(JSON.stringify(lastItem));
      if (lastStatus?.timestamp) {
        lastItemTimeStamp = lastStatus.timestamp;
      }
    }

    let response = await this.statusesDAO.getStatuses(currUser?.alias, pageSize, lastItemTimeStamp);
    return [response.values, response.hasMorePages];
  }

  public async postStatus(
      authToken: AuthToken,
      status: Status,
  ): Promise<boolean> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }

    let auth: boolean = await this.authTokensDAO.validateToken(newToken);
    if (!auth) {
      throw new Error("[Bad Request] Could not validate Auth Token");
    }

    let newStatus = Status.fromJson(JSON.stringify(status));
    if (!newStatus) {
      throw new Error("[Bad Request] Status is missing data. Cannot post.")
    }

    let success: boolean = await this.statusesDAO.postStatus(newStatus);
    if (!success) {
      throw new Error("[Server Error] There was an error adding post to DB");
    }

    await this.feedsDAO.addToUsersFeeds(newStatus);

    return success
  }
}