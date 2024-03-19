import useAuth from "../hooks/useAuth";
import logo from "../images/phoenix_logo.png";

export const HomePage = () => {
  const { auth } = useAuth();
  return (
    <div>
      <img src={logo} alt="Phoenix Logo" />
      {auth?.userName ? (
        <>
          <h4>Welcome {auth.userName}</h4>
        </>
      ) : (
        <h4>Please Log in</h4>
      )}
    </div>
  );
};
