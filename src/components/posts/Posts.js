import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import PostDisplay from './PostDisplay';

const Posts = (props) => {
  document.body.style.background = "#dae0e6";
  const [zone, setZone] = useState({});

  useEffect(() => {
    trackPromise(getZone());
  }, [props.currentZone]);

  const getZone = async () => {
    if (props.currentZone !== "all") {
      const data = await Axios.get(`http://localhost:5000/api/zones/${props.currentZone}`)
      setZone(data.data);
    } else {
      setZone({
        name: "All",
        creator: "Cory S",
        description: "The best posts from all of Creddit"
      })
    }
  }

  const postList = () => {
    return props.posts.map(post => {
      return <PostDisplay key={post._id} user={props.user} token={props.token} deletePost={props.deletePost} post={post} />
    });
  }

  return (
    <div>
      {zone &&
      <div className="post-wrapper zone-info">
          <h3>{zone.name && zone.name.charAt(0).toUpperCase() + zone.name.slice(1)}</h3>
          <h5>{zone.description && zone.description}</h5>
      </div>
      }
      {postList()}
    </div>
  );
}

export default Posts;