export interface ImagenFoto {
  src: string;
  alt: string;
  rotate: string;
  classPosition: string;
  zIndex: number;
  centerTransform?: boolean;
  isMain?: boolean;
}

export type ListaImagenes = ImagenFoto[];