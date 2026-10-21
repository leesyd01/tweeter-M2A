import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastType } from "../toaster/Toast";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";

export const useUserNavigation = () => {
  const { displayToast } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  const listener: UserNavigationView = {
    setDisplayedUser: (user) => setDisplayedUser(user),
    navigate: (url: string) => navigate(url),
    displayErrorMessage: (message: string) =>
      displayToast(ToastType.Error, message, 0),
  };

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter(listener);
  }

  const navigateToUser = (
    event: React.MouseEvent,
    featurePath: string
  ): void => {
    event.preventDefault();
    presenterRef.current!.navigateToUser(
      authToken!,
      displayedUser!,
      event.target.toString(),
      featurePath
    );
  };

  return { navigateToUser };
};