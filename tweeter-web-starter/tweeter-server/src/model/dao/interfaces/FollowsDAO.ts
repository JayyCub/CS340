import {Follow, User} from "tweeter-shared";
import {DataPage} from "../Dynamo/DataPage";

export abstract class FollowsDAO {
  abstract addFollow(follow: Follow): Promise<void>;

  abstract removeFollow(follow: Follow): Promise<void>;

  abstract getFollow(follow: Follow): Promise<Follow | undefined>;

  abstract getNumFollowers(alias: string): Promise<number>;

  abstract getNumFollowees(alias: string): Promise<number>;

  abstract getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<User>>;

  abstract getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<User>>;


}

