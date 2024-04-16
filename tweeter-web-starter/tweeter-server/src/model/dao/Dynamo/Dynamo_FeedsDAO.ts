import {FeedsDAO} from "../interfaces/FeedsDAO";
import {Status, User} from "tweeter-shared";
import {DataPage} from "./DataPage";
import {BatchWriteCommand, DynamoDBDocumentClient, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {Dynamo_FollowsDAO} from "./Dynamo_FollowsDAO";
import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";

export class Dynamo_FeedsDAO extends FeedsDAO {
  readonly tableName = "Feeds";
  readonly follower_alias = "follower_alias";
  readonly post_content = "post_content";
  readonly time_stamp = "time_stamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addToUsersFeeds(newStatus: Status): Promise<void> {
    let loop = true;
    let lastFollow: User | undefined = undefined;
    let sqsClient = new SQSClient();


    while (loop) {
      let response:  DataPage<User> = await new Dynamo_FollowsDAO().getPageOfFollowers(
        newStatus.user.alias, 200, lastFollow !== undefined ? lastFollow.alias : undefined);

      let items: any[] = [];

      for (const user of response.values) {
        items.push({
          PutRequest: {
            Item: {
              [this.follower_alias]: user.alias,
              [this.time_stamp]: newStatus.timestamp,
              [this.post_content]: JSON.stringify(newStatus)
            }
          }
        });

        // items is at batch size and needs to be sent to queue
        if (items.length === 25) {
          // Send batch request to Update Feed Queue
          try {
            await sqsClient.send(new SendMessageCommand({
              DelaySeconds: 1,
              MessageBody: JSON.stringify({
                RequestItems: {
                  [this.tableName]: items
                }
              }),
              QueueUrl: "https://sqs.us-east-1.amazonaws.com/612237749982/UpdateFeed",
            }));
            console.log("Sent full batch!");
          } catch (e) {
            throw new Error("[Server Error] Error adding post to Statuses Queue: " + e);
          }
          items = [];
        }
      }


      if (items.length > 0) {
        // Send batch request to Update Feed Queue
        try {
          await sqsClient.send(new SendMessageCommand({
            DelaySeconds: 1,
            MessageBody: JSON.stringify({
              RequestItems: {
                [this.tableName]: items
              }
            }),
            QueueUrl: "https://sqs.us-east-1.amazonaws.com/612237749982/UpdateFeed",
          }));
          console.log("Sent partial batch!");
        } catch (e) {
          throw new Error("[Server Error] Error adding post to Statuses Queue: " + e);
        }
        items = [];
      }

      loop = response.hasMorePages;
      lastFollow = response.values.pop();
    }
  }

  async batchUpload(command: any): Promise<void> {
    try {
      await this.client.send(new BatchWriteCommand(command));
    } catch (e) {
      throw new Error("There was an error completing the batch write: " + e);
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