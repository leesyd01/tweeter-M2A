import { StatusService } from "../model.service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

export interface PostStatusView {
    setIsLoading: (isLoading: boolean) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (id: string) => void;
    displayErrorMessage: (message: string) => void;
    clearPost: () => void;
  }

  export class PostStatusPresenter {
    private service: StatusService;
    private view: PostStatusView;
  
    public constructor(view: PostStatusView) {
      this.service = new StatusService();
      this.view = view;
    }
  
    public checkButtonStatus(
      post: string,
      authToken: AuthToken | null,
      currentUser: User | null,
      isLoading: boolean
    ): boolean {
      return !post.trim() || !authToken || !currentUser || isLoading;
    }
  
    public async postStatus(
      authToken: AuthToken,
      currentUser: User,
      post: string
    ) {
      let postingStatusToastId = "";
  
      try {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);
        const newStatus = new Status(post, currentUser, Date.now());
        await this.service.postStatus(authToken, newStatus);
        this.view.clearPost();
        this.view.displayInfoMessage("Status posted!", 2000);
      } catch (error) {
        this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`)
      } finally {
        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
      }
    }
  }
    
  