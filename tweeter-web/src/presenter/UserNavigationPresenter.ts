import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private service: UserService;
  private view: UserNavigationView;

  public constructor(view: UserNavigationView) {
    this.service = new UserService();
    this.view = view;
  }

  public async navigateToUser(
    authToken: AuthToken,
    displayedUser: User,
    targetText: string,   // event.target.toString() from the view
    featurePath: string
  ) {
    try {
      const alias = this.extractAlias(targetText);
      const toUser = await this.service.getUser(authToken, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser)) {
            this.view.setDisplayedUser(toUser);
            this.view.navigate(`${featurePath}/${alias}`)
          }
      }
      
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`)
    }
  }
    
  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
}
}