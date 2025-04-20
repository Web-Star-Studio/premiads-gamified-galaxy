
import { FC } from "react";
import { Link } from "react-router-dom";

const HeaderLogo: FC = () => {
  return (
    <Link to="/" className="text-xl font-bold">
      <span className="text-white">Premi</span>
      <span className="text-neon-cyan">Ads</span>
    </Link>
  );
};

export default HeaderLogo;
