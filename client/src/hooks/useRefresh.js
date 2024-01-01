import useAuth from "./useAuth";
import axios from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", { withCredentials: true });

    setAuth((prev) => {
      //console.log(JSON.stringify(prev));
      //console.log(response.data.accessToken);
      return {
        ...prev,
        userName: response.data.userName,
        accessToken: response.data.accessToken,
        role: response.data.role,
      };
    });

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
