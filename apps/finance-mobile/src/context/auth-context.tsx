import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { firebaseAuth, isFirebaseConfigured } from "@/services/firebase";

const DEMO_SESSION_KEY = "@nexo/demo-session";

export type AppUser = {
  uid: string;
  email: string;
  name: string;
  isDemo: boolean;
};

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  firebaseConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  enterDemo: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): AppUser {
  return {
    uid: user.uid,
    email: user.email ?? "",
    name: user.displayName || user.email?.split("@")[0] || "Usuário",
    isDemo: false,
  };
}

function friendlyAuthError(error: unknown) {
  const code = (error as { code?: string }).code;
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já possui uma conta.",
    "auth/invalid-credential": "E-mail ou senha inválidos.",
    "auth/invalid-email": "Digite um e-mail válido.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
    "auth/weak-password": "Use uma senha com pelo menos 6 caracteres.",
  };
  return new Error(messages[code ?? ""] ?? "Não foi possível autenticar. Tente novamente.");
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    async function restoreSession() {
      const demoSession = await AsyncStorage.getItem(DEMO_SESSION_KEY);
      if (!active) return;

      if (demoSession === "active") {
        setUser({
          uid: "demo-user",
          email: "demo@nexo.app",
          name: "Marina",
          isDemo: true,
        });
        setLoading(false);
        return;
      }

      if (!firebaseAuth) {
        setLoading(false);
        return;
      }

      unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
        if (!active) return;
        setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
        setLoading(false);
      });
    }

    void restoreSession();
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!firebaseAuth) throw new Error("Configure o Firebase para entrar com uma conta real.");
    try {
      await AsyncStorage.removeItem(DEMO_SESSION_KEY);
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    } catch (error) {
      throw friendlyAuthError(error);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (!firebaseAuth) throw new Error("Configure o Firebase para criar uma conta real.");
    try {
      await AsyncStorage.removeItem(DEMO_SESSION_KEY);
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      setUser(mapFirebaseUser({ ...credential.user, displayName: name.trim() }));
    } catch (error) {
      throw friendlyAuthError(error);
    }
  }, []);

  const enterDemo = useCallback(async () => {
    await AsyncStorage.setItem(DEMO_SESSION_KEY, "active");
    setUser({
      uid: "demo-user",
      email: "demo@nexo.app",
      name: "Marina",
      isDemo: true,
    });
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(DEMO_SESSION_KEY);
    if (firebaseAuth?.currentUser) await firebaseSignOut(firebaseAuth);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      firebaseConfigured: isFirebaseConfigured,
      login,
      register,
      enterDemo,
      logout,
    }),
    [enterDemo, loading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
