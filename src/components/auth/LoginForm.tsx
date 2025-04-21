
import LoginFormContainer from "./LoginFormContainer";

type Props = {
  onSuccess: () => void;
};

const LoginForm = ({ onSuccess }: Props) => {
  return <LoginFormContainer onSuccess={onSuccess} />;
};

export default LoginForm;
