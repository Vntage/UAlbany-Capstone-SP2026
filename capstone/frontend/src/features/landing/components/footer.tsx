import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t border-sky-200 bg-white">
      <div className="max-w-[1440px] mx-auto px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo / Title */}
        <div className="text-center md:text-left">
          <div className="font-headline font-bold text-2xl text-sky-800 mb-2">
            Financial Monitoring and Insight System
          </div>
          <div className="font-body text-sm text-sky-600">
            © 2026 Financial Monitoring and Insight System. All rights reserved.
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="#"
            className="text-sky-600 hover:text-sky-800 transition-colors duration-300"
          >
            Privacy Policy
          </Link>
          <Link
            to="#"
            className="text-sky-600 hover:text-sky-800 transition-colors duration-300"
          >
            Terms of Service
          </Link>
          <Link
            to="#"
            className="text-sky-600 hover:text-sky-800 transition-colors duration-300"
          >
            Security
          </Link>
          <Link
            to="#"
            className="text-sky-600 hover:text-sky-800 transition-colors duration-300"
          >
            Status
          </Link>
        </div>
      </div>
    </footer>
  );
}