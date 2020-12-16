import React, { useEffect, useState } from 'react';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Axios from 'axios';

const Comment = (props) => {
  const [nestedComments, setNestedComments] = useState(null);
  const [commentUser, setCommentUser] = useState(null);
  const nested = parseInt(props.nested);

  useEffect(() => {
    fetchUser();
    const listComm = props.comment.children.length > 0 ? [...props.comment.children] : null;
    if (listComm) {
      console.log("nested comments: ", listComm);
      setNestedComments(listComm);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const data = await Axios.get(`http://localhost:5000/api/users/${props.comment.username}`);
      setCommentUser(data.data.username);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className={`comment nested-${props.nested}`}>
      <div className="comment-vote">
          <ArrowDropUpIcon fontSize="large" />
          <p className="upvote-count">500</p>
          <ArrowDropDownIcon className="row-3" fontSize="large" />
        <p className="comment-user">{commentUser}</p>
        <div className="op-header">
            <p className="op-header-light">2 days ago</p>
        </div>
      </div>
      <p className="comment-body">{props.comment.body}</p>
      
      {nestedComments && nestedComments.map(comment => {
         return (<Comment key={comment._id} nested={nested + 1} comment={comment} />)
       })}
    </div>
  );
}

export default Comment;