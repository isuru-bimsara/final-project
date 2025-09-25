// //frontend/src/components/Footer.jsx

import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";

/**
 * Clean footer matching provided design (Image 4).
 * - Flat light background
 * - Four columns: Company, Quick Links, Contact Information, Newsletter
 * - Thin accent underline under each column title
 * - Social media icons in circles
 * - Bottom separator line + legal links
 *
 * TailwindCSS required.
 * Adjust the primary color by changing PRIMARY_COLOR classes if desired.
 */

const PRIMARY_COLOR = "text-blue-600";
const PRIMARY_BG = "bg-blue-600";
const PRIMARY_BG_HOVER = "hover:bg-blue-700";

/* Reusable heading underline */
const Heading = ({ children }) => (
  <div className="mb-6">
    <h3 className="text-gray-900 font-semibold text-lg">{children}</h3>
    <div className="h-0.5 w-12 bg-blue-600 mt-3 rounded" />
  </div>
);

const Footer = () => {
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.elements.newsletter_email?.value;
    if (!email) return;
    // TODO: integrate with backend
    // eslint-disable-next-line no-alert
    alert(`Subscribed: ${email}`);
    e.target.reset();
  };

  return (
    <footer className="bg-[#f7f8fa] text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
          {/* Column 1: Company */}
          <div>
            {/* Simple logo (replace with your own image if needed) */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                G
              </div>
              <div className="leading-tight">
                <div className="text-[13px] font-semibold text-gray-900">
                  Fabrick
                </div>
                <div className="text-[10px] uppercase tracking-widest font-medium text-blue-600">
                  Garment
                </div>
              </div>
            </div>
            <p className="leading-relaxed mb-8">
              Your trusted partner in garment manufacturing with over 20 years
              of experience delivering premium quality products for businesses
              worldwide.
            </p>

            <div className="flex items-center gap-5">
              <a
                aria-label="Facebook"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${PRIMARY_BG} ${PRIMARY_BG_HOVER} text-white w-10 h-10 rounded-full flex items-center justify-center transition`}
              >
                <FaFacebook size={18} />
              </a>
              <a
                aria-label="Twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <FaTwitter size={18} />
              </a>
              <a
                aria-label="Instagram"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <FaInstagram size={18} />
              </a>
              <a
                aria-label="LinkedIn"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 hover:bg-blue-800 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <Heading>Quick Links</Heading>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div>
            <Heading>Contact Information</Heading>
            <ul className="space-y-6">
              <li className="flex gap-3 items-start">
                <FaMapMarkerAlt className="text-blue-600 mt-0.5" />
                <span className="leading-relaxed">
                  123 Garment Street, Colombo, Sri Lanka
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <FaPhone className="text-blue-600" />
                <a
                  href="tel:+94123456789"
                  className="hover:text-blue-600 transition"
                >
                  +94 123 456 789
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <FaEnvelope className="text-blue-600" />
                <a
                  href="mailto:info@garmentfactory.com"
                  className="hover:text-blue-600 transition break-all"
                >
                  info@garmentfactory.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <Heading>Newsletter</Heading>
            <p className="leading-relaxed mb-5">
              Subscribe to receive updates on new products, special offers, and
              industry news.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                name="newsletter_email"
                type="email"
                placeholder="Your email address"
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 rounded-md transition shadow-sm"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-200 mt-4 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500">
            © {year} Garment Factory Management System. All rights reserved.
          </p>
          <div className="flex gap-8 text-gray-500">
            <Link
              to="/privacy"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="hover:text-blue-600 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
