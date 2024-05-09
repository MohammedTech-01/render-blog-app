import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  // Using environment variable for API URL
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/profile`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((userInfo) => {
        if (userInfo) {
          setUserInfo(userInfo);
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        setUserInfo(null); // Optional: handle user not found or error by resetting user context
      });
  }, [apiUrl, setUserInfo]);

  function logout() {
    fetch(`${apiUrl}/logout`, {
      credentials: "include",
      method: "POST",
    })
      .then(() => {
        setUserInfo(null);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        FCIT-Blog
      </Link>
      <nav>
        {username ? (
          <>
            <span>Hello, {username}</span>
            <Link to="/create">Create Post</Link>
            {/* Improved logout handling by using button and proper onClick */}
            <button onClick={logout} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
