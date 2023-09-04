import { Outlet, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

const dispatchGroup = ["dispatch", "admin"];
const salesGroup = ["sales", "dispatch", "admin"];
const driverGroup = ["driver"];

const PrivateRoutes = () => {
  const [cookies] = useCookies(null);
  let auth = cookies.Username ? true : false;
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

const DriverRoutes = () => {
  const [cookies] = useCookies(null);

  //decode the token
  const decoded = jwt_decode(cookies.AuthToken);
  //if user is driver it navigate to the route requested. If not navigate to the home page
  return driverGroup.find((e) => e === decoded.userType) ? (
    <Outlet />
  ) : (
    <Navigate to="/home" />
  );
};

const SalesRoutes = () => {
  const [cookies] = useCookies(null);

  //decode the token
  const decoded = jwt_decode(cookies.AuthToken);
  //if user is sales it navigate to the route requested. If not navigate to the home page
  return salesGroup.find((e) => e === decoded.userType) ? (
    <Outlet />
  ) : (
    <Navigate to="/home" />
  );
};

const DispatchRoutes = () => {
  const [cookies] = useCookies(null);

  //decode the token
  const decoded = jwt_decode(cookies.AuthToken);
  //if user is dispatch it navigate to the route requested. If not navigate to the home page
  return dispatchGroup.find((e) => e === decoded.userType) ? (
    <Outlet />
  ) : (
    <Navigate to="/home" />
  );
};

const AdminRoutes = () => {
  const [cookies] = useCookies(null);

  //decode the token
  const decoded = jwt_decode(cookies.AuthToken);
  //if user is admin it navigate to the route requested. If not navigate to the home page
  return decoded.userType === "admin" ? <Outlet /> : <Navigate to="/home" />;
};

export {
  AdminRoutes,
  PrivateRoutes,
  DispatchRoutes,
  DriverRoutes,
  SalesRoutes,
};
