import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  author,
  createdAt,
  summary,
  cover,
}) {
  // Using environment variable for API URL
  const apiUrl = process.env.REACT_APP_API_URL;

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          {/* Update the src to use the environment variable */}
          <img src={`${apiUrl}/${cover}`} alt={title} />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          {/* Changed <a> to <span> since it's not a navigational link */}
          <span className="author">{author.username}</span>
          <time dateTime={createdAt}>
            {format(new Date(createdAt), "MMM d, yyy HH:mm")}
          </time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
