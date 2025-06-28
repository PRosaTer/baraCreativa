export type Mensaje = {
  message: string;
  sender: "bot" | "user";
  widget?: React.ReactNode;
};
