import React from 'react';
import { Link } from 'react-router-dom';

const PostDisplay = (props) => {
  const post = props.post;
  return (
    <div className="post-wrapper">
      <h3><Link to={`/${post._id}`}>{post.title}</Link></h3>
      <h5>From: {post.user.username}</h5>
      {/* <p>{post.body}</p> */}
      {props.user && props.user.email === post.user.email && <button onClick={() => props.deletePost(post)}>Delete</button>}
      {props.user && props.user.email === post.user.email && <Link to={`/edit/${post._id}`}>Edit</Link>}
    </div>
  );
}

export default PostDisplay;