import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './AuthSuccess.css';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');

    if (token && name) {
      localStorage.setItem('userToken', token);
      localStorage.setItem('userName', decodeURIComponent(name));
      
      // Redirect to previous page or home
      const prevPath = localStorage.getItem('prevPath') || '/';
      localStorage.removeItem('prevPath');
      navigate(prevPath);
    } else {
      navigate('/auth');
    }
  }, [searchParams, navigate]);

  return (
    <div className="auth-success">
      <div className="loading">Completing sign in...</div>
    </div>
  );
};

export default AuthSuccess;