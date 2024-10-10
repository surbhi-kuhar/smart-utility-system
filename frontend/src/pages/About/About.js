import React from "react";
import Header from "../../components/Header";
import about from '../../images/about.jpg';

function About() {
  return (
    <div>
      <Header />
      <section class="bg-blue-600 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <h2 class="text-4xl font-bold">About Us</h2>
          <p class="mt-4 text-lg">
            Bringing trusted services to your doorstep with ease and
            convenience.
          </p>
        </div>
      </section>

      <section class="bg-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <img
              src={about}
              alt="Our Story Image"
              class="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div class="flex flex-col justify-center">
            <h3 class="text-3xl font-bold text-gray-800">Our Story</h3>
            <p class="mt-4 text-gray-600">
              Taskmasters was founded with a vision to simplify access
              to essential home services. Whether it's plumbing, electrical
              work, or cleaning, we connect you with verified professionals
              right at your doorstep. Our platform prioritizes quality,
              convenience, and trust, ensuring that you can book services with
              confidence.
            </p>
            <p class="mt-4 text-gray-600">
              From small household repairs to large projects, we are committed
              to providing services that make your life easier, ensuring that
              every experience with us is seamless and satisfying.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-gray-100 py-12">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <h3 class="text-3xl font-bold text-gray-800">Our Mission</h3>
          <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
            Our mission is to revolutionize the way you manage your home. We aim
            to become your go-to solution for reliable, efficient, and
            affordable home services. Through our platform, we bring
            transparency, quality, and accessibility to everyone, empowering
            both customers and service providers.
          </p>
        </div>
      </section>

      <section class="bg-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 class="text-3xl font-bold text-gray-800">Why Choose Us?</h3>
          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-gray-100 rounded-lg shadow-md">
              <div class="text-blue-500 text-4xl mb-4">
                <i class="fas fa-shield-alt"></i>
              </div>
              <h4 class="text-xl font-semibold">Trusted Professionals</h4>
              <p class="mt-2 text-gray-600">
                Our service providers are verified, skilled, and reliable,
                ensuring the highest quality for your home needs.
              </p>
            </div>
            <div class="p-6 bg-gray-100 rounded-lg shadow-md">
              <div class="text-blue-500 text-4xl mb-4">
                <i class="fas fa-calendar-check"></i>
              </div>
              <h4 class="text-xl font-semibold">Convenient Scheduling</h4>
              <p class="mt-2 text-gray-600">
                Book services anytime, anywhere, and enjoy flexible scheduling
                options that suit your needs.
              </p>
            </div>
            <div class="p-6 bg-gray-100 rounded-lg shadow-md">
              <div class="text-blue-500 text-4xl mb-4">
                <i class="fas fa-dollar-sign"></i>
              </div>
              <h4 class="text-xl font-semibold">Transparent Pricing</h4>
              <p class="mt-2 text-gray-600">
                No hidden fees or surprises. We provide upfront pricing for all
                services, so you know what to expect.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-blue-600 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <h3 class="text-3xl font-bold">Ready to Book a Service?</h3>
          <p class="mt-4 text-lg">
            Explore our wide range of services and book a trusted professional
            today.
          </p>
          <a
            href="/services"
            class="inline-block mt-8 px-8 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100"
          >
            Explore Services
          </a>
        </div>
      </section>

      <footer class="bg-gray-800 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Taskmasters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default About;
