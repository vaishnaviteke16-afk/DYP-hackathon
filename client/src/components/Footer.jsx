function Footer() {
  return (
    <footer className="bg-[#0b1a2b] text-gray-300 pt-16 pb-8 px-6">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

        {/* LOGO + DESC */}
        <div>
          <h2 className="text-white text-xl font-bold mb-4">
            VerifiedGigs
          </h2>
          <p className="text-sm text-gray-400">
            The trusted platform connecting verified students with quality freelance opportunities.
          </p>
        </div>

        {/* STUDENTS */}
        <div>
          <h3 className="text-white font-semibold mb-4">For Students</h3>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">Browse Gigs</li>
            <li className="hover:text-white cursor-pointer">Sign Up</li>
            <li className="hover:text-white cursor-pointer">How It Works</li>
            <li className="hover:text-white cursor-pointer">Success Stories</li>
          </ul>
        </div>

        {/* BUSINESSES */}
        <div>
          <h3 className="text-white font-semibold mb-4">For Businesses</h3>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">Post a Gig</li>
            <li className="hover:text-white cursor-pointer">Get Started</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
            <li className="hover:text-white cursor-pointer">Find Talent</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
          </ul>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
        © 2026 VerifiedGigs. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;