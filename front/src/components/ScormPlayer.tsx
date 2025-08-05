"use client";

import React, { useRef, useEffect, useState } from "react";

interface ScormAPI {
  LMSInitialize: (param: string) => string;
  LMSFinish: (param: string) => string;
  LMSGetValue: (param: string) => string;
  LMSSetValue: (param: string, value: string) => string;
  LMSCommit: (param: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (errorCode: string) => string;
  LMSGetDiagnostic: (errorCode: string) => string;
}

declare global {
  interface Window {
    API?: ScormAPI;
    API_1484_11?: ScormAPI;
  }
}

interface ScormPlayerProps {
  scormPath: string;
  courseId: number;
}

const createScorm12API = (courseId: number): ScormAPI => {
  let lessonStatus = "not attempted";
  let score = 0;
  const dataModel: Record<string, string> = {};

  const api: ScormAPI = {
    LMSInitialize: (param: string) => {
      console.log(
        `[SCORM API] LMSInitialize(${param}) called for Course ID: ${courseId}`
      );
      lessonStatus = "incomplete";
      return "true";
    },
    LMSFinish: (param: string) => {
      console.log(
        `[SCORM API] LMSFinish(${param}) called for Course ID: ${courseId}`
      );
      return "true";
    },
    LMSGetValue: (param: string) => {
      console.log(`[SCORM API] LMSGetValue(${param}) called`);
      switch (param) {
        case "cmi.core.lesson_status":
          return lessonStatus;
        case "cmi.core.score.raw":
          return score.toString();
        case "cmi.core.student_id":
          return `user_${Date.now()}`;
        case "cmi.core.student_name":
          return "Nombre, Apellido";
        case "cmi.core.entry":
          return "ab-initio";
        case "cmi.core.total_time":
          return "00:00:00";
        case "cmi.suspend_data":
          return dataModel["cmi.suspend_data"] || "";
        case "cmi.objectives._count":
          return "0";
        case "cmi.interactions._count":
          return "0";
        default:
          if (dataModel[param]) {
            return dataModel[param];
          }
          console.warn(
            `[SCORM API] LMSGetValue: Unhandled parameter: ${param}`
          );
          return "";
      }
    },
    LMSSetValue: (param: string, value: string) => {
      console.log(`[SCORM API] LMSSetValue(${param}, ${value}) called`);
      switch (param) {
        case "cmi.core.lesson_status":
          lessonStatus = value;
          break;
        case "cmi.core.score.raw":
          score = parseInt(value, 10);
          break;
        case "cmi.suspend_data":
          dataModel["cmi.suspend_data"] = value;
          break;
        default:
          dataModel[param] = value;
          console.warn(
            `[SCORM API] LMSSetValue: Unhandled parameter: ${param}`
          );
      }
      return "true";
    },
    LMSCommit: (param: string) => {
      console.log(
        `[SCORM API] LMSCommit(${param}) called for Course ID: ${courseId}`
      );
      console.log(
        `[SCORM API] Progreso actual: Lesson Status: ${lessonStatus}, Score: ${score}, Suspend Data: ${dataModel["cmi.suspend_data"]}`
      );
      return "true";
    },
    LMSGetLastError: () => {
      console.log(`[SCORM API] LMSGetLastError() called`);
      return "0";
    },
    LMSGetErrorString: (errorCode: string) => {
      console.log(`[SCORM API] LMSGetErrorString(${errorCode}) called`);
      return "No error";
    },
    LMSGetDiagnostic: (errorCode: string) => {
      console.log(`[SCORM API] LMSGetDiagnostic(${errorCode}) called`);
      return "No diagnostic info";
    },
  };
  return api;
};

const ScormPlayer: React.FC<ScormPlayerProps> = ({ scormPath, courseId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
      setError(null);
      console.log("[ScormPlayer] Iframe loaded.");
      console.log("[ScormPlayer] Iframe src:", iframe.src);

      try {
        window.API = createScorm12API(courseId);
        window.API_1484_11 = createScorm12API(courseId);

        console.log("[ScormPlayer] SCORM API injected into parent window.");
        console.log("[ScormPlayer] window.API is:", window.API);
        console.log("[ScormPlayer] window.API_1484_11 is:", window.API_1484_11);
      } catch (e) {
        console.error("[ScormPlayer] Error al inyectar SCORM API:", e);
        setError("Error al inicializar la API SCORM.");
      }
    };

    iframe.addEventListener("load", handleLoad);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      if (window.API) delete window.API;
      if (window.API_1484_11) delete window.API_1484_11;
      console.log("[ScormPlayer] SCORM API cleaned up.");
    };
  }, [scormPath, courseId]);

  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {isLoading && <p>Cargando contenido SCORM...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <iframe
        ref={iframeRef}
        src={scormPath}
        title={`SCORM Course ${courseId}`}
        style={{ width: "100%", height: "100%", border: "none" }}
        allowFullScreen
      ></iframe>
      <p style={{ marginTop: "10px", fontSize: "0.8em", color: "#666" }}>
        Nota: Este es un reproductor SCORM conceptual. La funcionalidad completa
        de SCORM requiere una implementación robusta de la API.
      </p>
    </div>
  );
};

export default ScormPlayer;
