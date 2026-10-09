import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "../userItem/UserItemScroller";

const loadMoreFollowees = async (
  authToken: AuthToken,
  userAlias: string,
  pageSize: number,
  lastFollowee: User | null
): Promise<[User[], boolean]> => {
  return FakeData.instance.getPageOfUsers(lastFollowee, pageSize, userAlias);
};

const FolloweesScroller = () => {
  return (
    <UserItemScroller
      featurePath="/followees"
      itemDescription="followees"
      loadMoreItems={loadMoreFollowees}
    />
  );
};

export default FolloweesScroller;