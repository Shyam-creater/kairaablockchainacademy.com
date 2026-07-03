import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { GlassPanel, NeonButton } from '../components/ui/NeonUI';
import { FaGraduationCap, FaEnvelope, FaLinkedin, FaTwitter, FaChalkboardTeacher } from 'react-icons/fa';

const InstructorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real application, you would use an RTK Query hook like:
  // const { data, isLoading } = useGetInstructorInfoQuery(id);
  
  useEffect(() => {
    // Mocking an API call to fetch instructor details
    setTimeout(() => {
      setInstructor({
        _id: id,
        name: "Dr. Alex Nakamoto",
        title: "Lead Blockchain Architect & Senior Instructor",
        avatar: "https://i.pravatar.cc/300?img=11",
        bio: "Dr. Nakamoto is a pioneer in Smart Contract development with over 10 years of experience in cryptographic security and distributed ledger technologies. He has audited over 50 enterprise-grade smart contracts and leads the core curriculum at Kairaa Blockchain Academy.",
        stats: {
          courses: 8,
          students: 12400,
          rating: 4.9
        },
        social: {
          email: "alex.nakamoto@kairaa.edu",
          linkedin: "https://linkedin.com",
          twitter: "https://twitter.com"
        },
        taughtCourses: [
          { id: "1", title: "Advanced Smart Contract Security", level: "Expert" },
          { id: "2", title: "DeFi Protocol Architecture", level: "Advanced" },
          { id: "3", title: "Blockchain Fundamentals", level: "Beginner" }
        ]
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Instructor Not Found</h2>
          <NeonButton variant="primary" onClick={() => navigate(-1)}>Go Back</NeonButton>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <Header />
      
      <div className="flex-1 relative pt-24 pb-16 px-4 md:px-8">
        {/* Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="mb-8 text-primary hover:text-white transition-colors text-sm font-bold tracking-wide flex items-center gap-2"
          >
            ← Back to Course
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
              <GlassPanel glow="border-t-2 border-t-primary" className="p-8 text-center sticky top-24">
                <div className="w-40 h-40 mx-auto rounded-full p-1 bg-gradient-to-tr from-primary to-accent shadow-[0_0_30px_rgba(0,242,254,0.3)] mb-6">
                  <div className="w-full h-full rounded-full border-4 border-[#0B0F19] overflow-hidden">
                    <img src={instructor.avatar} alt={instructor.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <h1 className="text-2xl font-extrabold text-white mb-2">{instructor.name}</h1>
                <p className="text-sm text-primary font-bold uppercase tracking-wider mb-6">{instructor.title}</p>
                
                <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-6 mb-6">
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-white mb-1">{instructor.stats.courses}</h4>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Courses</p>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <h4 className="text-xl font-bold text-white mb-1">{instructor.stats.students.toLocaleString()}</h4>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Students</p>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <h4 className="text-xl font-bold text-white mb-1">{instructor.stats.rating}</h4>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Rating</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a href={`mailto:${instructor.social.email}`} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm font-medium">
                    <FaEnvelope className="text-slate-400" /> Contact Instructor
                  </a>
                  <div className="flex justify-center gap-4 mt-2">
                    <a href={instructor.social.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all">
                      <FaLinkedin />
                    </a>
                    <a href={instructor.social.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all">
                      <FaTwitter />
                    </a>
                  </div>
                </div>
              </GlassPanel>
            </div>

            {/* Right Column: Details & Courses */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              <GlassPanel className="p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-primary" /> About the Instructor
                </h2>
                <p className="text-slate-300 leading-relaxed text-sm/7">
                  {instructor.bio}
                </p>
              </GlassPanel>

              <GlassPanel className="p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaChalkboardTeacher className="text-accent" /> Courses Taught
                </h2>
                <div className="flex flex-col gap-4">
                  {instructor.taughtCourses.map(course => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl hover:border-accent/50 transition-colors group cursor-pointer">
                      <div>
                        <h4 className="text-white font-bold group-hover:text-accent transition-colors">{course.title}</h4>
                        <span className={`text-[10px] uppercase tracking-widest font-bold mt-2 inline-block px-2 py-1 rounded-md ${
                          course.level === 'Beginner' ? 'bg-[#00e676]/10 text-[#00e676]' : 
                          course.level === 'Advanced' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {course.level} Level
                        </span>
                      </div>
                      <NeonButton variant="secondary" className="!px-4 !py-2 !text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        View Course
                      </NeonButton>
                    </div>
                  ))}
                </div>
              </GlassPanel>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InstructorProfile;
