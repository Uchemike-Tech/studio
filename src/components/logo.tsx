import { University } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <University className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-bold text-primary font-headline">FUTO Clearance Portal</h1>
    </div>
  );
}
