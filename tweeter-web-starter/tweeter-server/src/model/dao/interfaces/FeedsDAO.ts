import {Status} from "tweeter-shared";
import {DataPage} from "../Dynamo/DataPage";

export abstract class FeedsDAO {
  abstract loadMoreFeedItems(
    alias: string,
    pageSize: number,
    lastItem: number | undefined
  ): Promise<DataPage<Status>>;

  abstract batchUpload(items: any): Promise<void>;

  abstract addToUsersFeeds(newStatus: Status): Promise<void>;
}