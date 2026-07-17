import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLoadUserQuery } from '../../redux/features/api/apiSlice';

import HeroSection from './CourseDetails/HeroSection';
import { useSelector } from 'react-redux';
import SidebarPurchaseCard from './CourseDetails/SidebarPurchaseCard';
import CourseStats from './CourseDetails/CourseStats';
import LearningOutcomes from './CourseDetails/LearningOutcomes';
import SkillsAndTools from './CourseDetails/SkillsAndTools';
import CourseRoadmap from './CourseDetails/CourseRoadmap';
import CareerOpportunities from './CourseDetails/CareerOpportunities';
import Prerequisites from './CourseDetails/Prerequisites';
import CourseResources from './CourseDetails/CourseResources';
import CertificatePreview from './CourseDetails/CertificatePreview';
import { FooterCTA } from './CourseDetails/AdditionalSections';

const CourseDetails = ({ data, currentUser }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData?.user) {
      setIsPurchased(userData.user.courses.some((c) => c._id === data._id));
    }
  }, [userData, data]);

  const paymentHandler = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login"); return; }
    try {
      const { data: keyData } = await axios.get(`${process.env.REACT_APP_PUBLIC_SERVER_URI}/payment/razorpaypublishablekey`, { withCredentials: true });
      const orderAmount = Math.round(data.price * 100);
      const { data: orderResponse } = await axios.post(`${process.env.REACT_APP_PUBLIC_SERVER_URI}/createorder`, { couresId: data._id, data: { amount: orderAmount, currency: "INR" } }, { withCredentials: true });
      
      const options = {
        key: keyData.publishablekey,
        amount: orderAmount,
        currency: "INR",
        name: "Kairaa Blockchain Academy", 
        description: data.name,
        order_id: orderResponse.id, 
        handler: async function (response) { 
          await axios.post(`${process.env.REACT_APP_PUBLIC_SERVER_URI}/verifyorder`, { response, couresId: data._id }, { withCredentials: true });
          toast.success("Payment successful!"); 
          refetch();
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) { toast.error("Payment failed"); }
  };

  const handleEnrollFree = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login"); return; }
    try {
      await axios.post(`${process.env.REACT_APP_PUBLIC_SERVER_URI}/createorder`, { couresId: data._id, data: { amount: 0, currency: "INR" } }, { withCredentials: true });
      toast.success("Enrolled successfully!");
      refetch();
    } catch (error) { toast.error("Enrollment failed"); }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 font-poppins selection:bg-primary/30">
      <HeroSection data={data} />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-4">
            <CourseStats data={data} />
            <LearningOutcomes data={data} />
            <SkillsAndTools data={data} />
            <CourseRoadmap data={data} />
            <CareerOpportunities data={data} />
            <Prerequisites data={data} />
            <CourseResources data={data} />
            <CertificatePreview data={data} />
          </div>

          {/* Sticky Right Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28">
              <SidebarPurchaseCard 
                data={data} 
                isPurchased={isPurchased}
                paymentHandler={paymentHandler}
                handleEnrollFree={handleEnrollFree}
              />
            </div>
          </div>

        </div>
        
        <FooterCTA 
          data={data} 
          paymentHandler={paymentHandler}
          handleEnrollFree={handleEnrollFree}
        />
      </div>
    </div>
  );
};

export default CourseDetails;
