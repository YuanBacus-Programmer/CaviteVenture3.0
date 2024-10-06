"use client";
import avatar1 from "@/assets/TestimonialsImages/avatar-1.png";
import avatar2 from "@/assets/TestimonialsImages/avatar-2.png";
import avatar3 from "@/assets/TestimonialsImages/avatar-3.png";
import avatar4 from "@/assets/TestimonialsImages/avatar-4.png";
import avatar5 from "@/assets/TestimonialsImages/avatar-5.png";
import avatar6 from "@/assets/TestimonialsImages/avatar-6.png";
import avatar7 from "@/assets/TestimonialsImages/avatar-7.png";
import avatar8 from "@/assets/TestimonialsImages/avatar-8.png";
import avatar9 from "@/assets/TestimonialsImages/avatar-9.png";
import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "As a seasoned designer always on the lookout for innovative tools, Framer.com instantly grabbed my attention.",
    imageSrc: avatar1.src,
    name: "Jamie Rivera",
    username: "@jamietechguru00",
  },
  {
    text: "Our team's productivity has skyrocketed since we started using this tool.",
    imageSrc: avatar2.src,
    name: "Josh Smith",
    username: "@jjsmith",
  },
  {
    text: "This app has completely transformed how I manage my projects and deadlines.",
    imageSrc: avatar3.src,
    name: "Morgan Lee",
    username: "@morganleewhiz",
  },
  {
    text: "I was amazed at how quickly we were able to integrate this app into our workflow.",
    imageSrc: avatar4.src,
    name: "Casey Jordan",
    username: "@caseyj",
  },
  {
    text: "Planning and executing events has never been easier. This app helps me keep track of all the moving parts, ensuring nothing slips through the cracks.",
    imageSrc: avatar5.src,
    name: "Taylor Kim",
    username: "@taylorkimm",
  },
  {
    text: "The customizability and integration capabilities of this app are top-notch.",
    imageSrc: avatar6.src,
    name: "Riley Smith",
    username: "@rileysmith1",
  },
  {
    text: "Adopting this app for our team has streamlined our project management and improved communication across the board.",
    imageSrc: avatar7.src,
    name: "Jordan Patels",
    username: "@jpatelsdesign",
  },
  {
    text: "With this app, we can easily assign tasks, track progress, and manage documents all in one place.",
    imageSrc: avatar8.src,
    name: "Sam Dawson",
    username: "@dawsontechtips",
  },
  {
    text: "Its user-friendly interface and robust features support our diverse needs.",
    imageSrc: avatar9.src,
    name: "Casey Harper",
    username: "@casey09",
  },
];

const columns = [
  testimonials.slice(0, 3),
  testimonials.slice(3, 6),
  testimonials.slice(6, 9),
];

export const Testimonials = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.7,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="container">
        <div className="flex justify-center">
          <div className="tag mt-5">Testimonials</div>
        </div>
        <h2 className="section-title mt-5 text-center">Our Users Response</h2>
        <p className="section-description mt-5 text-center">
          From intuitive design to powerful features, our app has become an
          essential tool for users around the world.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 [mask-image:linear-gradient(to_bottom, transparent, black_25%,black_75%,transparent)]">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-6">
              {column.map(({ text, imageSrc, name, username }, cardIndex) => (
                <motion.div
                  key={cardIndex}
                  className="card p-4 bg-gray-50 rounded-lg shadow"
                  variants={cardVariants}
                  custom={cardIndex}
                  initial="hidden"
                  animate="visible"
                >
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <Image
                      src={imageSrc}
                      alt={name}
                      height={40}
                      width={40}
                      className="h-10 w-10 rounded-full"
                      sizes="(max-width: 768px) 40px, (max-width: 1200px) 40px, 40px"
                      priority={false}
                      loading="lazy"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">
                        {name}
                      </div>
                      <div className="leading-5 tracking-tight">
                        {username}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
