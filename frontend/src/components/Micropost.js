import React from 'react';
import { Link } from 'react-router-dom';

const Micropost = ({ micropost }) => {
  return (
    <div>
      <h5>
        <Link className="black-text" to={`/users/${micropost.user.id}`}>
          {micropost.user.username}
        </Link>
      </h5>
      <p>{micropost.content}</p>
    </div>
  );
};

export default Micropost;
