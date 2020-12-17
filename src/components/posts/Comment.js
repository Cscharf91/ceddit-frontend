import React, { useEffect, useState } from 'react';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Axios from 'axios';
import { trackPromise } from 'react-promise-tracker';

const Comment = (props) => {
  const comment = props.comment;
  const [nestedComments, setNestedComments] = useState(null);
  const [commentUser, setCommentUser] = useState(null);
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
    console.log('comment Id: ', comment._id);
    const data = await Axios.get(`http://localhost:5000/api/votes/comments/${comment._id}`);
    console.log('votes for this comment', data.data);
    const newVotes = data.data;
    let total = 1;
    // Checks if any votes are from current user. If so, store vote ID.
    newVotes.forEach(vote => {
      console.log('total:', total, 'vote:', vote.vote);
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
        console.log('updating vote')
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
        console.log('updating vote');
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
    const data = await Axios.delete(`http://localhost:5000/api/votes/${voteId}`, config);
    console.log("delete data:", data);
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
    const data = await Axios.post(`http://localhost:5000/api/votes/`, newVote, config);
    setVoteId(data.data._id);
    console.log("created vote:", data.data);
  }

  const fetchUser = async () => {
    try {
      const data = await Axios.get(`http://localhost:5000/api/users/${comment.username}`);
      setCommentUser(data.data.username);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className={`comment nested-${props.nested}`}>
      <div className="comment-vote">
        <div className="vote-grid">
          <ArrowDropUpIcon onClick={handleUpvote} className={`vote-arrow ${upvote}`} fontSize="inherit" />
          <p className="upvote-count">{votes}</p>
          <ArrowDropDownIcon onClick={handleDownvote} className={`vote-arrow row-3 ${downvote}`} fontSize="inherit" />
        </div>
        <p className="comment-user">{commentUser}</p>
      </div>
        <div className="op-header">
            <p className="op-header-light under-user">2 days ago</p>
        </div>
      <p className="comment-body">{comment.body}</p>
      
      {nestedComments && nestedComments.map(currComment => {
         return (<Comment user={props.user} token={props.token} key={comment._id} nested={nested + 1} comment={currComment} />)
       })}
    </div>
  );
}

export default Comment;