import Link from "next/link";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">SERP Extensions</h3>
            <p className="text-sm text-gray-600">
              Discover and explore the best browser extensions for productivity, privacy, and more.
            </p>
          </div>

          {/* Extensions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-700">
              Extensions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                  By Category
                </Link>
              </li>
              <li>
                <Link href="/topics" className="text-gray-600 hover:text-blue-600 transition-colors">
                  By Topic
                </Link>
              </li>
              <li>
                <Link href="/best/password-manager" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Password Managers
                </Link>
              </li>
              <li>
                <Link href="/best/vpn" className="text-gray-600 hover:text-blue-600 transition-colors">
                  VPNs
                </Link>
              </li>
              <li>
                <Link href="/best/ad-blocker" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Ad Blockers
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-700">
              Topics
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/best/grammar-checker" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Grammar Checkers
                </Link>
              </li>
              <li>
                <Link href="/best/screen-recorder" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Screen Recorders
                </Link>
              </li>
              <li>
                <Link href="/best/pdf-editor" className="text-gray-600 hover:text-blue-600 transition-colors">
                  PDF Editors
                </Link>
              </li>
              <li>
                <Link href="/best/dark-mode" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dark Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-700">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} SERP Extensions. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/sitemap.xml" className="text-gray-600 hover:text-blue-600 transition-colors">
                Sitemap
              </Link>
              <a
                href="https://serp.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                SERP
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
