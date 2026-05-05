import { Link, NavLink } from "react-router-dom";
import { Lock, GraduationCap } from "lucide-react";
import { assets } from "../../assets/assets.js";

function Footer() {
  return (
    <footer className="bg-indigo-500 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          {/* Brand Column */}
          <div className="flex flex-row gap-2 sm:flex-col space-y-6">
            <div>
            <span className="text-2xl font-extrabold tracking-tight text-white font-heading">
              U-Share
            </span>
            <p className="text-sm text-white leading-relaxed">
              The premier student marketplace for resource sharing.
            </p>
            </div>

            <div className="flex gap-4">
              <NavLink
                to="https://github.com/Priyank98p"
                className="flex gap-4"
                target="_blank"
              >
                <button className="w-10 h-10 bg-slate-900 flex items-center rounded-full cursor-pointer justify-center hover:text-white transition-colors text-white">
                  <img src={assets.github_icon} alt="" />
                </button>
              </NavLink>
              <NavLink
                to="https://www.linkedin.com/in/priyank-singh-959638285"
                className="flex gap-4"
                target="_blank"
              >
                <button className="w-9.5 h-9.5 bg-slate-900 flex items-center cursor-pointer justify-center hover:text-white transition-colors text-white">
                  <img src={assets.linkedin_icon} className="bg-white" alt="" />
                </button>
              </NavLink>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 sm:gap-40 mb-12">
            {/* Links Columns */}
            <div>
              <h4 className="text-white font-bold mb-6 font-heading">
                Marketplace
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    to="/"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Textbooks
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Transport
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 font-heading">
                Community
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    to="/"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Safety Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Verification Process
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Student Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 font-heading">
                Support
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Safety Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-slate-800 transition-colors text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Bar with Trust Badges */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white">
            © {new Date().getFullYear()} U-Share Marketplace. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-500">
              <Lock className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                Secured payments
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                Verified Students
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
