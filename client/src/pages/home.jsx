import useAuth from "../hooks/useAuth";

export const HomePage = () => {
  const { auth } = useAuth();
  return (
    <div>
      <h1>Home Page</h1>
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
