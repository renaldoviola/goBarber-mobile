import React, { createContext, useCallback, useEffect, useState, useContext } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

interface AuthState {
  token: string;
  user: object;
}

interface SignCredential {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  loading: boolean;
  signIn(credential: SignCredential): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet(
          ['@Gobarber:token','@Gobarber:user']
      );

      if(token[1] && user[1]){
        setData({token: token[1], user: JSON.parse(user[1]) });
      }
      setLoading(false);
    };

    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@Gobarber:token', token],
      ['@Gobarber:user', JSON.stringify(user)]
    ]);

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      '@Gobarber:token',
      '@Gobarber:user'
    ]);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
export { AuthProvider, useAuth };
