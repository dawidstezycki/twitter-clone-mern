import React, { useEffect } from 'react';
import ProfilePreview from './ProfilePreview';
import MicropostForm from './MicropostForm';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = () => {
  const user = useSelector((state) => state.user);

  const followingUsers = useSelector((state) => {
    return state.relationships.filter((relationship) => {
      return relationship.followed.id === state.user.id;
    });
  });
  const followerUsers = useSelector((state) => {
    return state.relationships.filter((relationship) => {
      return relationship.follower.id === state.user.id;
    });
  });

  return (
    <div className="col s3">
      <ProfilePreview
        username={user.username}
        followingCount={followingUsers.length}
        followersCount={followerUsers.length}
      />
      <MicropostForm />
    </div>
  );
};
export default Sidebar;
