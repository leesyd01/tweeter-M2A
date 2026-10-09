import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "../userItem/UserItemScroller";

const loadMoreFollowers = async (
  authToken: AuthToken,
  userAlias: string,
  pageSize: number,
  lastFollower: User | null
): Promise<[User[], boolean]> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
};

const FollowersScroller = () => {
  return (
    <UserItemScroller
      featurePath="/followers"
      itemDescription="followers"
      loadMoreItems={loadMoreFollowers}
    />
  );
};

export default FollowersScroller;