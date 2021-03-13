import React from 'react'

const Micropost = ({micropost}) => {
  return (
    <div>
      <h5>{micropost.user.username}</h5>
      <p>{micropost.content}</p>
    </div>
  );
};

export default Micropost;