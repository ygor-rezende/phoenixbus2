import useAxiosPrivate from "./useAxiosPrivate";

export const UsePrivateGet = () => {
  const axiosPrivate = useAxiosPrivate();
  const getServer = async (endpoint, controllerSignal = null) => {
    try {
      const response = await axiosPrivate.get(endpoint, {
        signal: controllerSignal,
      });
      return { data: response.data };
    } catch (err) {
      console.error(err);
      if (!err?.response) {
        return { error: "No Server response" };
      }
      //Unauthorized -> login again
      else if (err?.response?.status === 401) {
        return { disconnect: true };
      }
      //Missing information
      else if (err?.response?.status === 400) {
        return { error: err.response.data?.message };
      }
      //Internal server error
      else if (err?.response?.status === 500) {
        console.log(`Message from server: ${err.response.data?.message}`);
        return { error: "Something went wrong: server error" };
      }
      //authToken expired (403) or another error
      else {
        return { error: "Something went wrong, please try again" };
      }
    }
  };

  return getServer;
};

export const UsePrivatePost = () => {
  const axiosPrivate = useAxiosPrivate();
  const statusCodes = [400, 409, 503];
  const postServer = async (
    endpoint,
    paramsObject, // an object to be converted to Json
    controllerSignal = null //controller signal
  ) => {
    try {
      const response = await axiosPrivate.post(
        endpoint,
        JSON.stringify(paramsObject),
        {
          signal: controllerSignal,
        }
      );
      return { data: response.data, status: response.status };
    } catch (err) {
      console.error(err);
      if (!err?.response) {
        return { error: "No Server response" };
      }
      //Unauthorized -> login again
      else if (err?.response?.status === 401) {
        return { disconnect: true };
      }
      //Missing information, service unavailable, conflict...
      else if (statusCodes.includes(err?.response?.status)) {
        return { error: err.response.data?.message };
      }
      //Internal server error
      else if (err?.response?.status === 500) {
        console.log(`Message from server: ${err.response.data?.message}`);
        return { error: "Something went wrong: server error" };
      }
      //authToken expired (403) or another error
      else {
        return { error: "Something went wrong, please try again" };
      }
    }
  };
  return postServer;
};

export const UsePrivateDelete = () => {
  const axiosPrivate = useAxiosPrivate();
  const deleteServer = async (endpoint) => {
    try {
      const response = await axiosPrivate.delete(endpoint);
      return { data: response.data, status: response.status };
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        return { error: "No Server response" };
      }
      //Unauthorized -> login again
      else if (err?.response?.status === 401) {
        return { disconnect: true };
      }
      //Missing information
      else if (err?.response?.status === 400) {
        return { error: err.response.data?.message };
      }
      //Internal server error
      else if (err?.response?.status === 500) {
        console.log(`Message from server: ${err.response.data?.message}`);
        return { error: "Something went wrong: server error" };
      }
      //authToken expired (403) or another error
      else {
        return { error: "Something went wrong, please try again" };
      }
    }
  };
  return deleteServer;
};
