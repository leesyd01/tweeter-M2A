import { useContext } from "react";
import { ToastActionsContext, ToastListContext } from "./ToastContexts";

export const useMessageActions = () => useContext(ToastActionsContext);

export const useMessageList = () => useContext(ToastListContext);

// go watch part 3 lecture video to convert useContext and wrap the message hooks
