import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {User} from "tweeter-shared";
import {UsersDAO} from "../interfaces/UsersDAO";

export class Dynamo_UsersDAO implements UsersDAO {
  readonly tableName = "Users";
  readonly alias = "alias";
  readonly first_name = "first_name";
  readonly last_name = "last_name";
  readonly image_url = "image_url";
  readonly password = "password";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  // REGISTER NEW USER
  async registerUser(user: User): Promise<User> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.alias]: user.alias,
        [this.first_name]: user.firstName,
        [this.last_name]: user.lastName,
        [this.image_url]: user.imageUrl,
        [this.password]: user.password,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      return new User(user.firstName, user.lastName, user.alias, user.imageUrl);
    } catch (e) {
      throw new Error("[Server Error] There was an error registering a new user: " + e);
    }
  }

  // LOGIN USER (Check if user in DB)
  async loginUser(alias: string, password: string): Promise<User | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.alias]: alias
      }
    };

    try {
      const output = await this.client.send(new GetCommand(params));

      if (output.Item === undefined) {
        return undefined;
      }
      if (output.Item[this.password] === password) {
        return new User(
          output.Item[this.first_name],
          output.Item[this.last_name],
          output.Item[this.alias],
          output.Item[this.image_url]);
      } else {
        return undefined;
      }
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }

  async getUser(alias: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.alias]: alias
      }
    };

    try {
      const output = await this.client.send(new GetCommand(params));

      if (output.Item === undefined || output.Item === null) {
        return null;
      } else {
        return new User(
          output.Item[this.first_name],
          output.Item[this.last_name],
          output.Item[this.alias],
          output.Item[this.image_url]);
      }
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }

}