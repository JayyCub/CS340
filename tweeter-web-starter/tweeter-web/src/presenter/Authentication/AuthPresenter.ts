import { User, AuthToken } from "tweeter-shared";
import {Presenter, View} from "../Presenter";


export interface AuthenticationView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter<T> extends Presenter {
  protected _service: T;

  protected constructor(view: AuthenticationView) {
    super(view);
    this._service = this.createService();
  }
  protected abstract createService(): T;

  protected get view() {
    return super.view as AuthenticationView;
  }

  protected get service(): T {
    return this._service;
  }

  protected updateAndNavigate(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMeRefVal: boolean,
    url: string
  ): void {
    this.view.updateUserInfo(
      currentUser,
      displayedUser,
      authToken,
      rememberMeRefVal
    );
    this.view.navigate(url);
  }
}