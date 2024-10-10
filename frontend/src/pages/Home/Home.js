import React from "react";
import axios from "axios";
import Header from "../../components/Header";
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
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
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
    { src: image1, text: "HVAC Services", textPosition: "bottom" },
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
    <>
      <Header />
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
                    onClick={() => handleServiceRequest(img.text)}
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
              Our platform connects you with top-rated professionals for all
              your home service needs. From plumbing to electrical work, we
              provide reliable services right at your doorstep.
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
        {/* <section className="flex flex-col items-center justify-center text-center py-16 bg-gradient-to-r from-blue-500 to-purple-500">
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
        </section> */}
      </div>

      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* About Us Section */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-bold mb-4">About Us</h4>
            <p className="text-sm">
              We provide reliable home services with top-rated professionals.
              From plumbing to electrical work, we ensure you get the best
              service at your doorstep.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a className="text-sm hover:underline">Our Services</a>
              </li>
              <li>
                <a className="text-sm hover:underline">About Us</a>
              </li>
              <li>
                <a className="text-sm hover:underline">Contact Us</a>
              </li>
              <li>
                <a className="text-sm hover:underline">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                info@taskmasters.com
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                +91 91980XXXXX
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook
                  className="text-blue-500 hover:text-white"
                  size={24}
                />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaTwitter
                  className="text-blue-400 hover:text-white"
                  size={24}
                />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram
                  className="text-pink-600 hover:text-white"
                  size={24}
                />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin
                  className="text-blue-600 hover:text-white"
                  size={24}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-gray-500 mt-8">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Taskmasters. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;
