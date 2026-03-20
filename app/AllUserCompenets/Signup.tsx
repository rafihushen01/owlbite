"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { 
  Eye, EyeOff, Mail, User, Phone, MapPin, 
  ChevronRight, ChevronLeft, Loader2, 
} from "lucide-react";
import owlbitelogo from "../../public/owlbite.png";
import { serverurl } from "../utils/url";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullname: "", email: "", gender: "", mobile: "", otp: "", password: "", address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= API HANDLERS =================
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${serverurl}/api/auth/signup/otp`, {
        fullname: formData.fullname,
        email: formData.email,
        gender: formData.gender,
        mobile: formData.mobile,
      });
      toast.success("OTP sent to your email! 🦉");
      nextStep();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong sending OTP");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${serverurl}/api/auth/signup/otp/verify`, {
        email: formData.email,
        otp: formData.otp,
      });
      toast.success("OTP Verified! Let's wrap this up. 🍕");
      nextStep();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid OTP entered");
    } finally { setLoading(false); }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${serverurl}/api/auth/signup/complete`, {
        email: formData.email,
        password: formData.password,
        address: { fulladdress: formData.address },
      }, { withCredentials: true });
      toast.success("Welcome to OwlBite! 🍔 Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  // ================= ANIMATION VARIANTS =================
  const pageVariants: Variants = {
    initial: { x: 40, opacity: 0, scale: 0.95 },
    animate: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
    exit: { x: -40, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const floatVariant: Variants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Background ambient glow for extra "juiciness" */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-400/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Left: Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')] animate-[pulse_10s_ease-in-out_infinite]"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center text-white p-12"
        >
          <motion.div variants={floatVariant} animate="animate">
            <Image src={owlbitelogo} alt="OwlBite" width={220} height={220} className="mx-auto  cursor-pointer mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
          </motion.div>
          <h1 className="text-6xl font-black mb-4 uppercase tracking-tighter drop-shadow-md">OwlBite</h1>
          <p className="text-2xl font-semibold opacity-90 drop-shadow-sm tracking-wide">Craving something juicy?</p>
          <p className="text-lg opacity-80 mt-2">Thousands of hot meals waiting for you.</p>
        </motion.div>
      </div>

      {/* Right: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white/80 backdrop-blur-xl z-10 relative shadow-[-20px_0_50px_rgba(0,0,0,0.05)]">
        
        {/* Mobile-only Logo ensuring cross-device visibility */}
        <motion.div 
          variants={floatVariant} animate="animate"
          className="lg:hidden mb-6 flex flex-col items-center"
        >
          <Image src={owlbitelogo} alt="OwlBite" width={100} height={100} className="drop-shadow-xl" />
        </motion.div>

        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Join OwlBite</h2>
            <p className="text-zinc-500 mt-2 font-medium">Get ready to satisfy your cravings.</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                onSubmit={handleRequestOtp} className="space-y-4"
              >
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                  <input name="fullname" type="text" placeholder="Full Name" required onChange={handleChange} value={formData.fullname} className="w-full text-zinc-900 pl-12 pr-4 py-4 bg-zinc-100 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-2xl outline-none transition-all font-medium placeholder:text-zinc-400" />
                </div>
                
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                  <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} value={formData.email} className="w-full pl-12 pr-4 py-4 bg-zinc-100 text-zinc-900 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-2xl outline-none transition-all font-medium placeholder:text-zinc-400" />
                </div>
                
                <div className="flex gap-4">
                   <select name="gender" onChange={handleChange} required value={formData.gender} className="w-1/3 px-4 py-4 text-zinc-700 bg-zinc-100 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-2xl outline-none transition-all font-medium cursor-pointer">
                      <option value="" disabled>Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                   </select>
                   <div className="relative group w-2/3">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                     <input name="mobile" type="tel" placeholder="Mobile Number" required onChange={handleChange} value={formData.mobile} className="w-full text-zinc-900 pl-12 pr-4 py-4 bg-zinc-100 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-2xl outline-none transition-all font-medium placeholder:text-zinc-400" />
                   </div>
                </div>

                <div className="text-xs text-zinc-500 text-center py-2">
                  By continuing, you agree to OwlBite's <Link href="/owlbite/privacypolicy" className="text-orange-600 hover:text-orange-500 font-bold underline decoration-orange-200 underline-offset-2 transition-colors">Privacy Policy</Link>.
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading} 
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_25px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center overflow-hidden relative"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                  {loading ? <Loader2 className="animate-spin" /> : <>Get OTP <ChevronRight size={20} className="ml-1" /></>}
                </motion.button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                onSubmit={handleVerifyOtp} className="space-y-6"
              >
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
                  <p className="text-sm font-semibold text-orange-800">We sent a tasty code to:</p>
                  <p className="text-orange-600 font-black tracking-wide mt-1">{formData.email}</p>
                </div>
                
                <input name="otp" type="text" placeholder="0 0 0 0 0 0" required onChange={handleChange} value={formData.otp} className="w-full px-6 py-5 text-zinc-900 bg-zinc-100 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-3xl tracking-[0.4em] text-center placeholder:text-zinc-300" />
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgba(249,115,22,0.3)] flex justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
                </motion.button>
                <button type="button" onClick={prevStep} className="w-full py-2 text-zinc-500 font-bold hover:text-zinc-800 transition-colors flex items-center justify-center">
                  <ChevronLeft size={18} className="mr-1" /> Change Email
                </button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form 
                key="step3" variants={pageVariants} initial="initial" animate="animate"
                onSubmit={handleCompleteSignup} className="space-y-4"
              >
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                  <input name="address" placeholder="Delivery Address (Where to send the food!)" required onChange={handleChange} value={formData.address} className="w-full pl-12 pr-4 py-4 bg-zinc-100 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-2xl outline-none transition-all font-medium text-zinc-900 placeholder:text-zinc-400" />
                </div>
                
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors">
                    <Loader2 size={20} className={loading ? "animate-spin" : ""} />
                  </span>
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" required onChange={handleChange} value={formData.password} className="w-full pl-12 pr-12 py-4 bg-zinc-100 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-2xl outline-none transition-all font-medium text-zinc-900 placeholder:text-zinc-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-500 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading}
                  className="w-full py-4 mt-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_25px_rgba(249,115,22,0.4)] transition-all flex justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Serve It Up! 🍽️"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Bottom Sign-in Link */}
          <div className="mt-8 pt-6 justify-between  border-t border-zinc-100 text-center">
            <p className="text-zinc-600 font-medium">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-orange-600 font-bold hover:text-orange-500 transition-colors">
                Sign In
              </Link>
            </p>
           
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default Signup;
