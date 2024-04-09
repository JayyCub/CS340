
export interface View {
  displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => void;
}

export interface MessageView extends View {
  clearLastInfoMessage: () => void;
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void
}

export class Presenter {
  private _view: View;

  protected constructor(view: View) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    failureDisplayMessage: string
  ): Promise<void> {
    try {
      await operation();
    } catch (error) {
      console.error(
        `Failed to ${operationDescription} because of exception: ${(error as Error).message}`
      );
      this.view.displayErrorMessage(failureDisplayMessage);
    }
  };

}