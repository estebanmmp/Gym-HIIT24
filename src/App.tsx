import { useState, useEffect } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { RoutineForm } from './components/RoutineForm';
import { RoutineList } from './components/RoutineList';
import { ActiveTimer } from './components/ActiveTimer';
import { AuthModal } from './components/AuthModal';
import { CompletionModal } from './components/CompletionModal';
import { useTimerStore } from './store/timerStore';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';

function App() {
  const [showActiveTimer, setShowActiveTimer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { user, loading, initialize, signOut } = useAuthStore();
  const loadRoutines = useTimerStore(state => state.loadRoutines);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (user) {
      loadRoutines();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Toaster position="top-right" />
      <ThemeToggle />
      
      <div className="absolute top-4 left-4">
        {user ? (
          <button
            onClick={() => signOut()}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Iniciar Sesión
          </button>
        )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showCompletionModal && <CompletionModal onClose={() => setShowCompletionModal(false)} />}

      {showActiveTimer && activeRoutine ? (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center p-6">
          <div className="w-full max-w-xl">
            <ActiveTimer onComplete={() => {
              setShowActiveTimer(false);
              setShowCompletionModal(true);
            }} />
          </div>
        </div>
      ) : (
        <div className="container max-w-2xl mx-auto p-6 pt-20">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Gym-HIIT
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              </div>
              <svg className="w-10 h-10 text-blue-600 animate-pulse" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>

            {user ? (
              <div className="grid gap-8">
                <RoutineForm />
                <RoutineList onStartRoutine={() => setShowActiveTimer(true)} />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Inicia sesión para crear y guardar tus rutinas
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700"
                >
                  Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;