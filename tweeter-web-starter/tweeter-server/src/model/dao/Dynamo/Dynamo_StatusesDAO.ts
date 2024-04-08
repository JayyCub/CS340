import {StatusesDAO} from "../interfaces/StatusesDAO";
import {Status} from "tweeter-shared";
import {DynamoDBDocumentClient, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DataPage} from "./DataPage";

export class Dynamo_StatusesDAO implements StatusesDAO {
  readonly tableName = "Posts";
  readonly user_alias = "user_alias";
  readonly post_content = "post_content";
  readonly time_stamp = "time_stamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getStatuses(
    alias: string,
    pageSize: number,
    lastItemTimeStamp: number | undefined
  ): Promise<DataPage<Status>> {
    const params = {
      KeyConditionExpression: `${this.user_alias} = :author`,
      ExpressionAttributeValues: {
        ":author": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastItemTimeStamp === undefined
          ? undefined
          : {
            [this.user_alias]: alias,
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

  async postStatus(newStatus: Status): Promise<boolean> {
    let params = {
      TableName: this.tableName,
      Item: {
        [this.user_alias]: newStatus.user.alias,
        [this.time_stamp]: newStatus.timestamp,
        [this.post_content]: JSON.stringify(newStatus)
      }
    };
    try {
      await this.client.send(new PutCommand(params));
    } catch (e) {
      throw new Error("[Server Error] Error adding post to Dynamo DB: " + e);
    }
    return true;
  }
}