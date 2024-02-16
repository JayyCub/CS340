import { NavigateOptions, To } from "react-router-dom"
import { AuthToken, User } from "tweeter-shared";
import {UserService} from "../../model/service/UserService";

export interface LoginView {
  navigate: (to: To, options?: NavigateOptions | undefined) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
}

export class LoginPresenter {
  private service: UserService;
  private view: LoginView;

  public constructor(view: LoginView) {
    this.service = new UserService();
    this.view = view
  }

  public async doLogin (alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
    try {
      let [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  }
}