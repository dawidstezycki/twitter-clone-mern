import React, { useEffect, useState } from 'react';
import MicropostFeed from './MicropostFeed';
import ProfileSidebar from './ProfileSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setViewedUser,
  setViewedUserToNull,
} from '../reducers/viewedUserReducer';
import {
  getViewedUserRelationships,
  setViewedUserRelationshipsToNull,
} from '../reducers/viewedUserRelationshipReducer';

const ProfilePage = () => {
  const viewedUserId = useParams().id;

  const dispatch = useDispatch();
  const viewedUser = useSelector((state) => state.viewedUser);
  const viewedUserRelationships = useSelector(
    (state) => state.viewedUserRelationships
  );

  useEffect(() => {
    dispatch(setViewedUser(viewedUserId));

    return () => {
      dispatch(setViewedUserToNull());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getViewedUserRelationships(viewedUserId));
    return () => {
      dispatch(setViewedUserRelationshipsToNull());
    };
  }, [dispatch]);

  return (
    viewedUser && (
      <div className="container">
        {viewedUserRelationships && (
          <div className="row">
            <ProfileSidebar />
            <MicropostFeed microposts={viewedUser.microposts} />
          </div>
        )}
      </div>
    )
  );
};

export default ProfilePage;
