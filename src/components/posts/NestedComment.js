import React from 'react';

const NestedComment = (props) => {
  const nested = parseInt(props.nested);
  const nestedComments = props.comment.children ? props.comment.children : null;
  const listNestedComments = nestedComments.forEach(comment => {
    <NestedComment nested={nested + 1} comment={comment} />
  });
  return (
    <div className="post-wrapper">
      <h3>This is a commented nested: {nested} times</h3>
      {listNestedComments}
    </div>
  );
}

export default NestedComment;