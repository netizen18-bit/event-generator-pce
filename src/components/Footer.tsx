import { Mail, Phone, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-300 py-8 px-4 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Left Section - Message */}
        <div className="text-center md:text-left flex-1">
          <p className="text-sm font-medium tracking-wide text-slate-400">
            This project was developed as part of learning at <span className="text-primary font-bold">PCE</span>
          </p>
        </div>

        {/* Center/Right Section - Contact Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
          {/* REPLACE with your website link */}
          <a
            href="https://www.pce.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors duration-200"
          >
            <Globe className="h-4 w-4" />
            <span>https://www.pce.ac.in</span>
          </a>

          {/* REPLACE with your email id */}
          <a
            href="pce@mes.ac.in"
            className="flex items-center gap-2 hover:text-white transition-colors duration-200"
          >
            <Mail className="h-4 w-4" />
            <span>pce@mes.ac.in</span>
          </a>

          {/* REPLACE with your phone number */}
          <a
            href="tel:022-65748000"
            className="flex items-center gap-2 hover:text-white transition-colors duration-200"
          >
            <Phone className="h-4 w-4" />
            <span>022-65748000</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
