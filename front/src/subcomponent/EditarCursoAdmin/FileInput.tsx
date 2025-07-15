// components/FileInput.tsx
import React, { ChangeEvent } from "react";

interface FileInputProps {
  label: string;
  name: string;
  accept: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  preview?: string | null;
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  name,
  accept,
  onChange,
  preview,
}) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type="file"
      name={name}
      accept={accept}
      onChange={onChange}
      style={{ marginBottom: 20 }}
    />
    {preview && (
      <img
        src={preview}
        alt={label}
        style={{
          maxWidth: "100%",
          maxHeight: 180,
          marginBottom: 20,
          borderRadius: 10,
        }}
      />
    )}
  </div>
);

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: 6,
  display: "block",
};
