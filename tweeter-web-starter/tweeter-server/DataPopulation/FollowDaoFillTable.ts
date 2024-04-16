import {BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput} from "@aws-sdk/lib-dynamodb";
import {execSync} from "child_process";
import {ddbDocClient} from "./ClientDynamo";

export class FollowDaoFillTable {
  readonly TABLE_NAME = "Follows";

  private follower_handle = "follower_handle";
  private follower_name = "follower_name";
  private follower_imageUrl = "follower_imageUrl";

  private followee_handle = "followee_handle";
  private followee_name = "followee_name";
  private followee_imageUrl = "followee_imageUrl";

  private imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";

  async createFollows(followeeAlias: string, followerAliasList: string[]){
    if(followerAliasList.length == 0){
      console.log('zero followers to batch write');
      return;
    }
    else{
      const params = {
        RequestItems: {
          [this.TABLE_NAME]: this.createPutFollowRequestItems(followeeAlias, followerAliasList)
        }
      }
      await ddbDocClient.send(new BatchWriteCommand(params))
        .then(async (resp: BatchWriteCommandOutput)=>{
          await this.putUnprocessedItems(resp, params, 0);
          return;
        })
        .catch((err: string) => {
          throw new Error('Error while batchwriting follows with params: ' + params + ": \n" + err);
        });
    }
  }
  private createPutFollowRequestItems(followeeAlias: string, followerAliasList: string[]){
    return followerAliasList.map(followerAlias => this.createPutFollowRequest(followerAlias, followeeAlias));
  }
  private createPutFollowRequest(followerAlias: string, followeeAlias: string){
    let item = {
      [this.follower_handle]: followerAlias,
      [this.followee_handle]: followeeAlias,

      [this.follower_name]: "first last",
      [this.followee_name]: "first last",

      [this.follower_imageUrl]: this.imageUrl,
      [this.followee_imageUrl]: this.imageUrl,
    }
    return {
      PutRequest: {
        Item: item
      }
    };
  }
  private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput, attempts: number){
    if(attempts > 1) console.log(attempts + 'th attempt starting');
    if(resp.UnprocessedItems != undefined){
      let sec = 0.03;
      if (Object.keys(resp.UnprocessedItems).length > 0) {
        console.log(Object.keys(resp.UnprocessedItems[this.TABLE_NAME]).length + ' unprocessed items');
        //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
        // @ts-ignore
        params.RequestItems = resp.UnprocessedItems;
        execSync('sleep ' + sec);
        if(sec < 10) sec += 0.1;
        await ddbDocClient.send(new BatchWriteCommand(params))
          .then(async (innerResp: BatchWriteCommandOutput) => {
            if(innerResp.UnprocessedItems != undefined && Object.keys(innerResp.UnprocessedItems).length > 0){
              params.RequestItems = innerResp.UnprocessedItems;
              ++attempts
              await this.putUnprocessedItems(innerResp, params, attempts)
            }
          }).catch((err: string) => {
            console.log('error while batch writing unprocessed items ' + err);
          });

      }
    }
  }
}