import React from 'react'
import { useSelector } from 'react-redux';

const ProfilePreview = () => {
  const user = useSelector(state => state.user);
  return (
    <div>
      <h5>{user.username}</h5>
      <div>Followers: 50 Following: 100</div>
    </div>
  );
};
export default ProfilePreview;