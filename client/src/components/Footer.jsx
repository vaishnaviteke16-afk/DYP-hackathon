function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 pt-16 pb-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-white text-2xl font-black tracking-tight italic">
            Uni<span className="text-blue-500">Hire</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs text-gray-500 font-medium">
            The elite marketplace connecting verified collegiate talent with scaling businesses for high-impact professional collaborations.
          </p>
          <div className="flex gap-4">
             {/* Social Links Placeholder */}
             <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
               <span className="text-xs font-bold text-white">In</span>
             </div>
             <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
               <span className="text-xs font-bold text-white">X</span>
             </div>
          </div>
        </div>

        {/* Services / Features */}
        <div>
          <h3 className="text-white text-sm font-black uppercase tracking-widest mb-6">Experience</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Project Matching</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Elite Portfolios</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Secure Escrow</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Instant Payouts</li>
          </ul>
        </div>

        {/* About / Contact */}
        <div>
          <h3 className="text-white text-sm font-black uppercase tracking-widest mb-6">Organization</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Our Mission</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Contact Support</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Safety Guidelines</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Career Portal</li>
          </ul>
        </div>

        {/* Contact info / CTA */}
        <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700/50">
          <h3 className="text-white text-sm font-black uppercase tracking-widest mb-4">Newsletter</h3>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">Get the latest gig opportunities directly in your inbox.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email" className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500 w-full" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">Join</button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase tracking-widest">
          © 2026 UniHire. Engineered for the next generation of talent.
        </p>
        <div className="flex gap-6 text-[10px] uppercase font-black tracking-widest text-gray-600">
          <span className="hover:text-gray-400 cursor-pointer">Privacy</span>
          <span className="hover:text-gray-400 cursor-pointer">Terms</span>
          <span className="hover:text-gray-400 cursor-pointer">Cookies</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;