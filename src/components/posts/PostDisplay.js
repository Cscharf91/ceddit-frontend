import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import moment from 'moment';
import Axios from "axios";
import { trackPromise } from 'react-promise-tracker';

const PostDisplay = (props) => {
  const post = props.post;
  const [votes, setVotes] = useState(0);
  const [voteId, setVoteId] = useState('');
  const [upvote, setUpvote] = useState('');
  const [downvote, setDownvote] = useState('');

  useEffect(() => {
    trackPromise(getVotes());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getVotes = async () => {
    const data = await Axios.get(`http://localhost:5000/api/votes/posts/${post._id}`);
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
    const data = await Axios.delete(`http://localhost:5000/api/votes/${voteId}`, config);
  }

  const addVote = async (vote) => {
    const newVote = {
      user: props.user, vote, post: post._id
    }
    const config = {
      headers: {
        'auth-token': props.token
      }
    }
    const data = await Axios.post(`http://localhost:5000/api/votes/`, newVote, config);
    setVoteId(data.data._id);
  }

  return (
    <div className="post-wrapper">
      <div className="post-op">
        <div className="op-header">
          <p className="sub-label">c/{post.zone ? post.zone.name : null}</p>
          {post && <p className="op-header-light">Posted by {post.user.username}</p>} 
          <p className="op-header-light">{moment(post.date).format('MMMM Do YYYY')}</p>
        </div>
        <div className="comment-vote">
          <div className="vote-grid">
            <ArrowDropUpIcon onClick={handleUpvote} className={`vote-arrow ${upvote}`} fontSize="inherit" />
            <p className="upvote-count">{votes}</p>
            <ArrowDropDownIcon onClick={handleDownvote} className={`vote-arrow row-3 ${downvote}`} fontSize="inherit" />
          </div>
          <h3 className="comment-user"><Link to={`/${post._id}`}>{post.title}</Link></h3>
        </div>
        {post && post.image && <Link to={`/${post._id}`}><img src={post.image} alt={`${post.title}`} className="post-image" /></Link>}
        <br/><Link to={`/${post._id}`}><button className="post-btn">Comments</button></Link>
      </div>        
    </div>
  );
}

export default PostDisplay;