import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Users = () => {
  const [users, setUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controler = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/getusernames", {
          signal: controler.signal,
        });
        const responseData = response.data;
        console.log(responseData);
        isMounted && setUsers(responseData);
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controler.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
