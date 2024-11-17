import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CompletionModalProps {
  onClose: () => void;
}

export function CompletionModal({ onClose }: CompletionModalProps) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-up text-center">
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          ¡Rutina Terminada!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          ¡Buen Trabajo! 💪
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}