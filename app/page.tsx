"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Shield, Phone, Users, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
export default function Home() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<{ id: string; url: string }[]>([]);
  const [customTimeActive, setCustomTimeActive] = useState(false);
  const [formData, setFormData] = useState({
    markets: [] as string[],
    agentType: "",
    agencySize: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    consent: false,
    marketingConsent: false,
    howSoon: "",
    monthlyBudget: "",
    contactMethod: "",
    bestTime: "",
  });
  const markets = [
    "Auto Insurance",
    "Medicare Supplement",
    "Final Expense",
    "Mortgage Protection",
    "ACA / Marketplace Health",
    "Turning 65 (T-65)",
    "Medicare Advantage",
  ];
  const trustPoints = [
    { icon: Users, text: "100% Social Media Generated" },
    { icon: Phone, text: "Phone-Verified Leads" },
    { icon: Shield, text: "TCPA-Compliant" },
    { icon: CheckCircle2, text: "Built for Licensed Agents" },
  ];
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);
  const scrollToForm = () => {
    document
      .getElementById("form-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  const toggleMarket = (market: string) => {
    setFormData((prev) => ({
      ...prev,
      markets: prev.markets.includes(market)
        ? prev.markets.filter((m) => m !== market)
        : [...prev.markets, market],
    }));
  };
  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        router.push("/thank-you");
        return;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-[#ededed] overflow-x-hidden">
      {/* Logo */}
      <div className="flex justify-center top-0">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={36}
          className=""
        />
      </div>
      {/* Hero Section */}
      <div
        id="form-section"
        className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-8 max-w-full"
      >
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start max-w-5xl mx-auto">
          {/* Left Side - Title */}
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight break-words">
              Close More Deals with Social-Generated,{" "}
              <span className="text-[#00d4ff]">Phone-Verified</span> Insurance
              Leads
            </h1>
            <p className="text-base text-gray-300 leading-relaxed">
              Exclusive, compliant insurance leads built for licensed agents and
              agencies.
            </p>
            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {trustPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-[#00d4ff] flex-shrink-0" />
                    <span className="text-sm text-gray-200">{point.text}</span>
                  </div>
                );
              })}
            </div>
            {/* CTA Button */}
            <button
              onClick={scrollToForm}
              className="mt-6 bg-[#00d4ff] text-[#0a0f1a] px-6 py-3 rounded-full font-semibold text-base hover:bg-[#00b8e6] transition-colors flex items-center space-x-2 w-fit"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          {/* Right Side - Multi-Step Form */}
          <div className="bg-gradient-to-br from-[#1e2740] to-[#151d30] rounded-2xl p-4 sm:p-6 shadow-[0_0_50px_rgba(0,212,255,0.15)] border-2 border-[#00d4ff]/30 w-full max-w-full backdrop-blur-sm">
            {/* Progress Indicator */}
            <div className="flex justify-between mb-6">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
                      currentStep >= step
                        ? "bg-gradient-to-br from-[#00d4ff] to-[#00b8e6] text-[#0a0f1a]"
                        : "bg-gray-700/50 text-gray-400 border border-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-1.5 mx-2 rounded-full ${
                        currentStep > step
                          ? "bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]"
                          : "bg-gray-700/50"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Markets Served */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-4">
                    Markets Served
                  </h2>
                  <div className="space-y-2">
                    {markets.map((market) => (
                      <label
                        key={market}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={formData.markets.includes(market)}
                          onChange={() => toggleMarket(market)}
                          className="w-4 h-4 rounded border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-[#0f172a]"
                        />
                        <span className="text-sm group-hover:text-[#00d4ff] transition-colors">
                          {market}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={formData.markets.length === 0}
                    className="w-full mt-6 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
              {/* Step 2: Agent Type */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-4">
                    Agent Type
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="agentType"
                        value="Individual Agent"
                        checked={formData.agentType === "Individual Agent"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agentType: e.target.value,
                            agencySize: "",
                          })
                        }
                        className="w-4 h-4 border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-[#0f172a]"
                      />
                      <span className="text-sm group-hover:text-[#00d4ff] transition-colors">
                        Individual Agent
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="agentType"
                        value="Agency"
                        checked={formData.agentType === "Agency"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agentType: e.target.value,
                          })
                        }
                        className="w-4 h-4 border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-[#0f172a]"
                      />
                      <span className="text-sm group-hover:text-[#00d4ff] transition-colors">
                        Agency
                      </span>
                    </label>
                    {formData.agentType === "Agency" && (
                      <div className="ml-7 space-y-2 mt-3">
                        {[
                          "2–5 agents",
                          "6–15 agents",
                          "16–50 agents",
                          "50+ agents",
                        ].map((size) => (
                          <label
                            key={size}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="agencySize"
                              value={size}
                              checked={formData.agencySize === size}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  agencySize: e.target.value,
                                })
                              }
                              className="w-4 h-4 border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-[#0f172a]"
                            />
                            <span className="text-sm group-hover:text-[#00d4ff] transition-colors">
                              {size}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        !formData.agentType ||
                        (formData.agentType === "Agency" &&
                          !formData.agencySize)
                      }
                      className="flex-1 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
             {/* Step 3: Contact Info */}
{currentStep === 3 && (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-center mb-4">
      Contact Information
    </h2>
    <div className="space-y-3">
      {/* First Name */}
      <div>
        <label className="block text-xs font-medium mb-1.5">
          First Name
        </label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({
              ...formData,
              firstName: e.target.value,
            })
          }
          className="w-full px-3 py-2 text-sm bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
          required
        />
      </div>
      {/* Last Name */}
      <div>
        <label className="block text-xs font-medium mb-1.5">
          Last Name
        </label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({
              ...formData,
              lastName: e.target.value,
            })
          }
          className="w-full px-3 py-2 text-sm bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
          required
        />
      </div>
      {/* Email */}
      <div>
        <label className="block text-xs font-medium mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
          className="w-full px-3 py-2 text-sm bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
          required
        />
      </div>
      {/* Phone */}
      <div>
        <label className="block text-xs font-medium mb-1.5">
          Mobile Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData({
              ...formData,
              phone: e.target.value,
            })
          }
          className="w-full px-3 py-2 text-sm bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
          required
        />
        <p className="mt-2 text-[11px] text-gray-400 leading-5">
  By providing your mobile phone number, you may optionally opt in to
  receive SMS communications from{" "}
  <strong>LeadStream Hub LLC</strong> by selecting your preferred
  consent options during the final step of this form.
</p>
      </div>
    </div>
    <div className="flex gap-3 mt-6">
      <button
        type="button"
        onClick={handleBack}
        className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
      >
        Back
      </button>
      <button
        type="button"
        onClick={handleNext}
        disabled={
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.phone
        }
        className="flex-1 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
)}
              {/* Step 4: Lead Qualifications */}
              {currentStep === 4 && (
                <div className="space-y-4 text-left">
                  <h2 className="text-xl font-bold text-center mb-4">
                    Lead Preferences
                  </h2>
                  <div className="space-y-4">
                    {/* How Soon */}
                    <div>
                      <label className="block text-xs font-semibold text-[#00d4ff] mb-2">
                        How soon are you looking to start?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Immediately", "Within 7 Days", "Within 30 Days", "Just Researching"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, howSoon: option })}
                            className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-center ${
                              formData.howSoon === option
                                ? "bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]"
                                : "bg-[#0a0f1a] border-gray-800 text-gray-300 hover:border-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Monthly Lead Budget */}
                    <div>
                      <label className="block text-xs font-semibold text-[#00d4ff] mb-2">
                        What is your monthly lead budget?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Under $500", "$500 - $1,500", "$1,500 - $5,000", "$5,000+"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, monthlyBudget: option })}
                            className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-center ${
                              formData.monthlyBudget === option
                                ? "bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]"
                                : "bg-[#0a0f1a] border-gray-800 text-gray-300 hover:border-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Preferred Contact Method */}
                    <div>
                      <label className="block text-xs font-semibold text-[#00d4ff] mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Call Me Now", "Text Me First", "Email Me Information", "Schedule a Call"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              const updatedData = { ...formData, contactMethod: option };
                              if (option !== "Schedule a Call") {
                                updatedData.bestTime = "";
                                setCustomTimeActive(false);
                              }
                              setFormData(updatedData);
                            }}
                            className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-center ${
                              formData.contactMethod === option
                                ? "bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]"
                                : "bg-[#0a0f1a] border-gray-800 text-gray-300 hover:border-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Best Time to Reach (Conditional) */}
                    {formData.contactMethod === "Schedule a Call" && (
                      <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-xs font-semibold text-[#00d4ff] mb-2">
                          Best Time to Reach You
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Morning (9 AM - 12 PM)",
                            "Afternoon (12 PM - 5 PM)",
                            "Evening (5 PM - 8 PM)",
                          ].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                setCustomTimeActive(false);
                                setFormData({ ...formData, bestTime: preset });
                              }}
                              className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-center ${
                                !customTimeActive && formData.bestTime === preset
                                  ? "bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]"
                                  : "bg-[#0a0f1a] border-gray-800 text-gray-300 hover:border-gray-700"
                              }`}
                            >
                              {preset.split(" (")[0]}
                              <span className="block text-[10px] text-gray-400 font-normal">
                                {preset.includes("(") ? preset.substring(preset.indexOf("(")) : ""}
                              </span>
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setCustomTimeActive(true);
                              setFormData({ ...formData, bestTime: "" });
                            }}
                            className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-center ${
                              customTimeActive
                                ? "bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]"
                                : "bg-[#0a0f1a] border-gray-800 text-gray-300 hover:border-gray-700"
                            }`}
                          >
                            Custom
                            <span className="block text-[10px] text-gray-400 font-normal">
                              Enter own time
                            </span>
                          </button>
                        </div>
                        {customTimeActive && (
                          <input
                            type="text"
                            placeholder="e.g. Tomorrow 3 PM, weekends only"
                            value={formData.bestTime}
                            onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                            className="w-full px-3 py-2 mt-2 text-sm bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white placeholder-gray-500 animate-in fade-in slide-in-from-top-1 duration-200"
                            required
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        !formData.howSoon ||
                        !formData.monthlyBudget ||
                        !formData.contactMethod ||
                        (formData.contactMethod === "Schedule a Call" && !formData.bestTime)
                      }
                      className="flex-1 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {/* Step 5: Consent */}
{currentStep === 5 && (
  <div className="space-y-4 text-left">
    <h2 className="text-xl font-bold text-center mb-4">
      Review & Consent
    </h2>
    <div className="bg-[#0a0f1a] p-4 rounded-lg space-y-3 border border-gray-800">
      <div>
        <p className="text-xs text-gray-400 mb-1">Markets:</p>
        <p className="text-sm text-white">
          {formData.markets.join(", ")}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Agent Type:</p>
        <p className="text-sm text-white">
          {formData.agentType}
          {formData.agencySize && ` (${formData.agencySize})`}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Contact:</p>
        <p className="text-sm text-white">
          {formData.firstName} {formData.lastName}
        </p>
        <p className="text-sm text-white">{formData.email}</p>
        <p className="text-sm text-white">{formData.phone}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">
          Preferences & Budget:
        </p>
        <p className="text-sm text-white">
          Start: {formData.howSoon}
        </p>
        <p className="text-sm text-white">
          Budget: {formData.monthlyBudget}
        </p>
        <p className="text-sm text-white">
          Contact: {formData.contactMethod}
          {formData.contactMethod === "Schedule a Call" &&
            formData.bestTime &&
            ` (${formData.bestTime})`}
        </p>
      </div>
    </div>
    <div className="bg-[#0a0f1a] border border-[#00d4ff]/30 rounded-lg p-4">
      <p className="text-sm font-semibold text-white mb-4">
        SMS Consent & Authorization
      </p>
      <p className="text-xs text-gray-400 mb-4">
        Selecting either checkbox below is completely optional and is not required to submit this form.
      </p>
      {/* Non-Marketing Consent (Optional) */}
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.consent}
          onChange={(e) =>
            setFormData({
              ...formData,
              consent: e.target.checked,
            })
          }
          className="w-4 h-4 mt-1 rounded border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff]"
        />
        <span className="text-xs text-gray-300 leading-6">
          I consent to receive non-marketing text messages from{" "}
<strong>LeadStream Hub LLC</strong> regarding:

<br /><br />

- Insurance lead inquiry follow-ups
<br />
- Customer support communications
<br />
- Requested consultation scheduling
<br />
- Service-related updates

<br /><br />

Message frequency may vary.

<br />

Message & data rates may apply.

<br />

Text <strong>HELP</strong> for assistance.

<br />

Reply <strong>STOP</strong> to opt out.

<br /><br />

Consent to receive SMS messages is not required as a condition of
purchasing any product or service.

<br /><br />

          I acknowledge that I have reviewed the{" "}
          <a
href="https://leadstreamhub.com/privacy-policy"
            target="https://leadstreamhub.com/privacy-policy/"
            rel="noopener noreferrer"
            className="text-[#00d4ff] underline"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="/sms-terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00d4ff] underline"
          >
            SMS Terms of Service
          </a>.
        </span>
      </label>
      {/* Optional Marketing Consent */}
      <label className="flex items-start space-x-3 mt-5 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.marketingConsent}
          onChange={(e) =>
            setFormData({
              ...formData,
              marketingConsent: e.target.checked,
            })
          }
          className="w-4 h-4 mt-1 rounded border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff]"
        />
        <span className="text-xs text-gray-400 leading-6">
  I consent to receive marketing text messages from{" "}
  <strong>LeadStream Hub LLC</strong> regarding:

  <br /><br />

  - Promotional announcements
  <br />
  - Special offers
  <br />
  - New services
  <br />
  - Company updates

  <br /><br />

  Message frequency may vary.

  <br />

  Message & data rates may apply.

  <br />

  Text <strong>HELP</strong> for assistance.

  <br />

  Reply <strong>STOP</strong> to opt out.

  <br /><br />

  This consent is optional and is not required to submit this form.

  <br /><br />

  Marketing SMS messages are sent only to individuals who separately
  opt in.

  <br /><br />

  Marketing SMS communications may include promotional announcements,
  special offers, new services, and company updates.

  <br /><br />

  Consent to receive marketing SMS messages is not required to
  purchase any products or services.
</span>
      </label>
    </div>
    <div className="flex gap-3 mt-6">
      <button
        type="button"
        onClick={handleBack}
        className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="flex-1 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit & Get Contacted"}
      </button>
    </div>
  </div>
)}
            </form>
          </div>
        </div>
      </div>
      {/* Reviews Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-16 max-w-full">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mb-12 break-words">
          Reviews From Clients
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No reviews available yet
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <Image
                  src={review.url}
                  alt={`Review ${index + 1}`}
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-full">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} LeadStream Hub LLC. All rights reserved.{" "}
            •{" "}
            <a href="/privacy-policy" className="underline hover:text-white">
              Privacy Policy
            </a>{" "}
            •{" "}
            <a href="/sms-terms" className="underline hover:text-white">
              SMS Terms
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
