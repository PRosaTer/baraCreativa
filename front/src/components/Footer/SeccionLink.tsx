import Link from "next/link";

interface Props {
  texto: string;
  href: string;
}

export const SeccionLink = ({ texto, href }: Props) => (
  <Link href={href} className="hover:underline text-white text-base">
    {texto}
  </Link>
);
