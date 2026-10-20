import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
  setIsLoading: (isLoading: boolean) => void;
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (url: string) => void;
  setImageUrl: (url: string) => void;
}

export class RegisterPresenter {
  private service: UserService;
  private view: RegisterView;
  private imageBytes: Uint8Array = new Uint8Array();
  private imageFileExtension: string = "";

  public constructor(view: RegisterView) {
    this.service = new UserService();
    this.view = view;
  }

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !this.imageFileExtension
    );
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        this.imageBytes = Buffer.from(imageStringBase64BufferContents, "base64");
      };
      reader.readAsDataURL(file);

      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
      }
    } else {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
      this.imageFileExtension = "";
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    rememberMe: boolean
  ) {

    if (password.length < 8) {
      this.view.displayErrorMessage(
        "Password must be at least 8 characters long."
      );
      return;
    }

    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        this.imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}