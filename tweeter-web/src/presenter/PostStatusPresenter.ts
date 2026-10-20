export interface PostStatusView {
    setIsLoading: (isLoading: boolean) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (id: string) => void;
    displayErrorMessage: (message: string) => void;
    clearPost: () => void;   // wraps setPost("")
  }