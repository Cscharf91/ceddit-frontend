import Axios from 'axios';
import React, { useEffect, useState } from 'react';

const CreateZone = (props) => {
  document.body.style.background = "#dae0e6";
  const [newZone, setNewZone] = useState({ name: "", description: "" })

  const onChange = (e) => {
    setNewZone({
      ...newZone,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'auth-token': props.token
      }
    }

    try {
      await Axios.post(`https://sleepy-inlet-08384.herokuapp.com/api/zones`, { ...newZone, creator: props.user._id }, config);
      window.location = '/';
    } catch (error) {
      console.log(error);
    }
  }

  if (props.user) {
      return (
        <div className="post-wrapper ">
          <div className="create-and-profile-head">
            <h3>Create Zone</h3>
          </div>
          <form onSubmit={handleSubmit} className="post-form">
            <label>Name:</label><br/>
            <input className="create-title" type="text" name="name" value={newZone.name} onChange={onChange} /><br/><br/>
            <label>Description:</label><br/>
            <input className="create-title" type="text" name="description" value={newZone.description} onChange={onChange} /><br/><br/>
            <button>Submit Post</button>
          </form>
        </div>
    );
  } else {
    return (
      <div className="post-wrapper">You need to be logged in.</div>
    )
  }
}

export default CreateZone;