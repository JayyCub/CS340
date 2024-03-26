import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter";
import {anything, instance, mock, spy, verify, when} from "ts-mockito";
import {AuthToken} from "tweeter-shared";
import {UserService} from "../../src/model/service/UserService";

describe("AppNavBarPresenter", () => {
  let mockAppNavBarPresenterView: AppNavbarView;
  let appNavBarPresenter: AppNavbarPresenter;
  let mockAuthService: UserService;

  const authToken = new AuthToken("token_123", Date.now())

  beforeEach(() => {
    mockAppNavBarPresenterView = mock<AppNavbarView>();
    const mockAppNavBarPresenterInstance = instance(mockAppNavBarPresenterView);

    const appNavBarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavBarPresenterInstance));
    appNavBarPresenter = instance(appNavBarPresenterSpy);

    mockAuthService = mock<UserService>();
    const mockAuthServiceInstance = instance(mockAuthService);

    when(appNavBarPresenterSpy.authService).thenReturn(mockAuthServiceInstance);
  });

  it("tells the view to display a logging out message.", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockAppNavBarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token.", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockAuthService.logout(authToken)).once();
  })

  it("tells the view to clear the last info message, " +
    "clear the user info, and navigate to the login page when logout is successful.", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockAppNavBarPresenterView.clearLastInfoMessage()).once();
    verify(mockAppNavBarPresenterView.clearUserInfo()).once();
    verify(mockAppNavBarPresenterView.navigateToLogin()).once();
    verify(mockAppNavBarPresenterView.displayErrorMessage(anything())).never();
  });

  it("displays an error message and does not clear the last info message," +
    "clear the user info, and navigate to the login page when logout fails", async () => {
    const error = new Error("An error occurred.");
    when(mockAuthService.logout(authToken)).thenThrow(error);

    await appNavBarPresenter.logOut(authToken);

    verify(mockAppNavBarPresenterView.displayErrorMessage(`Failed to log user out because of exception: An error occurred.`)).once();
    verify(mockAppNavBarPresenterView.clearLastInfoMessage()).never();
    verify(mockAppNavBarPresenterView.clearUserInfo()).never();
    verify(mockAppNavBarPresenterView.navigateToLogin()).never();
  });
});
