interface NumberControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export function NumberControl({ value, onChange, min = 1 }: NumberControlProps) {
  const adjustNumber = (change: number) => {
    const newValue = value + change;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm">
      <button
        onClick={() => adjustNumber(-1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold"
      >
        -
      </button>
      <input
        type="number"
        value={value}
        readOnly
        className="w-16 text-center bg-transparent border-none text-lg font-semibold"
      />
      <button
        onClick={() => adjustNumber(1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold"
      >
        +
      </button>
    </div>
  );
}