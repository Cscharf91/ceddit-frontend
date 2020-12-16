import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import Comment from './Comment';

const Post = (props) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    trackPromise(getPost());
  }, [])
  
  const getPost = async () => {
    const data = await Axios.get(`http://localhost:5000/api/posts/${props.match.params.id}`);
    setPost(data.data);
    console.log(data.data.comments);
    setComments(data.data.comments);
  }
  const commentList = comments.map((comment) => {
    return <Comment nested="0" comment={comment} />
  });

  return (
    <div className="post-wrapper">
      {post && <h3>{post.title}</h3>}
      {post && <h5>From: {post.user.username}</h5>} 
      {post && <p>{post.body}</p>}
      {post && props.user && props.user.email === post.user.email && <button onClick={() => props.deletePost(post)}>Delete</button>}
      {post && props.user && props.user.email === post.user.email && <Link to={`/edit/${post._id}`}>Edit</Link>}
      {commentList}
    </div>
  );
}

export default Post;