import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { decodeToken } from '../utils/jwtUtil';

const useAuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const path = location.pathname;

    if (!token) {
      if (path.startsWith('/admin')) {
        navigate('/login');
      }
      return;
    }

    const user = decodeToken(token);
    if (!user) {
      localStorage.removeItem('token');
      toast.error('Invalid session. Please login again.');
      navigate('/login');
      return;
    }

    if (path.startsWith('/admin') && user.isAdmin !== 'True') {
      toast.error('Admin access required');
      navigate('/search');
    }
  }, [location.pathname, navigate]);
};

export default useAuthRedirect;
