import Footer from "../components/Footer";

function Landing() {
  return (
    <div className="bg-gray-50 text-gray-800">
  
     
      {/* HERO */}
      <section className="text-center px-6 py-16 md:py-24 bg-gradient-to-b from-gray-100 to-gray-50">
        
        <p className="text-xs md:text-sm text-purple-600 mb-3">
          Trusted by 5,000+ Students & 1,200+ Businesses
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-6">
          Connect Students with <br />
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Real-World Opportunities
          </span>
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-lg mb-8">
          The trusted freelancing platform built exclusively for verified college students and businesses.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
            Join as Student →
          </button>

          <button className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Post a Gig
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-4xl mx-auto text-center">
          {[
            ["5,000+", "Verified Students"],
            ["1,200+", "Businesses"],
            ["10,000+", "Projects"],
            ["4.9/5", "Rating"],
          ].map((item, i) => (
            <div key={i}>
              <h2 className="text-xl md:text-2xl font-bold">{item[0]}</h2>
              <p className="text-gray-500 text-xs md:text-sm">{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

     <section className="py-20 px-6 bg-white text-center">

  <h2 className="text-3xl md:text-5xl font-bold mb-4">
    Everything You Need to Succeed
  </h2>

  <p className="text-gray-500 mb-14 text-sm md:text-lg">
    Built for students who want real-world experience without risk
  </p>

  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">

    {[
      {
        title: "Verified Students",
        desc: "Every student is verified using college credentials to ensure trust.",
        icon: "🎓",
      },
      {
        title: "Quality Projects",
        desc: "Work on real projects from startups and growing businesses.",
        icon: "💼",
      },
      {
        title: "Secure Payments",
        desc: "No fraud. Get paid safely after completing your work.",
        icon: "🔒",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="group bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2"
      >
        {/* ICON */}
        <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center text-2xl rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md group-hover:scale-110 transition">
          {item.icon}
        </div>

        {/* TITLE */}
        <h3 className="text-lg md:text-xl font-semibold mb-2">
          {item.title}
        </h3>

        {/* DESC */}
        <p className="text-gray-500 text-sm md:text-base">
          {item.desc}
        </p>
      </div>
    ))}

  </div>
</section>

      {/* STEPS */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-100 to-white text-center">

  <h2 className="text-3xl md:text-5xl font-bold mb-4">
    Start Earning in Simple Steps
  </h2>

  <p className="text-gray-500 mb-14 text-sm md:text-lg">
    From zero experience to your first paid project 🚀
  </p>

  <div className="relative max-w-6xl mx-auto">

    {/* LINE (only on desktop) */}
    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-20"></div>

    <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 relative">

      {[
        {
          title: "Create Profile",
          desc: "Showcase your skills and college details",
          icon: "👤",
        },
        {
          title: "Browse Gigs",
          desc: "Explore beginner-friendly projects",
          icon: "🔍",
        },
        {
          title: "Apply",
          desc: "Send proposals and get selected",
          icon: "📩",
        },
        {
          title: "Earn",
          desc: "Complete work and get paid securely",
          icon: "💰",
        },
      ].map((step, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-2 relative"
        >
          {/* ICON */}
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center text-2xl rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md">
            {step.icon}
          </div>

          {/* TITLE */}
          <h3 className="font-semibold text-lg mb-2">
            {step.title}
          </h3>

          {/* DESC */}
          <p className="text-gray-500 text-sm">
            {step.desc}
          </p>

          {/* STEP NUMBER BADGE */}
          <div className="absolute -top-3 -right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow">
            {i + 1}
          </div>
        </div>
      ))}

    </div>
  </div>
</section>
{/* TESTIMONIALS */}
<section className="py-16 md:py-20 px-6 bg-white text-center">
  
  <h2 className="text-2xl md:text-4xl font-bold mb-4">
    What Students Are Saying
  </h2>

  <p className="text-gray-500 mb-10 text-sm md:text-base">
    Real experiences from students who started their freelancing journey
  </p>

  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">

    {[
  {
    name: "Aditi Sharma",
    role: "Frontend Developer",
    review: "Got my first paid project within 2 weeks. Super smooth and safe!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rahul Patil",
    role: "Web Developer",
    review: "No fake clients. Finally a platform where beginners get real work.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sneha Kulkarni",
    role: "UI/UX Designer",
    review: "Helped me build my portfolio while still in college.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
].map((item, i) => (
   <div
  key={i}
  className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition text-left"
>
  {/* PROFILE */}
  <div className="flex items-center gap-4 mb-4">
    <img
      src={item.image}
      alt={item.name}
      className="w-12 h-12 rounded-full object-cover"
    />

    <div>
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-gray-500 text-xs">{item.role}</p>
    </div>
  </div>

  {/* STARS */}
  <div className="text-yellow-400 mb-2">★★★★★</div>

  {/* REVIEW */}
  <p className="text-gray-600 text-sm">
    “{item.review}”
  </p>
</div>
    ))}

  </div>
</section>
      {/* CTA */}
      <section className="py-16 md:py-20 text-center text-white bg-gradient-to-r from-purple-600 to-blue-500 px-6">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>

        <p className="mb-6 text-sm md:text-lg">
          Join thousands of students and businesses already working together
        </p>

        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
          Sign Up Free →
        </button>
      </section>

      
    </div>
    
  );
}

export default Landing;