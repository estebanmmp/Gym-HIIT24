import { useTimerStore } from '../store/timerStore';

interface RoutineListProps {
  onStartRoutine: () => void;
}

export function RoutineList({ onStartRoutine }: RoutineListProps) {
  const { routines, deleteRoutine, startRoutine, setEditingRoutine, setCurrentTimers } = useTimerStore();

  const handleStart = (index: number) => {
    startRoutine(routines[index]);
    onStartRoutine();
  };

  const handleEdit = (routine: any) => {
    setEditingRoutine(routine);
    setCurrentTimers(routine.timers);
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (routines.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No hay rutinas guardadas aún
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        Rutinas Guardadas
        <span className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
          {routines.length}
        </span>
      </h2>
      <div className="grid gap-4">
        {routines.map((routine, index) => (
          <div
            key={routine.id}
            className="p-4 rounded-xl bg-white dark:bg-gray-700 shadow-lg border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-shadow duration-200"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {routine.name}
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Ciclos: {routine.cycles}
              </p>
              <div className="flex flex-wrap gap-2">
                {routine.timers.map((timer, timerIndex) => (
                  <span
                    key={timerIndex}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-lg text-sm"
                  >
                    {timer.name}{' '}
                    <span className="font-mono">
                      {formatTime(timer.minutes, timer.seconds)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStart(index)}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200"
              >
                Iniciar
              </button>
              <button
                onClick={() => handleEdit(routine)}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200"
              >
                Editar
              </button>
              <button
                onClick={() => routine.id && deleteRoutine(routine.id)}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium hover:from-red-600 hover:to-rose-700 transform hover:scale-[1.02] transition-all duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}