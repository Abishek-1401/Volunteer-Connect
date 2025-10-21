import { useContext } from 'react';
// 1. Import AuthContext, not AuthProvider
import { AuthContext } from '../context/AuthContext'; 

export const useAuth = () => {
  // 2. Pass the AuthContext object to useContext
  return useContext(AuthContext);
};