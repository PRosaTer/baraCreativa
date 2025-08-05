export type Mensaje = {
  message: string;
  sender: "bot" | "user";
  widget?: { 
    buttonText: string;
    buttonColor: string;
    buttonUrl: string;
  };
};
