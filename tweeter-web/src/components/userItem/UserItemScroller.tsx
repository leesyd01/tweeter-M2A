import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useUserNavigation } from "../userNavigation/UserNavigationHook";
import UserItem from "./UserItem";

export const PAGE_SIZE = 10;

interface Props {
  featurePath: string;
  itemDescription: string;
  loadMoreItems: (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ) => Promise<[User[], boolean]>;
}

const UserItemScroller = (props: Props) => {
  const { displayToast } = useMessageActions();
  const [items, setItems] = useState<User[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<User | null>(null);

  const addItems = (newItems: User[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { getUser } = useUserNavigation();
  const { displayedUser: displayedUserAliasParam } = useParams();

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  // 
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems(null); // M2A: scroll bar should be long until you start scrolling, then it gets smaller because more things are loading in. Make sure this functionality doesn't change
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []); // think about passing in a function instead of an array to avoid stale data from being passed in through the array
    setLastItem(() => null);
    setHasMoreItems(() => true);
  };

  const loadMoreItems = async (lastItem: User | null) => {
    try {
      const [newItems, hasMore] = await props.loadMoreItems(
        authToken!,
        displayedUser!.alias,
        PAGE_SIZE,
        lastItem
      );

      setHasMoreItems(() => hasMore);
      setLastItem(() => newItems[newItems.length - 1]);
      addItems(newItems);
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to load ${props.itemDescription} because of exception: ${error}`,
        0
      );
    }
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => loadMoreItems(lastItem)}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <UserItem user={item} featurePath={props.featurePath} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;