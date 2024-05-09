import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFile] = useState(null); // Initialize as null for better type safety
  const [redirect, setRedirect] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL; // Accessing environment variable

  async function createNewPost(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files) {
      data.set("file", files[0]); // Ensure files exist before setting
    }

    const response = await fetch(`${apiUrl}/post`, { // Use apiUrl variable
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    } else {
      // Optionally handle errors here (e.g., display a message to the user)
      console.error('Failed to create the post');
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text" // Changed from 'title' to 'text' as 'title' is not a valid input type
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="text" // Changed from 'summary' to 'text' for the same reason
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFile(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "10px" }}>Create post</button>
    </form>
  );
}
