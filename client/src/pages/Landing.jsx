import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import heroImg1 from "../assets/hero/1.png";
import heroImg2 from "../assets/hero/2.png";
import heroImg3 from "../assets/hero/3.png";

const HERO_IMAGES = [heroImg1, heroImg2, heroImg3];

function Landing() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800">
      
      {/* HERO SECTION WITH DYNAMIC CAROUSEL */}
      <section className="relative text-center px-6 py-24 md:py-32 overflow-hidden flex flex-col justify-center items-center min-h-[85vh]">
        
        {/* BACKGROUND IMAGES */}
        {HERO_IMAGES.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* DARK OVERLAY FOR TEXT READABILITY */}
        <div className="absolute inset-0 bg-gray-900/75 backdrop-blur-[2px]" />

        {/* CONTENT OVERLAY */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          <p className="text-xs md:text-sm text-purple-300 mb-5 uppercase font-black tracking-widest bg-white/10 px-5 py-2 rounded-full inline-block backdrop-blur-md border border-white/10 shadow-xl overflow-hidden ring-1 ring-white/20">
            Trusted by 5,000+ Students & 1,200+ Businesses
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight text-white drop-shadow-2xl">
            Connect Students with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              Real-World Opportunities
            </span>
          </h1>

          <p className="text-gray-200 max-w-2xl mx-auto text-sm md:text-xl mb-10 font-medium drop-shadow-md">
            The elite marketplace built exclusively for verified collegiate talent and scaling businesses.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link to="/signup?role=student" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] text-center border border-purple-500/30">
              Join as Student →
            </Link>

            <Link to="/signup?role=client" className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-bold text-white hover:bg-white/20 transition-all duration-300 text-center shadow-xl hover:scale-105 hover:border-white/40">
              Post a Gig
            </Link>
          </div>

          {/* DYNAMIC STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto text-center w-full">
            {[
              ["5,000+", "Verified Students"],
              ["1,200+", "Businesses"],
              ["10,000+", "Projects"],
              ["4.9/5", "Rating"],
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-2xl hover:bg-white/10 transition-colors duration-300">
                <h2 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">{item[0]}</h2>
                <p className="text-gray-300 text-xs md:text-sm font-semibold tracking-wide uppercase mt-1">{item[1]}</p>
              </div>
            ))}
          </div>
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