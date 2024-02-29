import {AuthToken, User} from "tweeter-shared";
import {UserItemPresenter, UserItemView} from "./UserItemPresenter";
import {PAGE_SIZE} from "../PagedItemPresenter";

export class FollowersPresenter extends UserItemPresenter {
  public constructor(view: UserItemView) {
    super(view);
  }

  protected get view(): UserItemView {
    return super.view as UserItemView;
  }

  protected getItemDescription(): string {
    return "load follower items";
  }

  protected async getMoreItems(authToken: AuthToken, user: User): Promise<[User[], boolean]> {
    return await this.service.loadMoreFollowers(authToken, user, PAGE_SIZE, this.lastItem);
  }

}
