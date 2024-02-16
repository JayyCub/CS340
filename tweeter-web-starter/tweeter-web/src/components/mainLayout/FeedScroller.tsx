// FeedScroller.tsx
import StatusItemScroller from "./StatusItemScroller";
import {StatusItemView} from "../../presenter/StatusItems/StatusItemPresenter";
import {FeedItemPresenter} from "../../presenter/StatusItems/FeedItemPresenter";

const FeedScroller = () => {
  return <StatusItemScroller
    presenterGenerator={(view: StatusItemView) => new FeedItemPresenter(view)}
  />;
};

export default FeedScroller;
