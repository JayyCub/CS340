import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import useUserInfo from "./components/userInfo/UserInfoHook";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import {UserItemView} from "./presenter/UserItems/UserItemPresenter";
import {FollowingPresenter} from "./presenter/UserItems/FollowingPresenter";
import {FollowersPresenter} from "./presenter/UserItems/FollowersPresenter";
import {StatusItemPresenter, StatusItemView} from "./presenter/StatusItems/StatusItemPresenter";
import {FeedItemPresenter} from "./presenter/StatusItems/FeedItemPresenter";
import {StoryItemPresenter} from "./presenter/StatusItems/StoryItemPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/feed" />} />
          <Route path="feed" element={
              <StatusItemScroller
                  presenterGenerator={(view: StatusItemView) => new FeedItemPresenter(view)}
              />
          }
          />
          <Route path="story" element={
              <StatusItemScroller
                presenterGenerator={(view: StatusItemView) => new StoryItemPresenter(view)}
              />
          }
          />
          <Route
          path="following"
          element={
            <UserItemScroller
              presenterGenerator={(view: UserItemView) => new FollowingPresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              presenterGenerator={(view: UserItemView) => new FollowersPresenter(view)}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
