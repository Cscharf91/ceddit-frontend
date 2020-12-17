import Axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { trackPromise } from 'react-promise-tracker';
import NavBar from "./components/NavBar";
import Posts from "./components/posts/Posts";
import CreatePost from "./components/posts/CreatePost";
import EditPost from "./components/posts/EditPost";
import Post from "./components/posts/Post";

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "", zone: "5fda628d85f4ed0d156d3839" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [token, setToken] = useState(null);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [zones, setZones] = useState([]);

  useEffect(() => {
    trackPromise(getPosts());
    trackPromise(getZones());
    const currentUser = localStorage.getItem('user');
    const currentToken = localStorage.getItem('token');
    if (currentUser) setUser(JSON.parse(currentUser));
    if (currentToken) setToken(currentToken);
  }, [])

  const getZones = async () => {
    try {
      const data = await Axios.get('http://localhost:5000/api/zones');
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
      const data = await Axios.get('http://localhost:5000/api/posts');
      setPosts(data.data);
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
       console.log("selectedFile", selectedFile);
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
        const data = await Axios.post('http://localhost:5000/api/posts', formData, config)
        console.log(data);
        window.location = '/';
      } catch(err) {
        console.log("err", err);
      }
    } else {
      console.log('no selected file');
      try {
        const config = {
          headers: {
            'auth-token': token
          }
        }
        const data = await Axios.post('http://localhost:5000/api/posts/', { title: newPost.title, body: newPost.body, zone: newPost.zone, user }, config);
        console.log(data);
        window.location = '/';
      } catch(err) {
        console.log(err);
      }
    }
  }

  // const uploadImage = async (base64EncodedImage) => {
  //   try {
  //     const config = {
  //       headers: {
  //         'auth-token': token,
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //     const data = await Axios.post('http://localhost:5000/api/posts/', { ...newPost, image: JSON.stringify(base64EncodedImage), user }, config);
  //     console.log(data);
  //     window.location = '/';
  //   } catch (err) {
  //       console.error(err);
  //   }
  // }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await Axios.post('http://localhost:5000/api/users/login', login);
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
    console.log(login, e.target.name, e.target.value);
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
    console.log(e.target.name, e.target.value);
    console.log(newPost);
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
    const data = await Axios.delete(`http://localhost:5000/api/posts/${post._id}`, config);
    console.log(data);
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
          posts={posts}
        />
      }
      />
      <Route path="/create" exact
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
      </Switch>
    </Router>
  );
}

export default App;