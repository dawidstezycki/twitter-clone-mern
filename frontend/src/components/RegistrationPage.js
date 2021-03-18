import RegistrationForm from './RegistrationForm';
import userService from '../services/users';
import { useHistory } from 'react-router-dom';

const RegistrationPage = () =>
{
  const history = useHistory();

  const handleRegistration = async (event) =>
  {
    event.preventDefault();
    try {
      await userService.createUser({
        username: event.target.username.value,
        password: event.target.password.value,
        email: event.target.email.value
      });

      history.push('/');
    } catch (exception) {}
  }

  return (
    <div className="container">
      <RegistrationForm handleRegistration={handleRegistration} />
    </div>
  )
}

export default RegistrationPage