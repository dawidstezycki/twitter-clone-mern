import LoginForm from './LoginForm';

const LoginPage = ({handleLogin}) =>
{
  return (
    <div className="container">
      <LoginForm handleLogin={handleLogin} />
    </div>
  )
}

export default LoginPage