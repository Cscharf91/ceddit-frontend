/* eslint-disable react-hooks/exhaustive-deps */
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
  
  const [votes, setVotes] = useState(0);
  const [voteId, setVoteId] = useState('');
  const [upvote, setUpvote] = useState('');
  const [downvote, setDownvote] = useState('');

  useEffect(() => {
    trackPromise(getPost());
  }, [])

  useEffect(() => {
    trackPromise(getVotes());
  }, [post])

  const getVotes = async () => {
    const data = await Axios.get(`http://localhost:5000/api/votes/posts/${post._id}`);
    console.log('data for this post', data);
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
      user: props.user, vote, post: post._id
    }
    const config = {
      headers: {
        'auth-token': props.token
      }
    }
    const data = await Axios.post(`http://localhost:5000/api/votes/`, newVote, config);
    setVoteId(data.data._id);
    console.log(data);
  }
  
  const getPost = async () => {
    const data = await Axios.get(`http://localhost:5000/api/posts/${props.match.params.id}`);
    console.log("post data:", data.data);
    setPost(data.data);
    setComments(data.data.comments);
  }
  const commentList = comments.map((comment) => {
    return <Comment user={props.user} token={props.token} nested="0" comment={comment} />
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
            <div className="comment-vote">
              <div className="vote-grid">
                <ArrowDropUpIcon onClick={handleUpvote} className={`vote-arrow ${upvote}`} fontSize="inherit" />
                <p className="upvote-count">{votes}</p>
                <ArrowDropDownIcon onClick={handleDownvote} className={`vote-arrow row-3 ${downvote}`} fontSize="inherit" />
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