"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowRight,
  FaUsers,
  FaBriefcase,
  FaHandshake,
  FaChartLine,
  FaStar,
  FaBars,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import AuthGuard from "@/components/ClientAuthGaurd";

function SkillsClubLanding() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleRedirectToSignup = () => {
    // LOGOUT USER
    // localStorage.removeItem("user"); // or any other logout logic
    router.push("/signup");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: FaUsers,
      title: "Find Talent",
      desc: "Connect with skilled freelancers ready to bring your projects to life",
    },
    {
      icon: FaBriefcase,
      title: "Get Projects",
      desc: "Freelancers discover opportunities matching their expertise",
    },
    {
      icon: FaHandshake,
      title: "Seamless Collaboration",
      desc: "Work together smoothly with built-in tools and communication",
    },
    {
      icon: FaChartLine,
      title: "Grow Your Business",
      desc: "Scale your success whether hiring or offering services",
    },
  ];

  const forFreelancers = [
    "Access unlimited project opportunities",
    "Build your professional portfolio",
    "Set your own rates and schedule",
    "Secure payment protection",
  ];

  const forClients = [
    "Browse verified skilled professionals",
    "Post projects in minutes",
    "Compare proposals and portfolios",
    "Milestone-based payments",
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: "#108A00",
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
            transition: "all 0.3s ease-out",
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{
            background: "#108A00",
            right: `${mousePosition.x / 30}px`,
            bottom: `${mousePosition.y / 30}px`,
            transition: "all 0.4s ease-out",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5F5] via-white/50 to-[#F5F5F5]" />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-lg" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex justify-between items-center">
          <div className="flex items-center" style={{ color: "#108A00" }}>
            <div className="w-24 sm:w-32 md:w-40 h-auto">
              <img
                src="/images/site logo.png"
                alt="Skills Club Logo"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <a
              href="#how-it-works"
              className="hover:opacity-70 transition-opacity"
              style={{ color: "#108A00" }}
            >
              How It Works
            </a>
            <a
              href="#freelancers"
              className="hover:opacity-70 transition-opacity"
              style={{ color: "#108A00" }}
            >
              For Freelancers
            </a>
            <a
              href="#clients"
              className="hover:opacity-70 transition-opacity"
              style={{ color: "#108A00" }}
            >
              For Clients
            </a>
            <button
              className="px-6 py-2 rounded-full text-white hover:opacity-90 transition-all hover:shadow-lg"
              style={{ background: "#108A00" }}
              onClick={handleRedirectToSignup}
            >
              Join Now
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "#108A00" }}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg">
            <div className="px-6 py-4 flex flex-col gap-4">
              <a
                href="#how-it-works"
                className="hover:opacity-70 transition-opacity"
                style={{ color: "#108A00" }}
              >
                How It Works
              </a>
              <a
                href="#freelancers"
                className="hover:opacity-70 transition-opacity"
                style={{ color: "#108A00" }}
              >
                For Freelancers
              </a>
              <a
                href="#clients"
                className="hover:opacity-70 transition-opacity"
                style={{ color: "#108A00" }}
              >
                For Clients
              </a>
              <button
                className="px-6 py-2 rounded-full text-white w-full"
                style={{ background: "#108A00" }}
                onClick={handleRedirectToSignup}
              >
                Join Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="mb-6 inline-block">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-md rounded-full px-4 py-2">
              <FaStar className="w-4 h-4" style={{ color: "#108A00" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#108A00" }}
              >
                Connect • Collaborate • Succeed
              </span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 animate-fade-in text-gray-900">
            Welcome to{" "}
            <span className="block flex justify-center mt-2" style={{ color: "#108A00" }}>
              <div className="w-30 sm:w-50 md:w-80 h-auto text-center">
                <img
                  src="/images/site logo.png"
                  alt="Skills Club Logo"
                  className="w-full h-auto object-contain"
                />
              </div>
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto px-4">
            Where Freelancers Meet Opportunities and Clients Find Talent — Your
            Gateway to Seamless Business Connections
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="group px-8 py-4 rounded-full text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2"
              style={{ background: "#108A00" }}
              onClick={handleRedirectToSignup}
            >
              Join as Freelancer
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="px-8 py-4 border-2 rounded-full text-lg font-semibold hover:bg-white/50 transition-all"
              style={{ borderColor: "#108A00", color: "#108A00" }}
              onClick={handleRedirectToSignup}
            >
              Hire Talent
            </button>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20 max-w-3xl mx-auto px-4">
            <div className="text-center">
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: "#108A00" }}
              >
                10K+
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
                Active Freelancers
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: "#108A00" }}
              >
                5K+
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
                Projects Completed
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: "#108A00" }}
              >
                98%
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
                Success Rate
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div
            className="w-6 h-10 border-2 rounded-full flex justify-center"
            style={{ borderColor: "#108A00" }}
          >
            <div
              className="w-1 h-3 rounded-full mt-2 animate-pulse"
              style={{ background: "#108A00" }}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 px-4">
              How Skills Club Works
            </h2>
            <p className="text-gray-600 text-base sm:text-lg px-4">
              A platform designed for both freelancers and clients to thrive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-white backdrop-blur-sm shadow-md rounded-2xl hover:shadow-xl transition-all hover:scale-105"
                style={{ borderLeft: "4px solid transparent" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderLeftColor = "#108A00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderLeftColor = "transparent")
                }
              >
                <feature.icon
                  className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform"
                  style={{ color: "#108A00" }}
                />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Freelancers & Clients Section */}
      <section className="relative py-24 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Freelancers */}
            <div
              id="freelancers"
              className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "#108A00" }}
              >
                <FaBriefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">
                For Freelancers
              </h3>
              <p className="text-gray-600 mb-6">
                Showcase your skills and land your dream projects
              </p>
              <ul className="space-y-4 mb-8">
                {forFreelancers.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FaCheckCircle
                      className="w-6 h-6 mt-0.5 flex-shrink-0"
                      style={{ color: "#108A00" }}
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 rounded-full text-white font-semibold transition-all hover:opacity-90 hover:shadow-lg"
                style={{ background: "#108A00" }}
                onClick={handleRedirectToSignup}
              >
                Start Freelancing
              </button>
            </div>

            {/* Clients */}
            <div
              id="clients"
              className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "#108A00" }}
              >
                <FaUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">
                For Clients
              </h3>
              <p className="text-gray-600 mb-6">
                Find the perfect talent for your next project
              </p>
              <ul className="space-y-4 mb-8">
                {forClients.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FaCheckCircle
                      className="w-6 h-6 mt-0.5 flex-shrink-0"
                      style={{ color: "#108A00" }}
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 rounded-full font-semibold transition-all hover:bg-white/50 border-2"
                style={{ borderColor: "#108A00", color: "#108A00" }}
                onClick={handleRedirectToSignup}
              >
                Post a Project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="bg-white backdrop-blur-sm shadow-xl rounded-3xl p-12"
            style={{
              background: "linear-gradient(135deg, #108A00 0%, #0d6b00 100%)",
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Join Skills Club?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Whether you're looking to hire or get hired, your journey starts
              here
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-10 py-4 bg-white rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl"
                style={{ color: "#108A00" }}
                onClick={handleRedirectToSignup}
              >
                Sign Up Free
              </button>
              <button
                className="px-10 py-4 rounded-full text-lg font-semibold text-white transition-all hover:bg-white/10 border-2 border-white"
                onClick={handleRedirectToSignup}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative border-t py-8 px-6"
        style={{ borderColor: "#108A00" }}
      >
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>&copy; 2025 Skills Club. Connecting talent with opportunity.</p>
        </div>
      </footer>
    </div>
  );
}


export default function SkillsClubLandingPage() {
  return (

      <SkillsClubLanding />
  );
}
