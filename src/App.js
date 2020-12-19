import Axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { trackPromise } from 'react-promise-tracker';
import NavBar from "./components/NavBar";
import Posts from "./components/posts/Posts";
import CreatePost from "./components/posts/CreatePost";
import EditPost from "./components/posts/EditPost";
import Post from "./components/posts/Post";
import CreateZone from "./components/zones/CreateZone";
import Profile from "./components/profile/Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "", zone: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [token, setToken] = useState(null);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [zones, setZones] = useState([]);
  const [currentZone, setCurrentZone] = useState('all');

  useEffect(() => {
    trackPromise(getPosts());
    trackPromise(getZones());
    const currentUser = localStorage.getItem('user');
    const currentToken = localStorage.getItem('token');
    if (currentUser) setUser(JSON.parse(currentUser));
    if (currentToken) setToken(currentToken);
  }, [])

  const changeZoneSelect = async (e) => {
    setCurrentZone(e.target.value);
    const currentPosts = [];
    if (e.target.value !== "all") {
      posts.forEach(post => {
        if (post.zone._id === e.target.value) {
          currentPosts.push(post);
        }
      });
      setCurrentPosts(currentPosts);
    } else {
      setCurrentPosts(posts);
    }
  }

  const getZones = async () => {
    try {
      const data = await Axios.get('https://sleepy-inlet-08384.herokuapp.com/api/zones');
      const allZones = data.data;
      setZones([]);
      const newZones = [];
      allZones.forEach(zone => {
        newZones.push(zone);
      })
      setZones(newZones);
    } catch (err) {
      
    }    
  }

  const getPosts = async () => {
    try {
      const data = await Axios.get('https://sleepy-inlet-08384.herokuapp.com/api/posts');
      setPosts(data.data);
      setCurrentPosts(data.data);
    } catch(err) {
      console.log(err);
    }
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    //Check for image upload- if so add to axios POST, if not submit plain text
    if (selectedFile) {
       // Create an object of formData 
       const formData = new FormData(); 
     
       // Update the formData object 
       formData.append( "image", selectedFile);
       formData.append( "user", JSON.stringify(user._id).slice(1, -1));
       formData.append( "zone", JSON.stringify(newPost.zone).slice(1, -1));
       formData.append( "title", JSON.stringify(newPost.title).slice(1, -1));
       formData.append( "body", JSON.stringify(newPost.body).slice(1, -1));

       try {
        const config = {
          headers: {
            'auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        }
        const data = await Axios.post('https://sleepy-inlet-08384.herokuapp.com/api/posts', formData, config)
        window.location = `/${data.data._id}`;
      } catch(err) {
        console.log("err", err);
      }
    } else {
      try {
        const config = {
          headers: {
            'auth-token': token
          }
        }
        await Axios.post('https://sleepy-inlet-08384.herokuapp.com/api/posts/', { title: newPost.title, body: newPost.body, zone: newPost.zone, user }, config);
        window.location = '/';
      } catch(err) {
        console.log(err);
      }
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await Axios.post('https://sleepy-inlet-08384.herokuapp.com/api/users/login', login);
      const currentUser = data.data.user;
      const currentToken = data.data.token;
      setUser(currentUser);
      setToken(currentToken);
      localStorage.setItem('user', JSON.stringify(currentUser));
      localStorage.setItem('token', currentToken);
    } catch(err) {
      console.log(err);
    }
  }

  const onChangeLogin = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    });
  }

  const onChangePost = (e) => {
    setNewPost({
      ...newPost,
      [e.target.name]: e.target.value
    });
  }

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const logOut = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  }

  const deletePost = async (post) => {
    const config = {
      headers: {
        'auth-token': token
      }
    }
    const data = await Axios.delete(`https://sleepy-inlet-08384.herokuapp.com/api/posts/${post._id}`, config);
    setPosts(posts.filter(current => current._id !== post._id))
    window.location ='/';
  }

  return (
    <Router>
      <NavBar 
        login={login}
        logOut={logOut}
        user={user}
        token={token}
        setUser={setUser}
        setToken={setToken}
        handleLoginSubmit={handleLoginSubmit}
        onChangeLogin={onChangeLogin}
      />
      <Switch>
      <Route path="/" exact
        render={props => <Posts {...props}
          user={user}
          token={token}
          deletePost={deletePost}
          currentZone={currentZone}
          posts={currentPosts}
          zones={zones}
          changeZoneSelect={changeZoneSelect}
        />
      }
      />
      <Route path="/posts/create" exact
        render={props => <CreatePost {...props}
          handlePostSubmit={handlePostSubmit}
          onChangePost={onChangePost}
          user={user}
          newPost={newPost}
          handleFileInputChange={handleFileInputChange}
          zones={zones}
          getZones={getZones}
        />
      }
      />
      <Route path="/zones/create" exact
        render={props => <CreateZone {...props}
          user={user}
          token={token}
          setCurrentZone={setCurrentZone}
        />
      }
      />
      <Route path="/:id" exact
        render={props => <Post {...props}
          user={user}
          token={token}
          deletePost={deletePost}
        />
      }
      />
      <Route path="/edit/:id" exact
        render={props => <EditPost {...props}
          token={token}
        />
      }
      />
      <Route path="/users/:id" exact
        render={props => <Profile {...props}
        user={user}
        token={token}
      />
      }
      />
      </Switch>
    </Router>
  );
}

export default App;