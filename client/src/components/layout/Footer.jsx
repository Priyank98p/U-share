import { Link } from "react-router-dom";
import { Lock, GraduationCap } from "lucide-react";
import {assets} from "../../assets/assets.js"

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <span className="text-2xl font-extrabold tracking-tight text-white font-heading">U-Share</span>
            <p className="text-sm leading-relaxed">
              The premier student marketplace for resource sharing.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-slate-900 flex items-center cursor-pointer justify-center hover:text-white transition-colors">
               <img src={assets.github_icon} className="bg-white rounded-full" alt="" />
              </button>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-bold mb-6 font-heading">Marketplace</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-[#4F46E5] transition-colors">Browse All</Link></li>
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Electronics</Link></li>
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Textbooks</Link></li>
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Transport</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 font-heading">Community</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-[#4F46E5] transition-colors">How it Works</Link></li>
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Safety Center</Link></li>
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Verification Process</Link></li>
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Student Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-heading">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Safety Center</Link></li>
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-[#4F46E5] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Trust Badges */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs">© {new Date().getFullYear()} U-Share Marketplace. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-500">
              <Lock className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Secured payments</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Verified Students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
