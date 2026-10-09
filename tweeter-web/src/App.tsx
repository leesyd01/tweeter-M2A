import "./App.css";
// import { useContext } from "react";
import { UserInfoContext } from "./components/userInfo/UserInfoContexts";
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
import FolloweesScroller from "./components/mainLayout/FolloweesScroller";
import FollowersScroller from "./components/mainLayout/FollowersScroller";
import FeedScroller from "./components/mainLayout/FeedScroller";
import StoryScroller from "./components/mainLayout/StoryScroller";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import UserItemScroller from "./components/userItem/UserItemScroller";
import StatusItemScroller from "./components/statusItem/StatusItemScroller";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";

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
  const { displayedUser } = useUserInfo();

  const loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  const loadMoreStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  const loadMoreFollowees = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null
  ): Promise<[User[], boolean]> => {
    return FakeData.instance.getPageOfUsers(lastFollowee, pageSize, userAlias);
  };

  const loadMoreFollowers = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null
  ): Promise<[User[], boolean]> => {
    return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route 
          path="feed/:displayedUser" 
          element={
          <StatusItemScroller 
            key={`feed-${displayedUser!.alias}`}
            featurePath="/feed"
            itemDescription="feed"
            loadMoreItems={loadMoreFeedItems} 
            />
          }
          />

        <Route 
          path="story/:displayedUser" 
          element={
          <StatusItemScroller 
            key={`story-${displayedUser!.alias}`}
            featurePath="/story"
            itemDescription="story"
            loadMoreItems={loadMoreStoryItems}
            />
          }
          />

          <Route 
          path="followees/:displayedUser" 
          element={
          <UserItemScroller 
            key={`followees-${displayedUser!.alias}`}
            featurePath="/followees"
            itemDescription="followees"
            loadMoreItems={loadMoreFollowees}
            />
          }
          />

          <Route 
          path="followers/:displayedUser" 
          element={
          <UserItemScroller 
            key={`followers-${displayedUser!.alias}`}
            featurePath="/followers"
            itemDescription="followers"
            loadMoreItems={loadMoreFollowers}
            />
          }
          />

        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
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
