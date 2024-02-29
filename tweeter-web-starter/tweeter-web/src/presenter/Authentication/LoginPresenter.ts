import {AuthenticationPresenter, AuthenticationView} from "./AuthPresenter";
import {AuthService} from "../../model/service/AuthService";

export class LoginPresenter extends AuthenticationPresenter<AuthService> {
  protected createService(): AuthService {
    return new AuthService();
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
    }, "login user");
  }
}