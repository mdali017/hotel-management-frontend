import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader/DashboardHeader";

const DashboardLayout = () => {
  const location = useLocation();
  const noDashboardHeader = location.pathname.includes("/dashboard/invoice/");
  return (
    <>
      {noDashboardHeader || <DashboardHeader />}

      <div>
        <Outlet />
      </div>
    </>
  );
};

export default DashboardLayout;
