import { AuthToken } from 'tweeter-shared'
import {UserService} from "../model/service/UserService";
import {MessageView, Presenter} from "./Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
  navigateToLogin: () => void;
}

export class AppNavbarPresenter extends Presenter {
  private _authService: UserService;
  constructor(view: AppNavbarView) {
    super(view);
    this._authService = new UserService();
  }

  protected get view(): AppNavbarView {
    return super.view as AppNavbarView;
  }

  public get authService() {
    return this._authService;
  }

  async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage('Logging Out...', 0)
    await this.doFailureReportingOperation(async () => {
      await this.authService.logout(authToken);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    }, "log user out");
  }
}