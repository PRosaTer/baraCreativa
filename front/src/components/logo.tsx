import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center h-full ml-[60px]">
      <Image
        src="/logo-bc.png"
        alt="Bara Creativa Logo"
        width={66}
        height={53}
        priority
      />
    </div>
  );
}
