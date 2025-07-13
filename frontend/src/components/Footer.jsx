import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">ClicknFix</h2>
          <p className="text-sm">
            We connect you with trusted professionals for all your home
            services. Fast, reliable and verified — just a tap away.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Book a Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Become a Technician
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Contact</h2>
          <ul className="text-sm space-y-2">
            <li>Email: support@clicknfix.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: West Bengal, India</li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ClicknFix. All rights reserved.
      </div>
    </footer>
  );
}
