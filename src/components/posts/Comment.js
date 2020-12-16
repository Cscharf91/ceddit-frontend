import React, { useEffect, useState } from 'react';
import NestedComment from './NestedComment';

const Comment = (props) => {
  const [nestedComments, setNestedComments] = useState(null);
  const nested = parseInt(props.nested);

  useEffect(() => {
    const listComm = props.comment.children.length > 0 ? [...props.comment.children] : null;
    if (listComm) {
      console.log("nested comments: ", listComm);
      setNestedComments(listComm);
    }
    
  }, []);

  return (
    <div className="post-wrapper">
      <h3>This is a commented nested: {nested} times</h3>
      
      {nestedComments && nestedComments.map(comment => {
         return (<NestedComment nested={nested + 1} comment={comment} />)
       })}
    </div>
  );
}

export default Comment;