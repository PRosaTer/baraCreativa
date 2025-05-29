import Image from 'next/image';

export default function Logo() {
  return (
    <div className="w-[66px] h-[53px] flex-shrink-0 flex items-center">
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
