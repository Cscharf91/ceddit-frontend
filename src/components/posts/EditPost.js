import Axios from 'axios';
import React, { useEffect, useState } from 'react';

const EditPost = (props) => {
  document.body.style.background = "#dae0e6";
  const [editedPost, setEditedPost] = useState({ title: "", body: "" });

  useEffect(() => {
    getPostData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPostData = async () => {
    try {
      const data = await Axios.get(`https://sleepy-inlet-08384.herokuapp.com/api/posts/${props.match.params.id}`);
      setEditedPost({ title: data.data.title, body: data.data.body })
    } catch(err) {
      console.log(err);
    }
    
  }

  const handlePostEdit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'auth-token': props.token
        }
      }
      const data = await Axios.patch(`https://sleepy-inlet-08384.herokuapp.com/api/posts/${props.match.params.id}`, { ...editedPost }, config);
      console.log(data);
      window.location = '/';
    } catch(err) {
      console.log(err);
    }
  }

  const onChangeEdit = (e) => {
    setEditedPost({
      ...editedPost,
      [e.target.name]: e.target.value
    });
  }


  return (
    <div className="post-wrapper">
      <form onSubmit={handlePostEdit} className="post-form">
        <br/><label>Title:</label>
        <input type="text" name="title" value={editedPost.title} onChange={onChangeEdit} /><br/><br/>
        <label>Body:</label>
        <textarea name="body" value={editedPost.body} onChange={onChangeEdit} /><br/><br/>
        <button>Submit Post</button>
      </form>
    </div>
  );
}

export default EditPost;