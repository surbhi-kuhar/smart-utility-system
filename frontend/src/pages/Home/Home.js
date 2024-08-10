import React from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaPaintRoller,
  FaPlug,
  FaBroom,
  FaHammer,
  FaWrench,
  FaSnowflake,
  FaBug,
  FaLeaf,
  FaSpa,
  FaDumbbell,
  FaChalkboardTeacher,
} from "react-icons/fa";
import image1 from "../../images/ac-service.jpg";
import image2 from "../../images/painter.jpg";
import image3 from "../../images/electrician.jpg";
import image4 from "../../images/carpentry.jpg";

const Home = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { ref: infoRef, inView: infoInView } = useInView({
    triggerOnce: true,
    threshold: 0.1, // Adjust threshold as needed
  });

  const images = [
    { src: image1, text: "AC Service", textPosition: "bottom" },
    { src: image2, text: "Painting", textPosition: "top" },
    { src: image3, text: "Electrical", textPosition: "bottom" },
    { src: image4, text: "Carpentry", textPosition: "top" },
  ];

  const services = [
    { icon: FaBroom, text: "Cleaning" },
    { icon: FaTools, text: "Plumbing" },
    { icon: FaPlug, text: "Electrical" },
    { icon: FaPaintRoller, text: "Painting" },
    { icon: FaHammer, text: "Carpentry" },
    { icon: FaWrench, text: "Appliance Repair" },
    { icon: FaSnowflake, text: "HVAC Services" },
    { icon: FaBug, text: "Pest Control" },
    { icon: FaLeaf, text: "Gardening & Landscaping" },
    { icon: FaSpa, text: "Beauty & Wellness" },
    { icon: FaDumbbell, text: "Fitness Training" },
    { icon: FaChalkboardTeacher, text: "Tutoring" },
  ];

  const handleServiceRequest = (service) => {
    navigate(`/providers/${service}`);
  };

  return (
    <div className="min-h-screen">
      <section className="py-16 text-gray-800">
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

      {/* Information Section */}
      <section
        ref={infoRef}
        className="flex flex-col lg:flex-row items-center justify-between text-center py-16"
      >
        <motion.div
          className="w-full lg:w-1/2 px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: infoInView ? 1 : 0, y: infoInView ? 0 : 50 }}
          transition={{ duration: 1.5 }}
        >
          <h2 className="text-3xl md:text-3xl font-bold mb-4">
            Home Services at Your Doorstep
          </h2>
          <p className="text-base md:text-xl mb-8">
            Our platform connects you with top-rated professionals for all your
            home service needs. From plumbing to electrical work, we provide
            reliable services right at your doorstep.
          </p>
        </motion.div>
        <motion.div
          className="w-full lg:w-1/2 grid grid-cols-2 md:grid-cols-4 gap-4 px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: infoInView ? 1 : 0, y: infoInView ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-white text-blue-500 p-4 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300 w-24 h-24"
              onClick={() => handleServiceRequest(service.text)}
            >
              <service.icon className="text-4xl mb-2" />
              <p className="text-sm font-semibold">{service.text}</p>
            </div>
          ))}
        </motion.div>
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
