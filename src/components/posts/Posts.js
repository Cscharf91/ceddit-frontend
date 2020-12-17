import React from 'react';
import PostDisplay from './PostDisplay';

const Posts = (props) => {
  document.body.style.background = "#dae0e6";
  
  const postList = () => {
    return props.posts.map(post => {
      return <PostDisplay key={post._id} user={props.user} token={props.token} deletePost={props.deletePost} post={post} />
    });
  }

  return (
    <div>
      <h1>All Posts:</h1>
      {postList()}
    </div>
  );
}

export default Posts;