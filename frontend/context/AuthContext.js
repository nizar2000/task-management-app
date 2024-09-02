"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useMutation } from '@apollo/client';
import { REGISTER_SOCIAL_MUTATION, UPDATE_USER } from '@/graphql/mutations';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [registerOAuth] = useMutation(REGISTER_SOCIAL_MUTATION);
  const [updateUserMutation] = useMutation(UPDATE_USER);

  const setUserState = (user, authenticated) => {
    setUser(user);
    setAuthenticated(authenticated);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authenticated', authenticated.toString());
  };

  useEffect(() => {
    // Initialize state from localStorage
    const storedUser = localStorage.getItem('user');
    const storedAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (storedUser && storedAuthenticated) {
      setUser(JSON.parse(storedUser));
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const updateUserState = async () => {
      if (status === 'loading') {
        setLoading(true);
        return;
      }
  
      if (session) {
        try {
          const { provider, accessToken } = session;
          const { data } = await registerOAuth({
            variables: { provider, token: accessToken },
          });
          setUserState(data.RegisterSocial.user, true);
        } catch (error) {
          console.error('Error registering user:', error);
          setUserState(null, false);
        }
      } else {
        const storedAuthenticated = localStorage.getItem('authenticated') === 'true';
        if (!storedAuthenticated) {
          setUserState(null, false);
        }
      }
      setLoading(false); // Ensure this is reached after operations
    };
  
    updateUserState();
  }, [session, status, registerOAuth]);
  

  const login = (token, user) => {
    localStorage.setItem('token', token);
    setUserState(user, true);
    router.push('/dashboard');
  };

  const logout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem('token');
    setUserState(null, false);
    router.push('/Auth/login');
  };

  const updateUser = async (userData) => {
    try {
      const { data } = await updateUserMutation({
        variables: { ...userData, id: user.id },
      });
      setUser(data.updateUser); // Update the user state with the new data
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, authenticated, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
