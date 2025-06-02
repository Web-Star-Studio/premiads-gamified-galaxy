
import { FC } from "react";
import { Link } from "react-router-dom";

const HeaderLogo: FC = () => (
    <Link to="/" className="text-xl sm:text-2xl font-bold font-heading neon-text-cyan">
      <span className="text-white">Premi</span>Ads
    </Link>
  );

export default HeaderLogo;
