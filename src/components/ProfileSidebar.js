import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addRelationship,
  deleteRelationship,
} from '../reducers/relationshipReducer';
import {
  addViewedUserRelationship,
  deleteViewedUserRelationship,
} from '../reducers/viewedUserRelationshipReducer';

import ProfilePreview from './ProfilePreview';

const ProfileSidebar = () => {
  const dispatch = useDispatch();

  const viewedUser = useSelector((state) => state.viewedUser);
  const user = useSelector((state) => state.user);

  const relationshipWithViewedUser = useSelector((state) => {
    return state.relationships.find(
      (relationship) => relationship.followed.id === state.viewedUser.id
    );
  });

  const followingUsers = useSelector((state) => {
    return state.viewedUserRelationships.filter((relationship) => {
      return relationship.followed.id === state.viewedUser.id;
    });
  });
  const followerUsers = useSelector((state) => {
    return state.viewedUserRelationships.filter((relationship) => {
      return relationship.follower.id === state.viewedUser.id;
    });
  });

  const isViewedUserSameAsLogged = () => {
    return viewedUser.id === user.id;
  };

  const addRelationshipToBothUsers = (viewedUser, user) => {
    return async (dispatch) => {
      dispatch(addViewedUserRelationship(user, viewedUser));
      dispatch(addRelationship(viewedUser.id));
    };
  };

  const deleteRelationshipFromBothUsers = (
    relationshipWithViewedUser,
    user
  ) => {
    return async (dispatch) => {
      dispatch(deleteViewedUserRelationship(user));
      dispatch(deleteRelationship(relationshipWithViewedUser.id));
    };
  };

  const handleFollowClick = () => {
    dispatch(addRelationshipToBothUsers(viewedUser, user));
  };

  const handleUnfollowClick = () => {
    dispatch(deleteRelationshipFromBothUsers(relationshipWithViewedUser, user));
  };

  const followButton = () => {
    if (!relationshipWithViewedUser) {
      return (
        <div className="btn" onClick={handleFollowClick}>
          Follow
        </div>
      );
    } else {
      return (
        <div className="btn red" onClick={handleUnfollowClick}>
          Unfollow
        </div>
      );
    }
  };

  return (
    <div className="col s3">
      {followingUsers && followerUsers && <ProfilePreview
        username={viewedUser.username}
        followingCount={followingUsers.length}
        followersCount={followerUsers.length}
      />}
      {!isViewedUserSameAsLogged() && followButton()}
    </div>
  );
};
export default ProfileSidebar;
