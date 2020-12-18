import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';

const CreatePost = (props) => {
  document.body.style.background = "#dae0e6";

  useEffect(() => {
    trackPromise(props.getZones());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (props.user) {
      return (
        <div className="post-wrapper">
          <form onSubmit={props.handlePostSubmit} className="post-form">
            <label>Title:</label><br/>
            <input className="create-title" type="text" name="title" value={props.newPost.title} onChange={props.onChangePost} /><br/><br/>
            <label>Zone:</label><br/>
            <select className="create-select" name="zone" onChange={props.onChangePost} value={props.newPost.zone}>
              {props.zones.length > 0 && props.zones.map(zone => {
                return (<option value={zone._id}>{zone.name}</option>)
              })}
            </select><br/><br/>
            <label>Image (optional):</label><br/>
            <input 
              type="file"
              name="image"
              onChange={props.handleFileInputChange}
              value={props.newPost.image} /><br/><br/>
            <label>Body:</label><br />
            <textarea placeholder="What's on your mind?" className="create-txtarea" name="body" value={props.newPost.body} onChange={props.onChangePost} /><br/><br/>
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