import Image from "next/image";

const redes = [
  { nombre: "Facebook", icono: "/Facebook.logo.png", link: "https://facebook.com/baracreativahn" },
  { nombre: "Instagram", icono: "/instagram.logo.png", link: "https://instagram.com/baracreativa_hn" },
  { nombre: "LinkedIn", icono: "/linkedin.logo.png", link: "https://linkedin.com/company/gprhonduras/?viewAsMember=true" },
  { nombre: "YouTube", icono: "/youtube.logo.png", link: "https://www.youtube.com/@baracreativahn8789" },
  { nombre: "Spotify", icono: "/spotify.logo.png", link: "https://open.spotify.com/show/71q6aMyU8OUTdBcwFmEogC" },
  { nombre: "Gmail", icono: "/gmail.logo.png", link: "mailto:hola.baracreativahn@gmail.com" }, 
];

export const RedesSociales = () => (
  <div className="flex gap-4 items-center">
    {redes.map(({ nombre, icono, link }) => (
      <a key={nombre} href={link} target="_blank" rel="noopener noreferrer">
        <Image src={icono} alt={`${nombre} logo`} width={50} height={50} />
      </a>
    ))}
  </div>
);
