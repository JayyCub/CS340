import {AuthToken, Status, User} from "tweeter-shared";
import {StatusItemPresenter, StatusItemView} from "./StatusItemPresenter";
import {PAGE_SIZE} from "../PagedItemPresenter";

export class FeedItemPresenter extends StatusItemPresenter {
  public constructor(view: StatusItemView) {
    super(view);
  }

  protected get view(): StatusItemView {
    return super.view as StatusItemView;
  }

  protected getItemDescription(): string {
    return "load items";
  }

  protected async getMoreItems(authToken: AuthToken, user: User): Promise<[Status[], boolean]> {
    return await this.service.loadMoreFeedItems(authToken, user, PAGE_SIZE, this.lastItem);
  }

}
