import {FollowsDAO} from "../interfaces/FollowsDAO";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput
} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {Follow, User} from "tweeter-shared";
import {DataPage} from "./DataPage";

export class Dynamo_FollowsDAO implements FollowsDAO {
  readonly tableName = "Follows";
  readonly indexName = "follower_index";
  readonly followee_handle_index = "followee_handle_index";

  readonly follower_handle = "follower_handle";
  readonly follower_name = "follower_name";
  readonly follower_imageUrl = "follower_imageUrl";

  readonly followee_handle = "followee_handle";
  readonly followee_name = "followee_name";
  readonly followee_imageUrl = "followee_imageUrl";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addFollow(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.follower_handle]: follow.follower.alias,
        [this.followee_handle]: follow.followee.alias,

        [this.follower_name]: follow.follower.name,
        [this.followee_name]: follow.followee.name,

        [this.follower_imageUrl]: follow.follower.imageUrl,
        [this.followee_imageUrl]: follow.followee.imageUrl,
      },
    };
    try {
    await this.client.send(new PutCommand(params));
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }

  async removeFollow(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follow),
    };
    try {
      await this.client.send(new DeleteCommand(params));
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }

  // HELPER
  private generateFollowItem(follow: Follow) {
    return {
      [this.follower_handle]: follow.follower.alias,
      [this.followee_handle]: follow.followee.alias,
    }
  }

  async getFollow(follow: Follow): Promise<Follow | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follow),
    };

    try {
      const output = await this.client.send(new GetCommand(params));
      return output.Item == undefined
        ? undefined
        : new Follow(
          new User(
            output.Item[this.follower_name].split(" ", 2)[0],
            output.Item[this.follower_name].split(" ", 2)[1],
            output.Item[this.follower_handle],
            output.Item[this.follower_imageUrl]),
          new User(
            output.Item[this.followee_name].split(" ", 2)[0],
            output.Item[this.followee_name].split(" ", 2)[1],
            output.Item[this.followee_handle],
            output.Item[this.followee_imageUrl]),
        );
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }

  async getNumFollowers(alias: string): Promise<number> {
    let localCount = 0
    let hasMoreToCount = true;
    let lastKey:  Record<string, any> | undefined = undefined;

    while (hasMoreToCount) {
      const params: QueryCommandInput = {
        TableName: this.tableName,
        Select: "COUNT",
        IndexName: this.followee_handle_index,
        KeyConditionExpression: `${this.followee_handle} = :fol`,
        ExpressionAttributeValues: {
          ":fol": alias,
        },
        ExclusiveStartKey: lastKey
      };

      try {
        const data = await this.client.send(new QueryCommand(params));
        console.log(data);
        localCount += data.Count ?? 0;
        hasMoreToCount = data.LastEvaluatedKey !== undefined;
        lastKey = data.LastEvaluatedKey;
      } catch (e) {
        throw new Error("[Server Error] : " + e)
      }
    }

    return localCount
  }

  async getNumFollowees(alias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      Select: "COUNT",
      KeyConditionExpression: `${this.follower_handle} = :fol`,
      ExpressionAttributeValues: {
        ":fol": alias,
      },
    };

    try {
      const data = await this.client.send(new QueryCommand(params));
      return data.Count ?? 0;
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<User>> {
    const params = {
      KeyConditionExpression: this.followee_handle + " = :fol",
      ExpressionAttributeValues: {
        ":fol": followeeHandle,
      },
      TableName: this.tableName,
      IndexName: this.followee_handle_index,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
            [this.follower_handle]: lastFollowerHandle,
            [this.followee_handle]: followeeHandle,
          },
    };

    try {
      const items: User[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) =>
        items.push(
          new User(
            item[this.follower_name].split(" ", 2)[0],
            item[this.follower_name].split(" ", 2)[1],
            item[this.follower_handle],
            item[this.follower_imageUrl])
        )
      );

      return new DataPage<User>(items, hasMorePages);
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<User>> {
    const params = {
      KeyConditionExpression: `${this.follower_handle} = :follower`,
      ExpressionAttributeValues: {
        ":follower": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
            [this.followee_handle]: lastFolloweeHandle,
            [this.follower_handle]: followerHandle,
          },
    };

    try {
      const items: User[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) =>
        items.push(
          new User(
            item[this.followee_name].split(" ", 2)[0],
            item[this.followee_name].split(" ", 2)[1],
            item[this.followee_handle],
            item[this.followee_imageUrl]),
        )
      );

      return new DataPage<User>(items, hasMorePages);
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }
}