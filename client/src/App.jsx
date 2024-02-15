/* eslint-disable no-restricted-globals */
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
//import MenuIcon from "@mui/icons-material/Menu";

import "./index.css";
import theme from "./theme.js";
import Login from "./pages/login";
import { HomePage } from "./pages/home";
import { DriverPayroll } from "./pages/driverpayroll";
import { ScheduledRoutes } from "./pages/driverPage";
import { AddClient } from "./pages/addclient";
import AddVehicle from "./pages/addvehicle";
import { Schedule } from "./pages/schedule";
import { Quotes } from "./pages/quotes";
import Register from "./pages/admin/RegisterUser.jsx";
import ResetPassword from "./pages/resetPassword";
import ResetUserPassword from "./pages/admin/ResetUserPassword";
import ErrorPage from "./error-page";
import Unauthorized from "./Unauthorized.jsx";
import DeleteUser from "./pages/admin/deleteUser";
import { ServiceLocation } from "./pages/servicelocation";
import { FarmOut } from "./pages/admin/farmout";
import { Employee } from "./pages/admin/employee";
import { Bookings } from "./pages/bookings.jsx";
import RequireAuth from "./Authentication/RequireAuth.js";
import PersistLogin from "./Authentication/PersistLogin.js";
import APPBar from "./pages/appBar.jsx";

const App = () => {
  const ROLES = {
    all: [2501, 8259, 4174, 6935],
    admin: 2501,
    dispatch: 8259,
    sales: 4174,
    driver: 6935,
  };

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/*public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/*private routes */}
        <Route element={<PersistLogin />}>
          <Route element={<APPBar />}>
            <Route element={<RequireAuth allowedRoles={ROLES.all} />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route
                element={
                  <RequireAuth
                    allowedRoles={[ROLES.admin, ROLES.dispatch, ROLES.sales]}
                  />
                }
              >
                <Route path="/addclient" element={<AddClient />} />
                <Route path="/servicelocations" element={<ServiceLocation />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/schedule" element={<Schedule />} />
              </Route>
              <Route
                element={
                  <RequireAuth allowedRoles={[ROLES.driver, ROLES.admin]} />
                }
              >
                <Route path="/driverpage" element={<ScheduledRoutes />} />
              </Route>
              <Route
                element={
                  <RequireAuth allowedRoles={[ROLES.admin, ROLES.dispatch]} />
                }
              >
                <Route path="/addvehicle" element={<AddVehicle />} exact />
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
                <Route path="/signup" element={<Register />} exact />
                <Route
                  path="/resetUserPass"
                  element={<ResetUserPassword />}
                  exact
                />
                <Route path="/driverpayroll" element={<DriverPayroll />} />
                <Route path="/removeuser" element={<DeleteUser />} />
                <Route path="/farmout" element={<FarmOut />} />
                <Route path="/employee" element={<Employee />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
