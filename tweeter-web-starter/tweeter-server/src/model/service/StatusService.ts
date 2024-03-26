import { AuthToken, User, Status, FakeData } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async postStatus(
      authToken: AuthToken,
      newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 250));
  }
}