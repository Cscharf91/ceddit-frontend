/* eslint-disable react-hooks/exhaustive-deps */
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
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

  const [newComment, setNewComment] = useState({ body: "" })
  
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
    const data = await Axios.get(`https://sleepy-inlet-08384.herokuapp.com/api/votes/posts/${post._id}`);
    const newVotes = data.data;
    let total = 0;
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
    if (props.user) {
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
    } else {
      alert('You must be logged in to vote on comments');
    }
  }

  const handleDownvote = (e) => {
    if (props.user) {
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
    } else {
      alert('You must be logged in to vote on comments');
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
      user: props.user, vote, post: post._id
    }
    const config = {
      headers: {
        'auth-token': props.token
      }
    }
    const data = await Axios.post(`https://sleepy-inlet-08384.herokuapp.com/api/votes/`, newVote, config);
    setVoteId(data.data._id);
  }
  
  const getPost = async () => {
    const data = await Axios.get(`https://sleepy-inlet-08384.herokuapp.com/api/posts/${props.match.params.id}`);
    setPost(data.data);
    setComments(data.data.comments);
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'auth-token': props.token
      }
    }
    const comment = { ...newComment, username: props.user._id, post: e.target.className }
    const data = await Axios.post(`https://sleepy-inlet-08384.herokuapp.com/api/comments`, comment, config);
    setComments([...comments, data.data]);
    setNewComment({ body: "" });
    scrollToBottom();
  }

  const handleCommentChange = (e) => {
    setNewComment({ body: e.target.value })
  }

  const commentList = comments.map((comment) => {
    return <Comment user={props.user ? props.user : null} token={props.token} nested="0" comment={comment} />
  });

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }

  const messagesEnd = useRef("");
  

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
        <div className="comment-response-wrapper">
          {props.user && post && <form className={post._id} onSubmit={handleCommentSubmit}>
            <textarea name="body" value={newComment.body} onChange={handleCommentChange}></textarea><br/>
            <button className="post-btn" type="submit">Submit</button>
          </form>}
        </div>
        {!props.user && <div className="divider"></div>}
        {commentList}
      </div>
      <div ref={messagesEnd}></div>
    </div>
  );
}

export default Post;