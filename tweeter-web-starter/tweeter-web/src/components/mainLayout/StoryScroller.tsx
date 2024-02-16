// StoryScroller.tsx
import StatusItemScroller from "./StatusItemScroller";
import {StatusItemView} from "../../presenter/StatusItems/StatusItemPresenter";
import {StoryItemPresenter} from "../../presenter/StatusItems/StoryItemPresenter";

const StoryScroller = () => {
  return <StatusItemScroller
    presenterGenerator={(view: StatusItemView) => new StoryItemPresenter(view)}
  />;
};

export default StoryScroller;
