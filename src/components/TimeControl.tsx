interface TimeControlProps {
  minutes?: number;
  seconds?: number;
  onMinutesChange?: (value: number) => void;
  onSecondsChange?: (value: number) => void;
  value?: number;
  onChange?: (value: number) => void;
  type?: 'time' | 'cycles';
}

export function TimeControl({
  minutes = 0,
  seconds = 0,
  onMinutesChange,
  onSecondsChange,
  value,
  onChange,
  type = 'time'
}: TimeControlProps) {
  const adjustNumber = (current: number, change: number, max: number) => {
    let newValue = current + change;
    if (newValue < 0) newValue = max;
    if (newValue > max) newValue = 0;
    return newValue;
  };

  if (type === 'cycles') {
    return (
      <div className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
        <button
          onClick={() => onChange?.(Math.max(1, (value || 1) - 1))}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
        >
          -
        </button>
        <span className="w-16 text-center text-lg font-semibold">
          {value || 1}
        </span>
        <button
          onClick={() => onChange?.((value || 1) + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => onMinutesChange?.(adjustNumber(minutes, 1, 59))}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
          >
            ▲
          </button>
          <span className="w-12 text-center text-2xl font-bold tabular-nums">
            {minutes.toString().padStart(2, '0')}
          </span>
          <button
            onClick={() => onMinutesChange?.(adjustNumber(minutes, -1, 59))}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
          >
            ▼
          </button>
        </div>
        <span className="text-2xl font-bold mt-2">:</span>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => onSecondsChange?.(adjustNumber(seconds, 1, 59))}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
          >
            ▲
          </button>
          <span className="w-12 text-center text-2xl font-bold tabular-nums">
            {seconds.toString().padStart(2, '0')}
          </span>
          <button
            onClick={() => onSecondsChange?.(adjustNumber(seconds, -1, 59))}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}