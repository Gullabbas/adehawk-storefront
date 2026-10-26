import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
      <div className="space-y-6 max-w-md">
        <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block">
          404 · Page Not Found
        </span>
        <h1 className="font-serif text-5xl sm:text-6xl font-light text-ink">
          The Trail Has Ended
        </h1>
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans">
          The requested page or collection does not exist or has moved. Explore our authentic British leather goods from our homepage or catalogue.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/" variant="primary" size="md">
            Return to Flagship
          </Button>
          <Button href="/collections/all" variant="secondary" size="md">
            Explore All Pieces
          </Button>
        </div>
      </div>
    </div>
  );
}
