import React, { useEffect, useState } from 'react';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Axios from 'axios';
import { trackPromise } from 'react-promise-tracker';

const Comment = (props) => {
  const comment = props.comment;
  const [commentBody, setCommentBody] = useState(comment.body);
  const [nestedComments, setNestedComments] = useState(null);
  const [commentUser, setCommentUser] = useState(null);
  const [newComment, setNewComment] = useState({ body: "" });
  const [activeComment, setActiveComment] = useState(false);
  const nested = parseInt(props.nested);
  const [votes, setVotes] = useState(0);
  const [voteId, setVoteId] = useState('');
  const [upvote, setUpvote] = useState('');
  const [downvote, setDownvote] = useState('');

  useEffect(() => {
    fetchUser();
    const listComm = comment.children.length > 0 ? [...comment.children] : null;
    if (listComm) {
      setNestedComments(listComm);
    }
    trackPromise(getVotes());
  }, []);

  const getVotes = async () => {
    const data = await Axios.get(`https://sleepy-inlet-08384.herokuapp.com/api/votes/comments/${comment._id}`);
    const newVotes = data.data;
    let total = 1;
    // Checks if any votes are from current user. If so, store vote ID.
    newVotes.forEach(vote => {
      if (props.user && vote.user === props.user._id) {
        setVoteId(vote._id);
        vote.vote > 0 ? setUpvote('voted') : setDownvote('voted');
      }
      total += vote.vote;
    })
    setVotes(total);
  }

  const handleUpvote = (e) => {
    if (upvote === 'voted') {
      setUpvote('')
      removeVote();
      setVotes(votes - 1);
    } else {
      setUpvote('voted')
      if (downvote === 'voted') {
        setDownvote('');
        removeVote();
        setVotes(votes + 2);
      } else {
        setVotes(votes + 1);
      }
      addVote(1);
    }
  }

  const handleDownvote = (e) => {
    if (downvote === 'voted') {
      setDownvote('')
      removeVote();
      setVotes(votes + 1);
    } else {
      setDownvote('voted')
      if (upvote === 'voted') {
        setUpvote('');
        removeVote();
        setVotes(votes - 2);
      } else {
        setVotes(votes - 1);
      }
      addVote(-1);
    }
  }

  const removeVote = async () => {
    const config = {
      headers: {
        'auth-token': props.token
      }
    }
    await Axios.delete(`https://sleepy-inlet-08384.herokuapp.com/api/votes/${voteId}`, config);
  }

  const addVote = async (vote) => {
    const newVote = {
      user: props.user, vote, comment: comment._id
    }
    const config = {
      headers: {
        'auth-token': props.token
      }
    }
    const data = await Axios.post(`https://sleepy-inlet-08384.herokuapp.com/api/votes/`, newVote, config);
    setVoteId(data.data._id);
  }

  const fetchUser = async () => {
    try {
      const data = await Axios.get(`https://sleepy-inlet-08384.herokuapp.com/api/users/${comment.username}`);
      setCommentUser(data.data.username);
    } catch(err) {
      console.log(err);
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'auth-token': props.token
      }
    }
    const comment = { ...newComment, username: props.user._id, parent: e.target.className }
    const data = await Axios.post(`https://sleepy-inlet-08384.herokuapp.com/api/comments`, comment, config);
    // setComments([...comments, data.data]);
    setNewComment({ body: "" });
    // scrollToBottom();
  }

  const handleCommentChange = (e) => {
    setNewComment({ body: e.target.value })
  }

  const activateComment = () => {
    setActiveComment(true);
  }

  const deactivateComment = () => {
    setActiveComment(false);
  }

  const deleteComment = async () => {
    const config = {
      headers: {
        'auth-token': props.token
      }
    }
    const deletedComment = {
      body: "<deleted>"
    }
    const data = await Axios.patch(`https://sleepy-inlet-08384.herokuapp.com/api/comments/${comment._id}`, deletedComment, config)
    console.log(data);
    setCommentBody("<deleted>");
    console.log(comment.body);
  }

  return (
    <div className={`comment nested-${props.nested}`}>
      {commentBody !== "<deleted>" &&
      <div className="comment-vote">
        <div className="vote-grid">
          <ArrowDropUpIcon onClick={handleUpvote} className={`vote-arrow ${upvote}`} fontSize="inherit" />
          <p className="upvote-count">{votes}</p>
          <ArrowDropDownIcon onClick={handleDownvote} className={`vote-arrow row-3 ${downvote}`} fontSize="inherit" />
        </div>
        <p className="comment-user">{commentUser}</p>
      </div>
      }
      {commentBody !== "<deleted>" && 
        <div className="op-header">
            <p className="op-header-light under-user">2 days ago</p>
        </div>
      }
      <p className="comment-body">{commentBody}</p>
      <div className="comment-response-wrapper">
        {props.user && activeComment && nested < 7 && <form className={comment._id} onSubmit={handleCommentSubmit}>
          <textarea name="body" value={newComment.body} onChange={handleCommentChange}></textarea><br/>
          <button className="post-btn" type="submit">Submit</button>
          <button onClick={deactivateComment} className="post-btn">Cancel</button>
        </form>}
      </div>
      <div className="comment-actions-grid">
        {commentUser === props.user.username && commentBody !== "<deleted>" &&
          <button onClick={deleteComment} className="post-btn">Delete</button>
        }
        {props.user && !activeComment && commentBody !== "<deleted>" &&
          <button onClick={activateComment} className="post-btn">Reply</button>
        }
        </div>
      
      {nestedComments && nestedComments.map(currComment => {
         return (<Comment user={props.user} token={props.token} nested={nested + 1} comment={currComment} />)
       })}
    </div>
  );
}

export default Comment;