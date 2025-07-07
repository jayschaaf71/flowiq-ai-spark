import { useContext } from 'react';
import { AuthProvider, useAuth as useAuthContext } from '@/contexts/AuthProvider';

export { AuthProvider };
export const useAuth = useAuthContext;