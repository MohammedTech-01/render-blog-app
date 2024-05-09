import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../userContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loginError, setLoginError] = useState(""); // For displaying login errors
  const { setUserInfo } = useContext(UserContext);
  const apiUrl = process.env.REACT_APP_API_URL; // Use environment variable for API URL

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    if (response.ok) {
      const userInfo = await response.json();
      setUserInfo(userInfo);
      setRedirect(true);
    } else {
      const errorText = await response.text(); // Assuming the server sends back a plain text error message
      setLoginError(errorText || "Login failed, please try again.");
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      {loginError && <p className="error">{loginError}</p>} {/* Displaying error messages */}
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password} // Corrected from val to value
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
