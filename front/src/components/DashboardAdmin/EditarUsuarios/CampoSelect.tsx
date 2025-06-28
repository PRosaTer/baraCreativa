"use client";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
}

export default function CampoSelect({ label, name, value, onChange, options, placeholder }: Props) {
  return (
    <label className="block mb-2">
      {label}:
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded p-2 mt-1"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
