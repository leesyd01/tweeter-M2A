import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import UserItem from "./UserItem";
import { UserItemPresenter, UserItemView } from "../../presenter/UserItemPresenter";

interface Props {
  featurePath: string;
  presenterFactory: (view: UserItemView) => UserItemPresenter
}

const UserItemScroller = (props: Props) => {
  const { displayToast } = useMessageActions();
  const [items, setItems] = useState<User[]>([]);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  // const { getUser } = useUserNavigation();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: UserItemView = {
    addItems: (newItems: User[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: (message: string) => displayToast(ToastType.Error, message, 0),
  }

  const presenterRef = useRef<UserItemPresenter | null>(null)
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenterRef.current!.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems(); // M2A: scroll bar should be long until you start scrolling, then it gets smaller because more things are loading in. Make sure this functionality doesn't change
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []); // think about passing in a function instead of an array to avoid stale data from being passed in through the array
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias)
  }; 

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    return presenterRef.current!.getUser(authToken, alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems}
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