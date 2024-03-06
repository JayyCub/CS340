import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter, PostStatusView } from "../../../src/presenter/PostStatusPresenter";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("Post Status", () => {
  const mockUserInstance = new User("first", "last", "alias", "image_url");
  const mockAuthTokenInstance = new AuthToken("token", 1);

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("when first rendered, the Post Status and Clear buttons are both disabled.", () => {
    const { clearStatusButton, postStatusButton } =
      renderPostStatusCompAndGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("has both buttons enabled when the text field has text.", async () => {
    const { postTextBox, clearStatusButton, postStatusButton, user } =
      renderPostStatusCompAndGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();

    await user.type(postTextBox, "oh like SAND Dune");

    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it("Both buttons are disabled when the text field is cleared.", async () => {
    const { postTextBox, clearStatusButton, postStatusButton, user } =
      renderPostStatusCompAndGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();

    await user.type(postTextBox, "awesome tweet");

    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();

    await user.clear(postTextBox);

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with the correct parameters " +
    "when the post status button is clicked", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const val = "some tweet message";

    const { postTextBox, postStatusButton, user } = renderPostStatusCompAndGetElements(mockPresenterInstance);

    await user.type(postTextBox, val);

    expect(postStatusButton).toBeEnabled();
    await user.click(postStatusButton);

    verify(mockPresenter.submitPost(val, mockUserInstance, mockAuthTokenInstance)).once();
  });
});

const renderPostStatusComp = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
        <PostStatus
          presenterGenerator={(view: PostStatusView) => !!presenter ? presenter : new PostStatusPresenter(view)}
        />
    </MemoryRouter>
  );
};

const renderPostStatusCompAndGetElements = (
  presenter?: PostStatusPresenter
) => {
  const user = userEvent.setup();

  renderPostStatusComp(presenter);

  const postTextBox = screen.getByLabelText("postTextArea");
  const postStatusButton = screen.getByLabelText("postButton");
  const clearStatusButton = screen.getByLabelText("clearButton");

  return { postTextBox, postStatusButton, clearStatusButton, user };
};