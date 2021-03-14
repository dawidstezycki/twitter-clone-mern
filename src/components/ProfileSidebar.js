import React from 'react'
import ProfilePreview from './ProfilePreview'

const ProfileSidebar = ({username}) => {
  return (
    <div className="col s3">
      <ProfilePreview username={username}/>
    </div>
  );
};
export default ProfileSidebar;