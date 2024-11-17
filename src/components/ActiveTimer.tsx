import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';
import { useSound } from '../hooks/useSound';

interface ActiveTimerProps {
  onComplete: () => void;
}

export function ActiveTimer({ onComplete }: ActiveTimerProps) {
  const {
    activeRoutine,
    activeTimerIndex,
    remainingTime,
    remainingCycles,
    isPaused,
    setRemainingTime,
    setActiveTimerIndex,
    setRemainingCycles,
    togglePause,
    resetActive
  } = useTimerStore();

  const { playSound } = useSound();
  const intervalRef = useRef<number>();
  const isFirstRender = useRef(true);
  const lastCountdownTime = useRef<number>(0);

  useEffect(() => {
    if (isFirstRender.current) {
      playSound('start');
      isFirstRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (!activeRoutine) return;

    if (!isPaused) {
      intervalRef.current = window.setInterval(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, remainingTime]);

  useEffect(() => {
    if (remainingTime <= 5 && remainingTime > 0 && !isPaused) {
      if (lastCountdownTime.current !== remainingTime) {
        playSound('countdown');
        lastCountdownTime.current = remainingTime;
      }
    }

    if (remainingTime <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (activeTimerIndex < activeRoutine!.timers.length - 1) {
        playSound('change');
        setActiveTimerIndex(activeTimerIndex + 1);
        setRemainingTime(activeRoutine!.timers[activeTimerIndex + 1].duration);
        lastCountdownTime.current = 0;
      } else if (remainingCycles > 1) {
        playSound('change');
        setRemainingCycles(remainingCycles - 1);
        setActiveTimerIndex(0);
        setRemainingTime(activeRoutine!.timers[0].duration);
        lastCountdownTime.current = 0;
      } else {
        handleEnd();
      }
    }
  }, [remainingTime]);

  const handleEnd = () => {
    playSound('complete');
    resetActive();
    onComplete();
  };

  if (!activeRoutine) return null;

  const currentTimer = activeRoutine.timers[activeTimerIndex];
  const progress = ((currentTimer.duration - remainingTime) / currentTimer.duration) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-up">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
        {activeRoutine.name}
      </h2>
      <div className="mt-6 flex justify-center gap-4">
        <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Ciclo {activeRoutine.cycles - remainingCycles + 1} / {activeRoutine.cycles}
          </p>
        </div>
        <div className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            {currentTimer.name}
          </p>
        </div>
      </div>
      <p className={`text-8xl font-black my-12 font-mono tabular-nums text-center ${
        remainingTime <= 5 
          ? 'text-red-600 dark:text-red-400 scale-110 transition-all duration-200' 
          : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'
      }`}>
        {formatTime(remainingTime)}
      </p>
      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={togglePause}
          className="py-5 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium text-xl hover:from-yellow-500 hover:to-orange-600 transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {isPaused ? 'Reanudar' : 'Pausar'}
        </button>
        <button
          onClick={handleEnd}
          className="py-5 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium text-xl hover:from-red-600 hover:to-rose-700 transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Terminar
        </button>
      </div>
    </div>
  );
}