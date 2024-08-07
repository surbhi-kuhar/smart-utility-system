// src/HomePage.js
import React from "react";
import { motion } from "framer-motion";
import image1 from "../../images/ac-service.jpg"; // Adjust the path as necessary
import image2 from "../../images/painter.jpg";
import image3 from "../../images/electrician.jpg";
import image4 from "../../images/carpentry.jpg";

const Home = () => {
  const images = [
    { src: image1, text: "AC Service", textPosition: "bottom" },
    { src: image2, text: "Painting", textPosition: "top" },
    { src: image3, text: "Electrical", textPosition: "bottom" },
    { src: image4, text: "Carpentry", textPosition: "top" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 text-white">
      <section className="py-16 bg-white text-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <motion.div
                key={index}
                className="rounded-md relative h-[80vh] flex items-center justify-center overflow-hidden shadow-xl shadow-slate-500"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img
                  src={img.src}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute w-full text-center text-white font-bold text-3xl p-4 ${
                    img.textPosition === "bottom" ? "bottom-0" : "top-0"
                  }`}
                >
                  {img.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 bg-gradient-to-r from-blue-500 to-purple-500">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          Join us and experience the best services.
        </motion.p>
        <motion.button
          className="px-6 py-3 bg-purple-600 rounded-md text-white font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Sign Up Now
        </motion.button>
      </section>
    </div>
  );
};

export default Home;
