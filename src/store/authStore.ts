import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signUp: async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('¡Cuenta creada exitosamente!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  signIn: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('¡Bienvenido de vuelta!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('¡Bienvenido!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('¡Hasta pronto!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  initialize: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },
}));