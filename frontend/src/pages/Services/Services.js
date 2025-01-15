import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBroom,
  FaTools,
  FaPlug,
  FaPaintRoller,
  FaHammer,
  FaWrench,
  FaSnowflake,
  FaBug,
  FaLeaf,
  FaSpa,
  FaDumbbell,
  FaChalkboardTeacher,
} from "react-icons/fa";
import Header from "../../components/Header";

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

const Services = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    navigate(`/providers/${service}`);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer"
                onClick={() => handleServiceClick(service.text)}
              >
                <service.icon className="text-6xl mb-4" />
                <p className="text-xl font-semibold">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
