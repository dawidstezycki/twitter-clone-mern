import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addLoggedUserRelationship,
  deleteLoggedUserRelationship,
} from '../reducers/loggedUserRelationshipReducer';
import {
  addViewedUserRelationship,
  deleteViewedUserRelationship,
} from '../reducers/viewedUserRelationshipReducer';

import ProfilePreview from './ProfilePreview';

const ProfileSidebar = () => {
  const dispatch = useDispatch();

  const viewedUser = useSelector((state) => state.viewedUser);
  const loggedUser = useSelector((state) => state.loggedUser);

  const relationshipWithViewedUser = useSelector((state) => {
    if (state.loggedUserRelationships){
      return state.loggedUserRelationships.find(
        (relationship) => relationship.followed.id === state.viewedUser.id
      );
    } else {
      return null
    }
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
    return viewedUser.id === loggedUser.id;
  };

  const addLoggedUserRelationshipToBothUsers = (viewedUser, loggedUser) => {
    return async (dispatch) => {
      dispatch(addViewedUserRelationship(loggedUser, viewedUser));
      dispatch(addLoggedUserRelationship(viewedUser.id));
    };
  };

  const deleteLoggedUserRelationshipFromBothUsers = (
    relationshipWithViewedUser,
    loggedUser
  ) => {
    return async (dispatch) => {
      dispatch(deleteViewedUserRelationship(loggedUser));
      dispatch(deleteLoggedUserRelationship(relationshipWithViewedUser.id));
    };
  };

  const handleFollowClick = () => {
    dispatch(addLoggedUserRelationshipToBothUsers(viewedUser, loggedUser));
  };

  const handleUnfollowClick = () => {
    dispatch(deleteLoggedUserRelationshipFromBothUsers(relationshipWithViewedUser, loggedUser));
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
      <ProfilePreview
        username={viewedUser.username}
        followingCount={followingUsers.length}
        followersCount={followerUsers.length}
      />
      {!isViewedUserSameAsLogged() && followButton()}
    </div>
  );
};
export default ProfileSidebar;
