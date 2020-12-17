import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';

const CreatePost = (props) => {
  document.body.style.background = "#dae0e6";

  useEffect(() => {
    trackPromise(props.getZones());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("here's the zones dude", props.zones);
  }, [props.zones]);

  if (props.user) {
      return (
        <div className="post-wrapper">
          <form onSubmit={props.handlePostSubmit} className="post-form">
            <br/><label>Title:</label>
            <input type="text" name="title" value={props.newPost.title} onChange={props.onChangePost} /><br/><br/>
            <select name="zone" onChange={props.onChangePost} value={props.newPost.zone}>
              {props.zones.length > 0 && props.zones.map(zone => {
                return (<option value={zone._id}>{zone.name}</option>)
              })}
            </select>
            <input 
              type="file"
              name="image"
              onChange={props.handleFileInputChange}
              value={props.newPost.image} /><br />
            <label>Body:</label>
            <textarea name="body" value={props.newPost.body} onChange={props.onChangePost} /><br/><br/>
            <button>Submit Post</button>
          </form>
        </div>
    );
  } else {
    return (
      <div>You need to be logged in.</div>
    )
  }
}

export default CreatePost;