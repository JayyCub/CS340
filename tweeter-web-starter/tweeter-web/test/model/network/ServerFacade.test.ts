import {
  RegisterRequest,
  LoadMoreUserItemsRequest,
  GetFollowCountResponse,
  AuthenticateResponse,
  AuthToken,
  User,
  LoadMoreUserItemsResponse,
  FollowInfoRequest,
} from "tweeter-shared";
import "isomorphic-fetch";
import {ServerFacade} from "../../../src/network/ServerFacade";

describe("ServerFacade", () => {
  let serverFacade: ServerFacade = new ServerFacade();

  it("register a new account", async () => {
    const request = new RegisterRequest(
      "jacob",
      "thomsen",
      "@jaycub",
      "pass",
      "imageStringBase64"
    );

    const result: AuthenticateResponse = await serverFacade.register(request);

    expect(result.success).toBe(true);
    expect(result.token).not.toBeNull();
    expect(result.user).not.toBeNull();
  });

  it("return list of followers (length 10)", async () => {
    const request = new LoadMoreUserItemsRequest(
      new AuthToken("x", 1),
      new User("jacob", "thomsen", "@jaycub", "image"),
      10,
      null
    );

    const result: LoadMoreUserItemsResponse =
      await serverFacade.loadMoreFollowers(request);

    expect(result.success).toBe(true);
    expect(result.pageOfUsers).not.toBeNull();

    if (result.hasMoreItems === true) {
      expect(result.pageOfUsers.length).toBe(10);

      const moreRequest = new LoadMoreUserItemsRequest(
        new AuthToken("x", 1),
        new User("jacob", "thomsen", "@jaycub", "image"),
        10,
        result.pageOfUsers.at(-1)!
      );

      const moreResult: LoadMoreUserItemsResponse =
        await serverFacade.loadMoreFollowers(moreRequest);

      expect(result.success).toBe(true);
      expect(result.pageOfUsers).not.toBeNull();
      expect(moreResult.pageOfUsers.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("return the number of followers", async () => {
    const request: FollowInfoRequest = new FollowInfoRequest(
      new AuthToken("x", 1),
      new User("jacob", "thomsen", "@jaycub", "image")
    );

    const result: GetFollowCountResponse =
      await serverFacade.getFollowersCount(request);

    expect(result.success).toBe(true);
    expect(result.count).toBeGreaterThanOrEqual(0);
  });
});