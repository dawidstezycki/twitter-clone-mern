import React, { useEffect } from 'react';
import UsersList from './UsersList';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../reducers/usersReducer'

const UsersPage = () => {
  const dispatch = useDispatch()
  const users = useSelector((state)=>state.users)
  
  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch]);

  return (
   (
      <div className="container">
        <div className="row">
          <Sidebar />
          <UsersList users={users}/>
        </div>
      </div>
    )
  );
};

export default UsersPage;
