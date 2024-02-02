// StoryScroller.tsx
import StatusItemScroller from "./StatusItemScroller";
import {AuthToken, FakeData, Status, User} from "tweeter-shared";

const StoryScroller = () => {
  const loadMoreStoryItems = async (
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return <StatusItemScroller loadMoreItems={loadMoreStoryItems} />;
};

export default StoryScroller;
