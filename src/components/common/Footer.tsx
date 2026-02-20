// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white text-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2015 - 2025 Skill Club® Global Inc.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
