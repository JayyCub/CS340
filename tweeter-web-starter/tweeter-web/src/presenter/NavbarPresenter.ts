import { AuthToken } from 'tweeter-shared'
import {UserService} from "../model/service/UserService";

export interface NavbarView {
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void
  clearLastInfoMessage: () => void
  clearUserInfo: () => void
  displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => void
}

export class NavbarPresenter {
  private view
  private service
  constructor(view: NavbarView) {
    this.view = view
    this.service = new UserService()
  }

  async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage('Logging Out...', 0)

    try {
      await this.service.logout(authToken)

      this.view.clearLastInfoMessage()
      this.view.clearUserInfo()
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`)
    }
  }
}