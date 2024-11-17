import { useState, useEffect } from 'react';
import { TimeControl } from './TimeControl';
import { useTimerStore } from '../store/timerStore';
import { useAuthStore } from '../store/authStore';

export function RoutineForm() {
  const [routineName, setRoutineName] = useState('');
  const [timerName, setTimerName] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [cycles, setCycles] = useState(1);

  const { user } = useAuthStore();
  const { 
    currentTimers, 
    addTimer, 
    updateTimer,
    clearTimers, 
    saveRoutine, 
    removeTimer,
    editingRoutine,
    editingTimerIndex,
    updateRoutine,
    setEditingRoutine,
    setEditingTimerIndex,
    setCurrentTimers
  } = useTimerStore();

  useEffect(() => {
    if (editingRoutine) {
      setRoutineName(editingRoutine.name);
      setCycles(editingRoutine.cycles);
      setCurrentTimers(editingRoutine.timers);
    }
  }, [editingRoutine]);

  useEffect(() => {
    if (editingTimerIndex !== null) {
      const timer = currentTimers[editingTimerIndex];
      setTimerName(timer.name);
      setMinutes(timer.minutes);
      setSeconds(timer.seconds);
    }
  }, [editingTimerIndex]);

  const handleAddTimer = () => {
    if (!timerName || (minutes === 0 && seconds === 0)) return;
    
    const timer = {
      name: timerName,
      duration: minutes * 60 + seconds,
      minutes,
      seconds
    };

    if (editingTimerIndex !== null) {
      updateTimer(editingTimerIndex, timer);
    } else {
      addTimer(timer);
    }

    setTimerName('');
    setMinutes(0);
    setSeconds(0);
    setEditingTimerIndex(null);
  };

  const handleEditTimer = (index: number) => {
    setEditingTimerIndex(index);
  };

  const handleSaveRoutine = async () => {
    if (!routineName || currentTimers.length === 0 || !user) return;

    const routineData = {
      name: routineName,
      cycles,
      timers: currentTimers
    };

    if (editingRoutine?.id) {
      await updateRoutine(editingRoutine.id, routineData);
      setEditingRoutine(null);
    } else {
      await saveRoutine(routineData);
    }

    setRoutineName('');
    setCycles(1);
    clearTimers();
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {editingRoutine ? 'Editar Rutina' : 'Nueva Rutina'}
        </h2>
        {editingRoutine && (
          <button
            onClick={() => {
              setEditingRoutine(null);
              setRoutineName('');
              setCycles(1);
              clearTimers();
            }}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Cancelar Edición
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre de la Rutina
        </label>
        <input
          type="text"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow duration-200"
          placeholder="Ingrese el nombre de la rutina"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre del Timer
        </label>
        <input
          type="text"
          value={timerName}
          onChange={(e) => setTimerName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow duration-200"
          placeholder="Ingrese el nombre del timer"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Duración
        </label>
        <TimeControl
          minutes={minutes}
          seconds={seconds}
          onMinutesChange={setMinutes}
          onSecondsChange={setSeconds}
        />
      </div>

      <button
        onClick={handleAddTimer}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {editingTimerIndex !== null ? 'Actualizar Timer' : 'Agregar Timer'}
      </button>

      {currentTimers.length > 0 && (
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Timers Agregados
              <span className="px-2 py-0.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                {currentTimers.length}
              </span>
            </h3>
            <button
              onClick={clearTimers}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Limpiar
            </button>
          </div>
          <div className="grid gap-2">
            {currentTimers.map((timer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {timer.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {formatTime(timer.minutes, timer.seconds)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTimer(index)}
                    className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeTimer(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Número de Ciclos
        </label>
        <TimeControl
          value={cycles}
          onChange={setCycles}
          type="cycles"
        />
      </div>

      <button
        onClick={handleSaveRoutine}
        disabled={currentTimers.length === 0 || !routineName}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {editingRoutine ? 'Actualizar Rutina' : 'Guardar Rutina'}
      </button>
    </div>
  );
}