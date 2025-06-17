import { usePopup } from "../../app/hooks/usePopup";
import { ModalExterno } from "./ModalExterno";

interface Props {
  titulo: string;
  url: string;
}

export const PopupInformativo = ({ titulo, url }: Props) => {
  const { mostrar, toggle } = usePopup();

  return (
    <div>
      <button onClick={toggle} className="text-white hover:underline">
        {titulo}
      </button>
      {mostrar && <ModalExterno url={url} onClose={toggle} />}
    </div>
  );
};
