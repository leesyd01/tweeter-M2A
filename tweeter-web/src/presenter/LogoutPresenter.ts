import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LogoutView {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (id: string) => void;
  displayErrorMessage: (message: string) => void;
  clearUserInfo: () => void;
  navigate: (url: string) => void;
}

export class LogoutPresenter {
  private service: UserService;
  private view: LogoutView;

  public constructor(view: LogoutView) {
    this.service = new UserService();
    this.view = view;
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging out...", 0);
    try {
      await this.service.logout(authToken);
      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
    );
    }
  }
}