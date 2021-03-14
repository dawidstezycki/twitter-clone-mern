import React from 'react'

const ProfilePreview = ({username}) => {
  return (
    <div>
      <h5>{username}</h5>
      <div>Followers: 50 Following: 100</div>
    </div>
  );
};
export default ProfilePreview;