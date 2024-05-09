import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const apiUrl = process.env.REACT_APP_API_URL; // Access the environment variable

  useEffect(() => {
    fetch(`${apiUrl}/post`) // Use the environment variable for the API URL
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false); // Update loading state after data is received
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setLoading(false); // Update loading state even if there is an error
      });
  }, [apiUrl]); // Include apiUrl in dependencies array

  return (
    <>
      {loading && (
        <p style={{ textAlign: "center", fontSize: "24px" }}>Loading...</p>
      )}
      {!loading && posts.length === 0 && (
        <p style={{ textAlign: "center", fontSize: "24px" }}>No posts found.</p>
      )}
      {posts.map((post) => (
        <Post {...post} /> // Use unique keys for list items to help React with re-renders
      ))}
    </>
  );
}
