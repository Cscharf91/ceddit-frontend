import React from 'react';

const CreatePost = (props) => {
  document.body.style.background = "#dae0e6";

  if (props.user) {
      return (
      <form onSubmit={props.handlePostSubmit} className="post-form">
        <br/><label>Title:</label>
        <input type="text" name="title" value={props.newPost.title} onChange={props.onChangePost} /><br/><br/>
        <label>Body:</label>
        <textarea name="body" value={props.newPost.body} onChange={props.onChangePost} /><br/><br/>
        <button>Submit Post</button>
      </form>
    );
  } else {
    return (
      <div>You need to be logged in.</div>
    )
  }
}

export default CreatePost;