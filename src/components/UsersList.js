import React from 'react';
import { Link } from 'react-router-dom';

const UserItem = ({ user }) => {
  return (
    <h5>
      <Link className="black-text" to={`/users/${user.id}`}>
        {user.username}
      </Link>
    </h5>
  );
};

const UsersList = ({ users }) => {
  return (
    <div className="col s9">
      <div className="section">
        <h4>Users</h4>
      </div>
      <div>
        {users.map((user) => (
          <div key={user.id}>
            <div className="divider"></div>
            <UserItem user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default UsersList;
