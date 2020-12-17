import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import Comment from './Comment';
import './post.css';
import ChatIcon from '@material-ui/icons/Chat';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import moment from 'moment';

const Post = (props) => {
  document.body.style.background = "#2e2f2f";
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    trackPromise(getPost());
  }, [])
  
  const getPost = async () => {
    const data = await Axios.get(`http://localhost:5000/api/posts/${props.match.params.id}`);
    console.log("post data:", data.data);
    setPost(data.data);
    setComments(data.data.comments);
  }
  const commentList = comments.map((comment) => {
    return <Comment nested="0" comment={comment} />
  });

  return (
    <div className="post-wrapper min-height">
      <div className="post-info-header">
        <div className="post-header-title">
          <ChatIcon fontSize="small" />
          {post && <h3>{post.title}</h3>}
        </div>
      </div>
      <div className="post-content">
        <div className="post-op">
          <div className="op-header">
            <p className="sub-label">c/{post && post.zone ? post.zone.name : null}</p>
            {post && <p className="op-header-light">Posted by {post.user.username}</p>} 
            <p className="op-header-light">{post && moment(post.date).format('MMMM Do YYYY')}</p>
          </div>
          <div className="op-votes-title">
            <div className="votes">
              <ArrowDropUpIcon fontSize="large" />
              <p className="upvote-count">500</p>
              <ArrowDropDownIcon className="row-3" fontSize="large" />
            </div>
            {post && <h3 className="op-title">{post.title}</h3>}
          </div>
          {post && post.image && <img src={post.image} alt={`${post.title}`} className="post-image" />}
          {post && <p className="op-body">{post.body}</p>}
        {post && props.user && props.user.email === post.user.email && <button className="post-btn" onClick={() => props.deletePost(post)}>Delete</button>}
        {post && props.user && props.user.email === post.user.email && <Link className="post-btn" to={`/edit/${post._id}`}>Edit</Link>}
        </div>
        {commentList}
      </div>
    </div>
  );
}

export default Post;