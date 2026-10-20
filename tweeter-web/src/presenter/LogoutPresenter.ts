export interface LogoutView {
    displayInfoMessage: (message: string, duration: number) => string; // returns the toast id
    deleteMessage: (id: string) => void;
    displayErrorMessage: (message: string) => void;
    clearUserInfo: () => void;
    navigate: (url: string) => void;
  }