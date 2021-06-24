import { createContext, ReactElement, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { auth, firebase } from '../../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signOutGoogle: () => Promise<void>;
};

type AuthContextProps = {
  children: ReactElement | ReactElement[];
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextComponent(props: AuthContextProps) {
  const [user, setUser] = useState<User>();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((auth) => {
      handleUser(auth);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function handleUser(user: firebase.User | null) {
    if (user) {
      const { uid, displayName, photoURL } = user;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    } else {
      setUser(undefined);
      history.push('/');
    }
  }

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    if (!user) {
      await auth.signInWithPopup(provider).then((result) => {
        handleUser(result.user);
      });
    }
  }

  async function signOutGoogle() {
    await auth.signOut();
  }

  return <AuthContext.Provider value={{ user, signInWithGoogle, signOutGoogle }}>{props.children}</AuthContext.Provider>;
}
