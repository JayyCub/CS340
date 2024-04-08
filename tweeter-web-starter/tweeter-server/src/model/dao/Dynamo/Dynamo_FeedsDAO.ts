import {FeedsDAO} from "../interfaces/FeedsDAO";
import {Status, User} from "tweeter-shared";
import {DataPage} from "./DataPage";
import {DynamoDBDocumentClient, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {Dynamo_FollowsDAO} from "./Dynamo_FollowsDAO";

export class Dynamo_FeedsDAO extends FeedsDAO {
  readonly tableName = "Feeds";
  readonly follower_alias = "follower_alias";
  readonly post_content = "post_content";
  readonly time_stamp = "time_stamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addToUsersFeeds(newStatus: Status): Promise<void> {
    let loop = true;
    let lastFollowHandle = undefined;
    while (loop) {
      let response:  DataPage<User> = await new Dynamo_FollowsDAO().getPageOfFollowers(
        newStatus.user.alias, 50, lastFollowHandle);

      let user;
      for (user of response.values) {
        let params = {
          TableName: this.tableName,
          Item: {
            [this.follower_alias]: user.alias,
            [this.time_stamp]: newStatus.timestamp,
            [this.post_content]: JSON.stringify(newStatus)
          }
        };
        try {
          await this.client.send(new PutCommand(params));
        } catch (e) {
          throw new Error(
            "[Server Error] Error adding post to feed for user: " + user.alias + ": " + e);
        }
        lastFollowHandle = user.alias;
      }

      loop = response.hasMorePages
    }
  }

  async loadMoreFeedItems(
    alias: string,
    pageSize: number,
    lastItemTimeStamp: number | undefined
  ): Promise<DataPage<Status>> {
    const params = {
      KeyConditionExpression: `${this.follower_alias} = :fol`,
      ExpressionAttributeValues: {
        ":fol": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastItemTimeStamp === undefined
          ? undefined
          : {
            [this.follower_alias]: alias,
            [this.time_stamp]: lastItemTimeStamp,
          },
    };

    try {
      const items: Status[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {
          let status = Status.fromJson(item[this.post_content]);
          if (!!status) {
            items.push(status);
          }
        }
      );

      return new DataPage<Status>(items, hasMorePages);
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }
}