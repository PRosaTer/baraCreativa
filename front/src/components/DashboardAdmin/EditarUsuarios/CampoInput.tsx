"use client";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
}

export default function CampoInput({ label, name, value, onChange, type = "text" }: Props) {
  return (
    <label className="block mb-2">
      {label}:
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded p-2 mt-1"
      />
    </label>
  );
}
