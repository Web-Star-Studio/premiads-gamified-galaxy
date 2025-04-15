
import { useNavigate } from "react-router-dom";
import HelpButton from "./HelpButton";
import LiveChat from "./LiveChat";

const SupportTools = () => {
  return (
    <>
      <LiveChat />
      <HelpButton />
    </>
  );
};

export default SupportTools;
