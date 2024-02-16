import { NavigateOptions, To } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import {UserService} from "../../model/service/UserService";

export interface RegisterView {
  navigate: (to: To, options?: NavigateOptions | undefined) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
  setImageUrl: (value: React.SetStateAction<string>) => void;
  setImageBytes: (value: React.SetStateAction<Uint8Array>) => void;
}

export class RegisterPresenter {
  private service: UserService;
  private view: RegisterView;

  public constructor(view: RegisterView) {
    this.service = new UserService();
    this.view = view
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    rememberMe: boolean
  ) {
    try {
      let [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    }
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

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }
}