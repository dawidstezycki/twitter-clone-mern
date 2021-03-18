import React from 'react';
import ProfilePreview from './ProfilePreview';
import MicropostForm from './MicropostForm';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const loggedUser = useSelector((state) => state.loggedUser);

  const followingUsers = useSelector((state) => {
    return state.loggedUserRelationships.filter((relationship) => {
      return relationship.followed.id === state.loggedUser.id;
    });
  });
  const followerUsers = useSelector((state) => {
    return state.loggedUserRelationships.filter((relationship) => {
      return relationship.follower.id === state.loggedUser.id;
    });
  });

  return (
    <div className="col s3">
      <ProfilePreview
        username={loggedUser.username}
        followingCount={followingUsers.length}
        followersCount={followerUsers.length}
      />
      <MicropostForm />
    </div>
  );
};
export default Sidebar;
