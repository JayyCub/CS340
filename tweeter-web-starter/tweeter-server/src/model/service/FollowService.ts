import { AuthToken, User, FakeData } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweesCount(user);
  }

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowersCount(user);
  }

  public async follow(
      authToken: AuthToken,
      userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
      let followersCount = await this.getFollowersCount(
          authToken,
          userToFollow
      );
      let followeesCount = await this.getFolloweesCount(
          authToken,
          userToFollow
      );

      return [followersCount, followeesCount];
  }

  public async unfollow(
      authToken: AuthToken,
      userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
      let followersCount = await this.getFollowersCount(
          authToken,
          userToUnfollow
      );
      let followeesCount = await this.getFolloweesCount(
          authToken,
          userToUnfollow
      );

      return [followersCount, followeesCount];
  }
}