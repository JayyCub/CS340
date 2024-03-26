import { AuthToken, User } from "tweeter-shared";
import {UserService} from "../../model/service/UserService";
import {Presenter, View} from "../Presenter";

export interface UserNavView extends View {
  setDisplayedUser: (user: User) => void
}

export class UserNavPresenter extends Presenter {
  private service: UserService;

  public constructor(view: UserNavView) {
    super(view);
    this.service = new UserService;
  }

  protected get view(): UserNavView {
    return super.view as UserNavView;
  }

  public async navigateToUser(authToken: AuthToken, currentUser: User, aliasString: string) {
    try {
      let alias = this.extractAlias(aliasString);

      let user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }

  private extractAlias(value: string): string {
    let index = value.indexOf("@");
    return value.substring(index);
  };
}