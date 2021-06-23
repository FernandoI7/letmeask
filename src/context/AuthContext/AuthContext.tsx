import { createContext, ReactElement, useState, useEffect } from 'react';

import { auth, firebase } from '../../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
};

type AuthContextProps = {
  children: ReactElement | ReactElement[];
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextComponent(props: AuthContextProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      handleUser(user);
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
    }
  }

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    await auth.signInWithPopup(provider).then((result) => {
      handleUser(result.user);
    });
  }

  return <AuthContext.Provider value={{ user, signInWithGoogle }}>{props.children}</AuthContext.Provider>;
}
