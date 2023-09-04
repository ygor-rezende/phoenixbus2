import { useCookies } from "react-cookie";

export const HomePage = () => {
  const [cookies] = useCookies(null);
  return (
    <div>
      <h1>Home Page</h1>
      {cookies.Username ? (
        <h4>Welcome {cookies.Username}</h4>
      ) : (
        <h4>Please Log in</h4>
      )}
    </div>
  );
};
