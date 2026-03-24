export default function Footer() {
  return (
    <footer className="fixed left-0 w-full z-50">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-12 py-12 max-w-[1440px] mx-auto mx-auto">
        <div className="mb-8 md:mb-0">
          <div className="font-headline font-bold text-primary text-xl mb-2">
            The Sovereign Ledger
          </div>
          <div className="font-body text-sm text-on-surface-variant">
            © 2024 The Sovereign Ledger. All rights reserved.
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-on-surface-variant hover:text-primary transition-all duration-300">
            Privacy Policy
          </a>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-all duration-300">
            Terms of Service
          </a>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-all duration-300">
            Security
          </a>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-all duration-300">
            Status
          </a>
        </div>
      </div>
    </footer>
  );
}