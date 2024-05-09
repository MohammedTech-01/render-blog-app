import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../userContext";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(false);     // Track error state
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;  // Use environment variable

  useEffect(() => {
    fetch(`${apiUrl}/post/${id}`)
      .then((res) => {
        if (!res.ok) {  // Check if response is ok
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((postInfo) => {
        setPostInfo(postInfo);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setLoading(false);
        setError(true);
      });
  }, [apiUrl, id]);  // Include apiUrl and id in the dependencies array

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading the post. Please try again later.</div>;
  }

  if (!postInfo) {
    return <div>No post found!</div>;
  }

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{format(new Date(postInfo.createdAt), "MMM d, yyyy HH:mm")}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo?.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              {/* SVG path remains the same */}
            </svg>
            Edit this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`${apiUrl}/${postInfo.cover}`} alt={postInfo.title || 'Post Cover'} />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      ></div>
    </div>
  );
}
