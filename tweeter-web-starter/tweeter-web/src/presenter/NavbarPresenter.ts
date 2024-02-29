import { AuthToken } from 'tweeter-shared'
import {AuthService} from "../model/service/AuthService";
import {MessageView, Presenter} from "./Presenter";

export interface NavbarView extends MessageView {
  clearUserInfo: () => void
}

export class NavbarPresenter extends Presenter {
  private service
  constructor(view: NavbarView) {
    super(view);
    this.service = new AuthService()
  }

  protected get view(): NavbarView {
    return super.view as NavbarView;
  }

  async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage('Logging Out...', 0)
    await this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken)
      this.view.clearLastInfoMessage()
      this.view.clearUserInfo()
    }, "log user out");
  }
}