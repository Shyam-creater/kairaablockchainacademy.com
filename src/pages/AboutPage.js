import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { FaGoogle, FaMicrosoft, FaPlay, FaLinkedinIn, FaTwitter, FaGithub } from "react-icons/fa";
import { SiGrammarly, SiCoursera } from "react-icons/si";
import { LuGraduationCap, LuUsers, LuBookOpen, LuAward } from "react-icons/lu";
import { motion } from 'framer-motion';

const AnimatedCounter = ({ to, duration = 2, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const nodeRef = React.useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = null;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / (duration * 1000), 1);
          setCount(Math.floor(progress * to));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      } else {
        setCount(0); // Reset when scrolled out of view
      }
    }, { threshold: 0.1 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration]);

  const displayValue = count >= 1000 ? Math.floor(count / 1000) + "K" : count;

  return <span ref={nodeRef}>{displayValue}{suffix}</span>;
};

const AboutPage = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const headingText = "We're on a mission toempower students    worldwide";

  // ===== LETTER REVEAL ANIMATION VARIANTS =====
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      rotateZ: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const headingContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // 50ms delay between each letter
        delayChildren: 0.2,
      },
    },
  };

  // ===== CONTENT STAGGER ANIMATION =====
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  // ===== FLOATING BACKGROUND SHAPES =====
  const floatingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
    animate: {
      y: [0, 30, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // ===== PLAY BUTTON ANIMATION =====
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        delay: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const playButtonCircleVariants = {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.12,
      transition: { duration: 0.3 },
    },
    whileTap: { scale: 0.95 },
  };

  const headingText2 = "We Collaborate With 20+ Leading Universities And Companies";

  // ===== LETTER REVEAL ANIMATION FOR HEADING =====
  const letterVariants2 = {
    hidden: {
      opacity: 0,
      y: 10,
      rotateZ: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const headingContainerVariants2 = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  // ===== IMAGE ANIMATION VARIANTS =====
  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  // ===== LOGO/COMPANY ANIMATION VARIANTS =====
  const logoContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const logoItemVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const logoHoverVariants = {
    initial: { scale: 1, y: 0 },
    whileHover: {
      scale: 1.08,
      y: -5,
      transition: { duration: 0.3 },
    },
  };

  const images = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
  ];

  const companies = [
    { name: "Google", icon: FaGoogle, color: "text-red-500" },
    { name: "Microsoft", icon: FaMicrosoft, color: "text-blue-500" },
    { name: "Grammarly", icon: SiGrammarly, color: "text-green-500" },
    { name: "Coursera", icon: SiCoursera, color: "text-blue-600" }
  ];

  const statsContainerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.8, staggerChildren: 0.15 }
    }
  };

  const statsItemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const teacherHeaderVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const teacherContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const teacherCardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const leftContentVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.96 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.9, ease: "easeOut" }
    }
  };

  const visionMissionItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const underlineVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { delay: 0.4, duration: 0.8 } }
  };

  const foundingHeadingText = "Our Founding Story";
  const visionTitle = "Our Vision";
  const missionTitle = "Our Mission";

  // ===== STORY SECTION ANIMATIONS =====
  const storyContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const originLabelVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // ===== FOUNDING HEADING - LETTER REVEAL =====
  const foundingLetterVariants = {
    hidden: {
      opacity: 0,
      y: 12,
      rotateZ: -8,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const foundingHeadingContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.15,
      },
    },
  };

  // ===== STORY PARAGRAPHS =====
  const storyParagraphVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  // ===== VISION/MISSION CARD =====
  const cardEntranceVariants = {
    hidden: {
      opacity: 0,
      scale: 0.85,
      y: 40,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // ===== VISION/MISSION BOX CONTAINER =====
  const visionMissionContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4,
      },
    },
  };

  // ===== INDIVIDUAL VISION/MISSION BOX =====
  const visionMissionBoxVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  // ===== UNDERLINE BAR ANIMATION =====
  const underlineBarVariants = {
    hidden: {
      scaleX: 0,
      opacity: 0,
    },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.3,
      },
    },
  };

  // ===== VISION/MISSION TEXT =====
  const visionMissionTextVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
      },
    },
  };

  const foundingStoryContent = `Kairaa Blockchain is an Online Learning and Development Academy based in Coimbatore, Tamilnadu, founded in 2023. The company, led by a team of professionals, aims to empower college graduates and corporate employees with essential Technical, Communication, and Leadership skills to enhance employability and readiness for the industry.`;

  const inspiringContent = `With a focus on practical, hands-on learning and mentorship from experienced professionals, we strive to not just educate, but to inspire and empower the leaders of tomorrow.`;

  const features = [
    {
      title: "Language Inclusivity",
      desc: "We offer courses in Tamil, breaking down language barriers and making tech education more accessible to a wider audience.",
      bg: "bg-[#1C1678] text-white"
    },
    {
      title: "Practical Learning",
      desc: "Our curriculum is designed with a practical approach, allowing students to learn by doing and gain hands-on experience.",
      bg: "bg-white text-slate-800 shadow-md border border-slate-100"
    },
    {
      title: "Experienced Instructors",
      desc: "Our instructors are industry professionals with years of experience, providing real-world insights into their learning.",
      bg: "bg-white text-slate-800 shadow-md border border-slate-100"
    },
    {
      title: "Community Support",
      desc: "We foster a supportive and collaborative learning environment, encouraging students to learn from each other.",
      bg: "bg-orange-500 text-white"
    }
  ];

  const teachers = [
    { name: "Willy Kedz", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "Sophie Moor", role: "Chief Product Officer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "Natael Mors", role: "Design Manager", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "Aishy Kaspol", role: "Marketing Specialist", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400" }
  ];

  return (
    <div className="overflow-x-hidden min-h-screen font-sans text-slate-900 bg-white">
      <Heading title="About Kairaa Blockchain Academy" description="Your Gateway to Blockchain Mastery" />
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

      <section className="bg-[#1C1678] pt-32 pb-48 px-6 md:px-12 relative text-white overflow-hidden">
        {/* ===== ANIMATED DECORATIVE SHAPES ===== */}
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full opacity-20 blur-[100px] translate-x-1/2 -translate-y-1/2"
          variants={floatingVariants}
          initial="hidden"
          whileInView="visible"
          animate="animate"
          viewport={{ once: false, amount: 0.3 }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500 rounded-full opacity-20 blur-[100px] -translate-x-1/2 translate-y-1/2"
          variants={floatingVariants}
          initial="hidden"
          whileInView="visible"
          animate="animate"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ delay: 0.2 }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* ===== "ABOUT US" LABEL ===== */}
          <motion.p
            className="uppercase tracking-widest text-sm text-orange-400 font-bold mb-6"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
          >
            About Us
          </motion.p>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            {/* ===== MAIN HEADING WITH LETTER REVEAL ===== */}
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold font-headingFont leading-tight lg:w-3/5"
              variants={headingContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
            >
              {headingText.split('').map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                  style={{ minWidth: char === ' ' ? '0.25em' : 'auto' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h1>

            {/* ===== RIGHT COLUMN CONTENT ===== */}
            <motion.div
              className="lg:w-2/5 flex flex-col items-start pt-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
            >
              {/* Description Text */}
              <motion.p
                className="text-blue-100 text-lg leading-relaxed mb-6 font-paraFont"
                variants={itemVariants}
              >
                Kairaa Blockchain is an Online Learning and Development Academy based in Coimbatore, Tamilnadu. We provide essential Technical, Communication, and Leadership skills.
              </motion.p>

              {/* Watch Video Button */}
              <motion.a
                href="https://youtu.be/2PIagAiL_a8?si=ZeeFlCzayKHcprTb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 cursor-pointer group"
                variants={buttonVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.5 }}
              >
                {/* Play Button Circle */}
                <motion.div
                  className="w-12 h-12 rounded-full bg-white text-[#1C1678] flex items-center justify-center pl-1 shadow-lg transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-white"
                  variants={playButtonCircleVariants}
                  initial="initial"
                  whileHover="whileHover"
                  whileTap="whileTap"
                >
                  <FaPlay size={16} />
                </motion.div>

                {/* Button Text */}
                <span className="font-semibold underline decoration-2 underline-offset-4 text-lg group-hover:opacity-80 transition-opacity">
                  Watch Video
                </span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overlapping Images & Logos */}
      <section className="bg-slate-50 pb-24 relative">
        {/* ===== TEAM IMAGES SECTION ===== */}
        <div className="container mx-auto max-w-6xl px-6 md:px-12 -mt-24 relative z-20 mb-24">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {images.map((src, index) => (
              <motion.div
                key={index}
                variants={imageVariants}
                className={index === 1 ? 'md:-mt-12' : ''}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={src}
                  alt={`Team ${index + 1}`}
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl border-4 border-white cursor-pointer"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ===== LOGOS/COLLABORATION SECTION ===== */}
        <div className="container mx-auto max-w-4xl px-6 md:px-12 text-center">
          {/* Heading with Letter Reveal */}
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-12 text-[#1C1678] font-headingFont"
            variants={headingContainerVariants2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
          >
            {headingText2.split('').map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants2}
                className="inline-block"
                style={{ minWidth: char === ' ' ? '0.25em' : 'auto' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h2>

          {/* Company Logos */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-12 md:gap-20"
            variants={logoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
          >
            {companies.map((company, index) => {
              const IconComponent = company.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-3xl font-bold text-slate-400 transition-colors cursor-pointer"
                  variants={logoItemVariants}
                  whileHover="whileHover"
                  initial="initial"
                  whileHover={{ scale: 1.08, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={company.color}
                  >
                    <IconComponent />
                  </motion.div>
                  <span className={`font-sans tracking-tighter transition-colors ${company.color}`}>
                    {company.name}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Big Quote */}
      <section className="py-24 bg-white">
        <motion.div
          className="container mx-auto max-w-4xl px-6 md:px-12 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-extrabold leading-tight mb-8 text-[#1C1678] font-headingFont"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.03 }
              }
            }}
          >
            {"“We guarantee to unlock the full potential of your skills, paving a path towards success.”".split("").map((char, index) => (
              <motion.span
                key={index}
                className="inline-block"
                style={{ minWidth: char === ' ' ? '0.25em' : 'auto' }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", damping: 12, stiffness: 200 }
                  }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p
            className="text-slate-500 font-bold text-lg"
            variants={itemVariants}
          >
            — Kairaa Blockchain Academy <span className="text-orange-400 mx-2">|</span> Empowering Leaders
          </motion.p>
        </motion.div>
      </section>

      {/* Founding Story & Vision/Mission */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-6 md:px-12">
          <motion.div
            className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            {/* ===== LEFT COLUMN - FOUNDING STORY ===== */}
            <motion.div className="flex-1" variants={leftContentVariants}>
              {/* Origin Label */}
              <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-3 block">
                Our Origins
              </span>

              {/* Founding Story Heading */}
              <h3 className="text-4xl font-extrabold mb-6 text-[#1C1678] font-headingFont">
                {foundingHeadingText}
              </h3>

              {/* First Paragraph */}
              <p className="text-slate-600 leading-relaxed text-lg mb-6 font-paraFont">
                {foundingStoryContent}
              </p>

              {/* Second Paragraph */}
              <p className="text-slate-600 leading-relaxed text-lg font-paraFont">
                {inspiringContent}
              </p>
            </motion.div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-px bg-slate-200"></div>

            {/* ===== RIGHT COLUMN - VISION & MISSION ===== */}
            <motion.div
              className="flex-1 flex flex-col gap-8"
              variants={cardVariants}
            >
              {/* ===== VISION BOX ===== */}
              <motion.div 
                className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:bg-white border border-transparent hover:border-slate-100"
                variants={visionMissionItemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <h4 className="text-2xl font-bold mb-4 text-[#1C1678]">
                  {visionTitle}
                </h4>

                {/* Vision Underline Bar */}
                <motion.div
                  className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-[#CB77F7] mb-6"
                  variants={underlineVariants}
                  style={{ transformOrigin: 'left' }}
                />

                <p className="text-slate-600 leading-relaxed text-sm font-paraFont">
                  To be a leading force in shaping a blockchain-powered world through education and innovation. By fostering a deep understanding of blockchain technology and driving groundbreaking advancements, we aim to empower individuals and organizations to harness its full potential for transformative impact.
                </p>
              </motion.div>

              {/* ===== MISSION BOX ===== */}
              <motion.div 
                className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:bg-white border border-transparent hover:border-slate-100"
                variants={visionMissionItemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <h4 className="text-2xl font-bold mb-4 text-[#1C1678]">
                  {missionTitle}
                </h4>

                {/* Mission Underline Bar */}
                <motion.div
                  className="w-12 h-1 bg-gradient-to-r from-orange-400 to-red-500 mb-6"
                  variants={underlineVariants}
                  style={{ transformOrigin: 'left' }}
                />

                <p className="text-slate-600 leading-relaxed text-sm font-paraFont">
                  To bridge the knowledge gap in blockchain technology by offering high-quality, industry-relevant education to a global audience. Through innovative learning experiences and expert-led courses, we aim to equip individuals with the skills and insights needed to excel in the evolving blockchain landscape.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Learn in-demand tech skills */}
      <section className="py-24 bg-[#1C1678] text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full opacity-20 blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500 rounded-full opacity-20 blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto max-w-6xl px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

            {/* Left: Sticky Sidebar */}
            <div className="lg:w-1/3 lg:sticky lg:top-32">
              <span className="text-orange-400 font-bold uppercase tracking-wider text-sm mb-3 block">Why Learn With Us</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight font-headingFont">
                Learn<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#CB77F7]">in-demand</span><br />
                tech skills
              </h2>
              <p className="text-blue-100 text-lg mb-10 leading-relaxed font-paraFont">
                Join us at Kairaa Blockchain Academy and take the first step towards a promising career in technology, all in the comfort of your mother tongue, Tamil. Let’s code தமிழில்!
              </p>
              <Link to="/course/othercourse">
                <button className="relative overflow-hidden bg-white text-[#1C1678] font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <span className="relative z-10 flex items-center text-lg">
                    Explore Courses
                  </span>
                </button>
              </Link>
            </div>

            {/* Right: Scrolling Cards */}
            <div className="lg:w-2/3 flex flex-col gap-6">
              {[
                { num: "01", text: "At Kairaa Blockchain Academy, we believe in the power of technology and the importance of making it accessible to everyone. We are proud to offer a range of courses on programming languages, all taught in Tamil." },
                { num: "02", text: "Our mission is to break down language barriers in tech education and empower our students to gain the skills they need to succeed in the rapidly evolving tech industry. We understand that learning in one’s native language can make complex concepts more digestible and enjoyable." },
                { num: "03", text: "Our curriculum includes courses on popular programming languages such as Python, JavaScript, Java, and C++, among others. Each course is designed with a practical approach, allowing students to learn by doing." },
                { num: "04", text: "Whether you are a beginner looking to start your coding journey or an experienced programmer aiming to enhance your skills, our courses cater to all levels of expertise." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-10 rounded-3xl hover:bg-white/20 transition-all duration-300 group">
                  <div className="text-5xl font-extrabold text-white/20 mb-4 group-hover:text-cyan-400 transition-colors font-headingFont">{item.num}</div>
                  <p className="text-xl text-blue-50 leading-relaxed font-paraFont">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Row */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 via-white to-purple-50 blur-3xl opacity-60 z-0" />
        
        <div className="container mx-auto max-w-6xl px-6 md:px-12 relative z-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center bg-white p-8 md:p-12 shadow-lg border border-slate-100 backdrop-blur-md"
            variants={statsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.div 
              className="flex flex-col items-center justify-center p-4"
              variants={statsItemVariants}
            >
              <motion.div 
                className="text-6xl text-[#1C1678] mb-6 drop-shadow-md cursor-pointer" 
                whileHover={{ scale: 1.2, rotate: [0, -15, 15, -15, 0], transition: { duration: 0.5 } }}
              >
                <LuGraduationCap />
              </motion.div>
              <p className="text-5xl font-extrabold text-[#1C1678] mb-2 font-headingFont"><AnimatedCounter to={1000} /></p>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Active Students</p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center justify-center p-4"
              variants={statsItemVariants}
            >
              <motion.div 
                className="text-6xl text-[#1C1678] mb-6 drop-shadow-md cursor-pointer" 
                whileHover={{ scale: 1.2, rotate: [0, -15, 15, -15, 0], transition: { duration: 0.5 } }}
              >
                <LuUsers />
              </motion.div>
              <p className="text-5xl font-extrabold text-[#1C1678] mb-2 font-headingFont"><AnimatedCounter to={10} /></p>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Mentors</p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center justify-center p-4"
              variants={statsItemVariants}
            >
              <motion.div 
                className="text-6xl text-[#1C1678] mb-6 drop-shadow-md cursor-pointer" 
                whileHover={{ scale: 1.2, rotate: [0, -15, 15, -15, 0], transition: { duration: 0.5 } }}
              >
                <LuBookOpen />
              </motion.div>
              <p className="text-5xl font-extrabold text-[#1C1678] mb-2 font-headingFont"><AnimatedCounter to={50} /></p>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Courses</p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center justify-center p-4"
              variants={statsItemVariants}
            >
              <motion.div 
                className="text-6xl text-[#1C1678] mb-6 drop-shadow-md cursor-pointer" 
                whileHover={{ scale: 1.2, rotate: [0, -15, 15, -15, 0], transition: { duration: 0.5 } }}
              >
                <LuAward />
              </motion.div>
              <p className="text-5xl font-extrabold text-[#1C1678] mb-2 font-headingFont"><AnimatedCounter to={20} /></p>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Awards</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-6 md:px-12">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.div className="lg:col-span-1" variants={itemVariants}>
              <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-3 block">Global Reach</span>
              <h3 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-[#1C1678] font-headingFont">World-Class Learning for Anyone, Anywhere</h3>
              <p className="text-slate-600 leading-relaxed font-paraFont text-lg">
                At Kairaa Blockchain Academy, we believe in the power of technology and the importance of making it accessible to everyone. We offer a range of courses taught in Tamil.
              </p>
            </motion.div>
            <motion.div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6" variants={containerVariants}>
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className={`p-10 rounded-3xl ${feature.bg} transition-transform hover:-translate-y-2 duration-300`}
                  variants={itemVariants}
                >
                  <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                  <p className="text-sm leading-relaxed opacity-90 font-paraFont">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-24 bg-slate-50">
        <motion.div 
          className="container mx-auto max-w-6xl px-6 md:px-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.div variants={teacherHeaderVariants}>
            <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-3 block">The Teachers</span>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-16 text-[#1C1678] font-headingFont">Meet Our Expert Faculty</h3>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            variants={teacherContainerVariants}
          >
            {teachers.map((teacher, idx) => (
              <motion.div 
                key={idx} 
                className="group cursor-pointer bg-white rounded-2xl shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
                variants={teacherCardVariants}
              >
                <div className="w-full aspect-square overflow-hidden relative bg-slate-100">
                  <img src={teacher.img} alt={teacher.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Social Icons Overlay */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                    <div className="w-10 h-10 rounded-full bg-white text-[#1C1678] flex items-center justify-center hover:bg-[#1C1678] hover:text-white transition-colors shadow-md">
                      <FaLinkedinIn />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white text-[#1C1678] flex items-center justify-center hover:bg-[#1C1678] hover:text-white transition-colors shadow-md">
                      <FaTwitter />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white text-[#1C1678] flex items-center justify-center hover:bg-[#1C1678] hover:text-white transition-colors shadow-md">
                      <FaGithub />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 relative bg-white">
                  <div className="w-12 h-1 bg-slate-200 mx-auto mb-4 group-hover:bg-cyan-500 transition-colors duration-500 rounded-full"></div>
                  <h4 className="text-xl font-bold text-[#1C1678] mb-1">{teacher.name}</h4>
                  <p className="text-sm font-medium text-slate-500 group-hover:text-cyan-600 transition-colors duration-300">{teacher.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50 text-center relative overflow-hidden border-t border-slate-100">
        {/* Subtle blur blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div
          className="container mx-auto max-w-4xl px-6 md:px-12 relative z-10"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <h3 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#1C1678] font-headingFont">
            Ready to Shape Your Future?
          </h3>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-paraFont max-w-2xl mx-auto">
            Join thousands of learners building real-world skills through expert-led training.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link to="/courses">
              <motion.button 
                className="bg-[#1C1678] text-white font-bold py-4 px-10 rounded-full shadow-lg transition-colors hover:bg-[#2a22a3] hover:shadow-2xl text-lg w-full sm:w-auto flex items-center justify-center"
                whileHover={{ y: -3, scale: 1.03 }}
              >
                Explore Courses
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button 
                className="bg-white text-[#1C1678] border-2 border-[#1C1678] font-bold py-4 px-10 rounded-full shadow-md transition-colors hover:bg-slate-50 hover:shadow-xl text-lg w-full sm:w-auto flex items-center justify-center"
                whileHover={{ y: -3, scale: 1.03 }}
              >
                Contact Us
              </motion.button>
            </Link>
          </div>

          <div className="pt-8 border-t border-slate-200/60 max-w-xl mx-auto">
            <p className="text-slate-500 font-medium">
              1000+ Students <span className="mx-2 text-cyan-500">•</span> 50+ Courses <span className="mx-2 text-cyan-500">•</span> 10+ Expert Mentors
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
