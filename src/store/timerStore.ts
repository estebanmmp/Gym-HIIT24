import { create } from 'zustand';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

export interface Timer {
  name: string;
  duration: number;
  minutes: number;
  seconds: number;
}

export interface Routine {
  id?: string;
  userId: string;
  name: string;
  cycles: number;
  timers: Timer[];
}

interface TimerStore {
  currentTimers: Timer[];
  routines: Routine[];
  activeRoutine: Routine | null;
  activeTimerIndex: number;
  remainingTime: number;
  remainingCycles: number;
  isPaused: boolean;
  editingRoutine: Routine | null;
  editingTimerIndex: number | null;
  addTimer: (timer: Timer) => void;
  updateTimer: (index: number, timer: Timer) => void;
  removeTimer: (index: number) => void;
  clearTimers: () => void;
  saveRoutine: (routine: Omit<Routine, 'userId'>) => Promise<void>;
  updateRoutine: (routineId: string, routine: Omit<Routine, 'userId' | 'id'>) => Promise<void>;
  deleteRoutine: (routineId: string) => Promise<void>;
  loadRoutines: () => Promise<void>;
  startRoutine: (routine: Routine) => void;
  setActiveTimerIndex: (index: number) => void;
  setRemainingTime: (time: number) => void;
  setRemainingCycles: (cycles: number) => void;
  togglePause: () => void;
  resetActive: () => void;
  setEditingRoutine: (routine: Routine | null) => void;
  setEditingTimerIndex: (index: number | null) => void;
  setCurrentTimers: (timers: Timer[]) => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  currentTimers: [],
  routines: [],
  activeRoutine: null,
  activeTimerIndex: 0,
  remainingTime: 0,
  remainingCycles: 0,
  isPaused: false,
  editingRoutine: null,
  editingTimerIndex: null,

  addTimer: (timer) => set((state) => ({
    currentTimers: [...state.currentTimers, timer]
  })),

  updateTimer: (index, timer) => set((state) => ({
    currentTimers: state.currentTimers.map((t, i) => i === index ? timer : t),
    editingTimerIndex: null
  })),

  removeTimer: (index) => set((state) => ({
    currentTimers: state.currentTimers.filter((_, i) => i !== index)
  })),

  clearTimers: () => set({ currentTimers: [] }),

  setCurrentTimers: (timers) => set({ currentTimers: timers }),

  saveRoutine: async (routine) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error('Debes iniciar sesión para guardar rutinas');
      return;
    }

    try {
      const routineData = {
        ...routine,
        userId: user.uid,
      };
      await addDoc(collection(db, 'routines'), routineData);
      await get().loadRoutines();
      set({ currentTimers: [] });
      toast.success('Rutina guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la rutina');
      console.error(error);
    }
  },

  updateRoutine: async (routineId, routine) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error('Debes iniciar sesión para actualizar rutinas');
      return;
    }

    try {
      await updateDoc(doc(db, 'routines', routineId), {
        ...routine,
        userId: user.uid,
      });
      await get().loadRoutines();
      set({ currentTimers: [], editingRoutine: null });
      toast.success('Rutina actualizada exitosamente');
    } catch (error) {
      toast.error('Error al actualizar la rutina');
      console.error(error);
    }
  },

  deleteRoutine: async (routineId) => {
    try {
      await deleteDoc(doc(db, 'routines', routineId));
      await get().loadRoutines();
      toast.success('Rutina eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la rutina');
      console.error(error);
    }
  },

  loadRoutines: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ routines: [] });
      return;
    }

    try {
      const q = query(collection(db, 'routines'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const routines = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Routine[];
      set({ routines });
    } catch (error) {
      toast.error('Error al cargar las rutinas');
      console.error(error);
    }
  },

  startRoutine: (routine) => set({
    activeRoutine: routine,
    activeTimerIndex: 0,
    remainingCycles: routine.cycles,
    isPaused: false,
    remainingTime: routine.timers[0].duration
  }),

  setActiveTimerIndex: (index) => set({ activeTimerIndex: index }),
  setRemainingTime: (time) => set({ remainingTime: time }),
  setRemainingCycles: (cycles) => set({ remainingCycles: cycles }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  resetActive: () => set({
    activeRoutine: null,
    activeTimerIndex: 0,
    remainingTime: 0,
    remainingCycles: 0,
    isPaused: false
  }),
  setEditingRoutine: (routine) => set({ editingRoutine: routine }),
  setEditingTimerIndex: (index) => set({ editingTimerIndex: index })
}));