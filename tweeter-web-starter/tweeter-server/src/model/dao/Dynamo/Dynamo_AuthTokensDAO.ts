import {DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {AuthToken} from "tweeter-shared";
import {AuthTokensDAO} from "../interfaces/AuthTokensDAO";

export class Dynamo_AuthTokensDAO implements AuthTokensDAO {
  readonly tableName = "AuthTokens";
  readonly token_str = "token_str";
  readonly user_alias = "user_alias";
  readonly time_stamp = "time_stamp";

  readonly expirationTimeLimitMins = 15;

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putAuthToken(authtoken: AuthToken, alias: string): Promise<AuthToken> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.token_str]: authtoken.token,
        [this.user_alias]: alias,
        [this.time_stamp]: authtoken.timestamp
      },
    };
    try {
      await this.client.send(new PutCommand(params));
      return authtoken;
    } catch (e) {
      throw new Error("[Server Error] Error adding new AuthToken: " + e);
    }
  }

  async validateToken(authToken: AuthToken): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.token_str]: authToken.token
      }
    };

    try {
      const output = await this.client.send(new GetCommand(params));
      if (output.Item === undefined || output.Item === null) {
        return false;
      } else {
        let authTokenAge =
          Math.abs(Date.now() - output.Item[this.time_stamp]) / 1000 / 60;

        return authTokenAge <= this.expirationTimeLimitMins;
      }
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }

  async deleteToken(authToken: AuthToken): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.token_str]: authToken.token
      }
    };

    try {
      await this.client.send(new DeleteCommand(params));
      return true;
    } catch (e) {
      throw new Error("[Server Error] : " + e)
    }
  }
}
