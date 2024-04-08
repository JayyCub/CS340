import {Status} from "tweeter-shared";
import {DataPage} from "../Dynamo/DataPage";

export abstract class StatusesDAO {
  abstract getStatuses(
    alias: string,
    pageSize: number,
    lastItem: number | undefined
  ): Promise<DataPage<Status>>;

  abstract postStatus(
    newStatus: Status,
  ): Promise<boolean>;
}