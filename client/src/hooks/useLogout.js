import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    localStorage.removeItem("persist");
    try {
      const response = await axios.get("/logout", {
        withCredentials: true,
      });
      console.log("Logged out: ", response.statusText);
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
