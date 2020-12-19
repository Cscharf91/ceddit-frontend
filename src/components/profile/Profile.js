import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import PostDisplay from '../posts/PostDisplay';
import Comment from './Comment';

const Profile = (props) => {
  const [currentUser, setCurrentUser] = useState({});
  const [filter, setFilter] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [])

  const fetchUser = async () => {
    const data = await Axios.get(`https://sleepy-inlet-08384.herokuapp.com/api/users/${props.match.params.id}`);
    console.log(data.data)
    setCurrentUser(data.data.user);
    setPosts(data.data.posts);
    setComments(data.data.comments);
  }

  const displayPosts = posts.map(post => <PostDisplay key={post._id} user={props.user} token={props.token} deletePost={props.deletePost} post={post} />)

  const displayComments = comments.map(comment => {
    if (comment.body !== "<deleted>") {
      return <Comment key={comment._id} user={props.user} token={props.token} comment={comment} />
    }
  });

  return (
    <div className="post-wrapper">
      <div className="create-and-profile-head">
        <h3>{currentUser.username}</h3>
        <button onClick={() => filter === "posts" ? setFilter("comments") : setFilter("posts")} className="post-btn">{filter === "posts" ? "View Comments" : "View Posts"}</button>
      </div>
      {filter === "posts" && displayPosts}
      <div className="post-content">
        {filter === "comments" && displayComments}
      </div>
    </div>
  )
}

export default Profile;