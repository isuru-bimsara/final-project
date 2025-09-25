import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AboutPage = () => {
  // Core Values Data
  const values = [
    {
      title: "Quality Excellence",
      description:
        "We maintain rigorous quality standards across all our products and processes.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      color: "blue",
    },
    {
      title: "Customer Focus",
      description:
        "We prioritize understanding and meeting our client's unique requirements.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "green",
    },
    {
      title: "Ethical Practices",
      description:
        "We uphold fair labor practices and environmentally responsible manufacturing.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
          />
        </svg>
      ),
      color: "emerald",
    },
    {
      title: "Continuous Improvement",
      description:
        "We consistently innovate and refine our techniques and processes.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: "purple",
    },
  ];

  // Certifications Data
  const certifications = [
    {
      name: "ISO 9000:0001",
      description: "International Quality Management System Standard",
      icon: "🏆",
    },
    {
      name: "AOTS Certified",
      description:
        "Association for Overseas Technical Cooperation and Sustainable Partnerships",
      icon: "🌍",
    },
    {
      name: "Fair Trade Certified",
      description: "Ethical and Fair Labor Practices Certification",
      icon: "⚖",
    },
    {
      name: "W&M Certified",
      description: "Waste Management and Environmental Compliance",
      icon: "♻",
    },
    {
      name: "CERO-TTC Standard 200",
      description: "Carbon Emission Reduction and Operational Transparency",
      icon: "🌱",
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        border: "border-blue-200",
      },
      green: {
        bg: "bg-green-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        border: "border-green-200",
      },
      emerald: {
        bg: "bg-emerald-50",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        border: "border-emerald-200",
      },
      purple: {
        bg: "bg-purple-50",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        border: "border-purple-200",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About Our Company
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Founded in 2003, we've grown into a leading garment
                manufacturing company committed to delivering premium quality
                products with exceptional service and sustainable practices.
              </p>
            </div>

            {/* Our Story Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-blue-500 pb-4">
                Our Story
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Our journey began in a small workshop with just 70 employees
                  and a vision to create high-quality garments that blend
                  traditional craftsmanship with modern production techniques.
                  As demand for our products grew, we remained committed to our
                  core values.
                </p>

                <p className="text-lg">
                  Today, we operate a state-of-the-art manufacturing facility
                  spanning over 50,000 square feet, equipped with the latest
                  technology and staffed by over 300 skilled professionals. Our
                  growth is a testament to our unwavering commitment to quality
                  and customer satisfaction.
                </p>

                <p className="text-lg">
                  Throughout our evolution, we've maintained our founding
                  principles: attention to detail, technical excellence, ethical
                  manufacturing practices, and building long-term relationships
                  with our clients. These values continue to guide us as we
                  expand our global footprint.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-bold mb-2">20+</div>
                <div className="text-xl md:text-2xl font-semibold">
                  Years of Excellence
                </div>
                <div className="text-blue-200 mt-2">
                  Serving Businesses Worldwide
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    300+
                  </div>
                  <div className="text-blue-200">Skilled Professionals</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    50,000+
                  </div>
                  <div className="text-blue-200">Square Feet Facility</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">20+</div>
                  <div className="text-blue-200">New York Businesses</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The principles that guide every aspect of our business and
                ensure we deliver consistent value to our clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const colorClasses = getColorClasses(value.color);
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 ${colorClasses.border} ${colorClasses.bg} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full ${colorClasses.iconBg} flex items-center justify-center mb-4`}
                    >
                      <div className={`${colorClasses.iconColor}`}>
                        {value.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-12">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Accreditations Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Accreditations & Certifications
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We adhere to international standards of quality and ethical
                manufacturing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center group hover:-translate-y-1 transition-transform"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {cert.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mb-16">
              <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
              <h3 className="text-3xl font-bold mb-4">
                Ready to work with us?
              </h3>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Contact us today to discuss your requirements and discover how
                we can help bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300 transform hover:scale-105">
                  Contact Us Today
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Request a Quote
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm mb-4">
                Trusted by leading brands worldwide
              </p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-bold">Brand 1</span>
                </div>
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-bold">Brand 2</span>
                </div>
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-bold">Brand 3</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
