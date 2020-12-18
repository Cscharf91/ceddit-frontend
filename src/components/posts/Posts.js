import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import PostDisplay from './PostDisplay';
import { InView } from 'react-intersection-observer';

const Posts = (props) => {
  document.body.style.background = "#dae0e6";
  const [zone, setZone] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;
  const indexOfLastPost = currentPage * perPage;
  const indexOfFirstPost = indexOfLastPost - perPage;
  const currentPosts = props.posts.slice(indexOfFirstPost, indexOfLastPost)

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(props.posts.length / perPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (e) => {
    setCurrentPage(Number(e.target.id));
  }

  useEffect(() => {
    trackPromise(getZone());
  }, [props.currentZone]);


  const getZone = async () => {
    if (props.currentZone !== "all") {
      const data = await Axios.get(`https://sleepy-inlet-08384.herokuapp.com/api/zones/${props.currentZone}`)
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
    return currentPosts.map(post => {
      return <PostDisplay key={post._id} user={props.user} token={props.token} deletePost={props.deletePost} post={post} />
    });
  }

  const pageNumbersList = pageNumbers.map(num => {
    return (
      <li
        key={num}
        id={num}
        onClick={handlePageClick}
        className={num === currentPage ? "current-page" : null}
      >
        {num}
      </li>
    );
  });

  return (
    <div>
      {zone &&
      <div className="post-wrapper zone-info">
          <h3>{zone.name && zone.name.charAt(0).toUpperCase() + zone.name.slice(1)}</h3>
          <h5>{zone.description && zone.description}</h5>
        <select className="select-menu" name="zone" onChange={props.changeZoneSelect} value={props.currentZone}>
        <option value="all">All</option>
        {props.zones.length > 0 && props.zones.map(zone => {
          return (<option value={zone._id}>{zone.name}</option>)
        })}
        </select>
      </div>
      }
      {postList()}
      <div className="post-wrapper page-nums">
        {pageNumbersList}
      </div>
    </div>
  );
}

export default Posts;