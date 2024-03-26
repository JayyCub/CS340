import { AuthToken, User } from "tweeter-shared";
import {MessageView, Presenter} from "../Presenter";
import {UserService} from "../../model/service/UserService";
import {FollowService} from "../../model/service/FollowService";

export interface UserInfoView extends MessageView {
  setIsFollower: (value: boolean) => void;
  setFolloweesCount: (value: number) => void;
  setFollowersCount: (value: number) => void;
}

export class UserInfoPresenter extends Presenter {
  private service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  protected get view(): UserInfoView {
    return super.view as UserInfoView;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweesCount(
        await this.service.getFolloweesCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowersCount(
        await this.service.getFollowersCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage(
        `Adding ${displayedUser.name} to followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.view.setIsFollower(true);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);
    }, "follow user");
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage(
        `Removing ${displayedUser!.name} from followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.service.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.view.setIsFollower(false);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);
    }, "unfollow user");
  }
}