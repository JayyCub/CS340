import {MemoryRouter} from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import {AuthenticationView} from "../../../../src/presenter/Authentication/AuthPresenter";
import {LoginPresenter} from "../../../../src/presenter/Authentication/LoginPresenter";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {anything, instance, mock, verify} from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign-in button disabled.", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button if both alias and password fields have text.", async () => {
    const {signInButton, aliasField, passwordField, user} =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "name");
    await user.type(passwordField, "pass");
    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button if either field is cleared.", async () => {
    const {signInButton, aliasField, passwordField, user} =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "name");
    await user.type(passwordField, "pass");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "name2");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  })

  it("calls the presenters login method with correct parameters when sign-in button is pressed.", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "https://localhost:8080";
    const alias = "@JacobAlias";
    const password = "pass";

    const {signInButton, aliasField, passwordField, user} =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(mockPresenter.doLogin(originalUrl, alias, password, anything())).once();

  })
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      <Login presenterGenerator={(view: AuthenticationView) => !!presenter ? presenter : new LoginPresenter(view)}
             originalUrl={originalUrl}
      />
    </MemoryRouter>)
}

const renderLoginAndGetElements = (originalUrl: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", {name: /Sign in/i});
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return {signInButton, aliasField, passwordField, user};
}
