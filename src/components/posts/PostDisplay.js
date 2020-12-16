import React from 'react';
import { Link } from 'react-router-dom';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const PostDisplay = (props) => {
  const post = props.post;
  return (
    <div className="post-wrapper">
      <div className="post-op">
        <div className="op-header">
          <p className="sub-label">c/random</p>
          {post && <p className="op-header-light">Posted by {post.user.username}</p>} 
          <p className="op-header-light">2 days ago</p>
        </div>
        {/* <div className="comment-vote">
          <ArrowDropUpIcon fontSize="large" />
          <p className="upvote-count">500</p>
          <ArrowDropDownIcon className="row-3" fontSize="large" />
        </div> */}
        <div className="comment-vote">
          <ArrowDropUpIcon fontSize="large" />
          <p className="upvote-count">500</p>
          <ArrowDropDownIcon className="row-3" fontSize="large" />
          <h3 className="comment-user"><Link to={`/${post._id}`}>{post.title}</Link></h3>
        </div>
      </div>
        <h5>From: {post.user.username}</h5>
        {/* <p>{post.body}</p> */}
        {props.user && props.user.email === post.user.email && <button onClick={() => props.deletePost(post)}>Delete</button>}
        {props.user && props.user.email === post.user.email && <Link to={`/edit/${post._id}`}>Edit</Link>}
        
      </div>
  );
}

export default PostDisplay;