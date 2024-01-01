import { useContext } from "react";
import AuthContext from "../Authentication/context/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
