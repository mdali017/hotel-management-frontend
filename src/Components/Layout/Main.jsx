import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { Outlet, useLocation } from "react-router-dom";

const Main = () => {
  const location = useLocation();
  const noHeaderAndFooter = location.pathname.includes("login");

  return (
    <>
      {noHeaderAndFooter || <Header />}
      <Outlet />
      {noHeaderAndFooter || <Footer />}
    </>
  );
};

export default Main;
