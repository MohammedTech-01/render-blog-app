import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState(""); // State to hold registration error message

  const apiUrl = process.env.REACT_APP_API_URL; // Use environment variable for API URL
  console.log(apiUrl)

  const register = async (ev) => {
    ev.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // This must match the CORS configuration on the backend
      });
      if (response.ok) {
        alert("Registration successful!");
        setUsername(''); // Clear inputs after successful registration
        setPassword('');
      } else {
        const errorMessage = await response.text(); // Read the error message from the response
        setRegisterError(errorMessage || "Registration failed, please try again.");
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      setRegisterError("Network error, unable to connect.");
    }
  };

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      {registerError && <p style={{ color: 'red' }}>{registerError}</p>} {/* Display error message */}
      <input
        type="text"
        placeholder="username"
        value={username} // Corrected from 'val' to 'value'
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password} // Corrected from 'val' to 'value'
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
}
