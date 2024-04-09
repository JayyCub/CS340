import {AuthenticationPresenter, AuthenticationView} from "./AuthPresenter";
import {UserService} from "../../model/service/UserService";

export class LoginPresenter extends AuthenticationPresenter<UserService> {
  protected createService(): UserService {
    return new UserService();
  }

  public constructor(view: AuthenticationView) {
    super(view);
  }

  protected get view(): AuthenticationView {
    return super.view as AuthenticationView;
  }

  public async doLogin(
    originalUrl: string | undefined,
    alias: string,
    password: string,
    rememberMeRefVal: boolean
  ) {
    await this.doFailureReportingOperation(async () => {
      let [user, authToken] = await this.service.login(alias, password);
      let url: string;
      if (!!originalUrl) {
        url = originalUrl;
      } else {
        url = "/";
      }

      this.updateAndNavigate(
        user,
        user,
        authToken,
        rememberMeRefVal,
        url
      );
    }, "login user", "Login failed. Please verify your username and password are correct, and try again.");
  }
}