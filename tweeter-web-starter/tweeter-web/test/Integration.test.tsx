import { ServerFacade } from "../src/network/ServerFacade";
import {
  AuthToken,
  LoadMoreStatusItemsRequest,
  LoginRequest,
  LogoutRequest,
  User,
} from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../src/presenter/PostStatusPresenter";
import { instance, mock, verify } from "ts-mockito";
import "isomorphic-fetch";

describe("Integration test", () => {
  const testUsername = "@test";
  const testPassword = "pass";
  const testPostText = "This post was brought to you by... testing!";
  const server = new ServerFacade();
  let user: User;
  let authToken: AuthToken;
  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;

  beforeAll(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    postStatusPresenter = new PostStatusPresenter(mockPostStatusViewInstance);
  });

  it("should login, post status, and find status", async () => {
    const authResp = await server.login(
      new LoginRequest(testUsername, testPassword)
    );

    user = authResp.user;
    authToken = authResp.token;

    await postStatusPresenter.submitPost(testPostText, user, authToken);

    const resp = await server.loadMoreStoryItems(
      new LoadMoreStatusItemsRequest(authToken, user, 10, null)
    );

    // check login response
    expect(authResp.message).toBeNull();
    expect(authResp.success).toBe(true);
    expect(authResp.token).toBeTruthy();
    expect(authResp.user).toBeTruthy();

    // check post status presenter
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

    // check load more story items response
    expect(resp.success).toBeTruthy();
    expect(resp.pageOfStatuses[0].post).toBe(testPostText);
    expect(resp.message).toBeNull();

    // just for auth token table clean up
    await server.logout(new LogoutRequest(authToken));
  }, 10000); // increased timeout
});
