import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import {UserNavPresenter, UserNavView} from "../../presenter/UserInfo/UserNavPresenter";

interface UserNavigator {
    navigateToUser: (event: React.MouseEvent) => Promise<void>
}

const useUserNavigation = (): UserNavigator => {
    const { setDisplayedUser, currentUser, authToken } =
      useUserInfo();
    const { displayErrorMessage } = useToastListener();

    const listener: UserNavView = {
        setDisplayedUser: setDisplayedUser,
        displayErrorMessage: displayErrorMessage,
    }

    const presenter = new UserNavPresenter(listener)

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        await presenter.navigateToUser(authToken!, currentUser!, event.target.toString())
    };

    return {
        navigateToUser: navigateToUser,
    }
}

export default useUserNavigation