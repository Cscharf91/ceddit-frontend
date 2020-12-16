import React from 'react';
import { Link } from 'react-router-dom';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import moment from 'moment';

const PostDisplay = (props) => {
  const post = props.post;
  return (
    <div className="post-wrapper">
      <div className="post-op">
        <div className="op-header">
          <p className="sub-label">c/{post.zone ? post.zone.name : null}</p>
          {post && <p className="op-header-light">Posted by {post.user.username}</p>} 
          <p className="op-header-light">{moment(post.date).format('MMMM Do YYYY')}</p>
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
    </div>
  );
}

export default PostDisplay;