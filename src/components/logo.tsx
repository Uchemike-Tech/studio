import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/favicon.ico" alt="FUTO Logo" width={32} height={32} />
      <h1 className="text-xl font-bold text-primary font-headline">FUTO Clearance Portal</h1>
    </div>
  );
}
