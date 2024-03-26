import "@testing-library/jest-dom";
import "isomorphic-fetch";
import { StatusService } from "../../../src/model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

describe("StatusService", () => {
  const statusService: StatusService = new StatusService();

  it("Return first two pagination's of story page", async () => {
    let result: [Status[], boolean] =
      await statusService.loadMoreStoryItems(
        new AuthToken("token", 0),
        new User("jacob", "thomsen", "@jaycub", "imageurl.com"),
        10,
        null
      );

    expect(result).not.toBeNull();
    const pageOfStatuses: Status[] = result[0];
    const hasMoreItems: boolean = result[1];
    expect(pageOfStatuses).not.toBeNull();
    expect(hasMoreItems).not.toBeNull();

    if (hasMoreItems === true) {
      expect(pageOfStatuses.length).toBe(10);

      let moreResults: [Status[], boolean] =
        await statusService.loadMoreStoryItems(
          new AuthToken("token", 0),
          new User("jacob", "thomsen", "@jaycub", "imageurl"),
          10,
          pageOfStatuses.at(-1)!
        );

      const pageOfMoreStatuses: Status[] = moreResults[0];
      expect(pageOfMoreStatuses).not.toBeNull();
      expect(pageOfMoreStatuses.length).toBeGreaterThanOrEqual(1);
    }
  });
});