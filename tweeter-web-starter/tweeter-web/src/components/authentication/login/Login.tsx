import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import {AuthenticationView} from "../../../presenter/Authentication/AuthPresenter";
import {LoginPresenter} from "../../../presenter/Authentication/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenterGenerator: (view: AuthenticationView) => LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const listener: AuthenticationView = {
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    navigate: (url: string) => navigate(url),
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const doLogin = async () => {
    await presenter.doLogin(
      props.originalUrl,
      alias,
      password,
      rememberMeRef.current
    );
  };

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const onAliasEvent = (s: string) => {
    setAlias(s);
  };

  const onPasswordEvent = (s: string) => {
    setPassword(s);
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields
        setAliasFunc={onAliasEvent}
        setPasswordFunc={onPasswordEvent}
        bottomClass={true}
      />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doLogin}
    />
  );
};

export default Login;