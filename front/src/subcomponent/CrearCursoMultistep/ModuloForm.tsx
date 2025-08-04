import React from "react";
import { EditableModuloForm, ClaseItem, CursoForm } from "@/app/types/curso";
import {
  moduloContainerStyle,
  moduloItemStyle,
  inputStyle,
  labelStyle,
  addModuloButtonStyle,
  removeModuloButtonStyle,
} from "@/subcomponent/CrearCursoMultistep/styles";

interface ModuloFormProps {
  form: CursoForm;
  moduloFiles: Array<{
    videoFile?: File | null;
    pdfFile?: File | null;
    imageFile?: File | null;
  }>;
  handleModuloChange: (
    index: number,
    field: "titulo" | "descripcion",
    value: string
  ) => void;
  handleModuloFileChange: (
    index: number,
    fileType: "videoFile" | "pdfFile" | "imageFile",
    file: File | null
  ) => void;
  handleAddModulo: () => void;
  handleRemoveModulo: (index: number) => void;
}

const ModuloForm: React.FC<ModuloFormProps> = ({
  form,
  handleModuloChange,
  handleModuloFileChange,
  handleAddModulo,
  handleRemoveModulo,
}) => {
  if (form.claseItem !== ClaseItem.CURSO) return null;

  return (
    <div style={moduloContainerStyle}>
      <h3 style={{ fontSize: "1.4rem", marginBottom: "15px" }}>Módulos</h3>
      {form.modulos.map((modulo: EditableModuloForm, index: number) => {
        const videoLink = Array.isArray(modulo.videoUrl) && modulo.videoUrl.length > 0
          ? modulo.videoUrl[0]
          : null;
        const pdfLink = Array.isArray(modulo.pdfUrl) && modulo.pdfUrl.length > 0
          ? modulo.pdfUrl[0]
          : null;
        const imageLink = Array.isArray(modulo.imageUrl) && modulo.imageUrl.length > 0
          ? modulo.imageUrl[0]
          : null;

        return (
          <div key={index} style={moduloItemStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h4 style={{ fontSize: "1.2rem", margin: 0 }}>
                Módulo {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => handleRemoveModulo(index)}
                style={removeModuloButtonStyle}
              >
                Eliminar Módulo
              </button>
            </div>

            <label style={labelStyle}>Título del Módulo</label>
            <input
              type="text"
              value={modulo.titulo}
              onChange={(e) =>
                handleModuloChange(index, "titulo", e.target.value)
              }
              style={inputStyle}
              required
            />

            <label style={labelStyle}>Descripción del Módulo</label>
            <textarea
              value={modulo.descripcion || ""}
              onChange={(e) =>
                handleModuloChange(index, "descripcion", e.target.value)
              }
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
              required
            />

            <label style={labelStyle}>Video (opcional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                handleModuloFileChange(
                  index,
                  "videoFile",
                  e.target.files ? e.target.files[0] : null
                )
              }
              style={{ marginBottom: 10 }}
            />
            {videoLink && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#555",
                  marginBottom: "10px",
                }}
              >
                Video actual:{" "}
                <a href={videoLink} target="_blank" rel="noopener noreferrer">
                  Ver video
                </a>
              </p>
            )}

            <label style={labelStyle}>PDF (opcional)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                handleModuloFileChange(
                  index,
                  "pdfFile",
                  e.target.files ? e.target.files[0] : null
                )
              }
              style={{ marginBottom: 10 }}
            />
            {pdfLink && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#555",
                  marginBottom: "10px",
                }}
              >
                PDF actual:{" "}
                <a href={pdfLink} target="_blank" rel="noopener noreferrer">
                  Ver PDF
                </a>
              </p>
            )}

            <label style={labelStyle}>Imagen (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleModuloFileChange(
                  index,
                  "imageFile",
                  e.target.files ? e.target.files[0] : null
                )
              }
              style={{ marginBottom: 10 }}
            />
            {imageLink && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#555",
                  marginBottom: "10px",
                }}
              >
                Imagen actual:{" "}
                <a href={imageLink} target="_blank" rel="noopener noreferrer">
                  Ver imagen
                </a>
              </p>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleAddModulo}
        style={addModuloButtonStyle}
      >
        Añadir Módulo
      </button>
    </div>
  );
};

export default ModuloForm;
