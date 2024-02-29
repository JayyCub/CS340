import { AuthToken, User } from "tweeter-shared";
import {AuthService} from "../../model/service/AuthService";
import {MessageView, Presenter} from "../Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: React.Dispatch<React.SetStateAction<boolean>>,
  setFolloweesCount: React.Dispatch<React.SetStateAction<number>>
  setFollowersCount: React.Dispatch<React.SetStateAction<number>>
}

export class UserInfoPresenter extends Presenter {
  private service: AuthService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new AuthService();
  }

  protected get view(): UserInfoView {
    return super.view as UserInfoView;
  }

  public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    }, "determine follower status")
  };

  public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
    }, "get followees count")
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
    }, "get followers count")
  };

  public async followUser(authToken: AuthToken, user: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage(`Adding ${user!.name} to followers...`, 0);
      let [followersCount, followeesCount] = await this.service.follow(
        authToken,
        user
      );
      this.view.clearLastInfoMessage();
      this.view.setIsFollower(true);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);
    }, "follow user")
  }

  public async unfollowUser(authToken: AuthToken, user: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage(
        `Removing ${user!.name} from followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.service.unfollow(
        authToken!,
        user!
      );
      this.view.clearLastInfoMessage();
      this.view.setIsFollower(false);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);

    }, "unfollow user")
  }


}