import React from 'react'

const ProfilePreview = ({username, followingCount, followersCount}) => {
  return (
    <div>
      <h5>{username}</h5>
      <div>Followers: {followersCount}</div>
      <div>Following: {followingCount}</div>
    </div>
  );
};
export default ProfilePreview;