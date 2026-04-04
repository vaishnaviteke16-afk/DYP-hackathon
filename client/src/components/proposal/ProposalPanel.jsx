import React, { useState } from "react";
import GenerateButton from "./GenerateButton";
import ProposalDisplay from "./ProposalDisplay";
import ProposalEditor from "./ProposalEditor";
import LoadingSpinner from "./LoadingSpinner";
import { X, Layout } from "lucide-react";
import "./proposal.css";

const API = "http://localhost:5000";

const ProposalPanel = ({ project, onClose }) => {
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem("token");

  // 🧠 Answers State
  const [answers, setAnswers] = useState({
    solutionType: "",
    features: "",
    timeline: "",
    budgetFlexibility: "",
    extra: "",
  });

  // 🧠 Handle Input Change
  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 Generate Proposal
  const generateProposal = async () => {
    if (!answers.solutionType || !answers.features) {
      alert("Please fill required fields!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/proposal/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectTitle: project.title,
          description: project.description,
          budget: project.budget,
          skills: project.skillsRequired?.join(", "),
          userAnswers: answers,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate proposal");
      setProposal(data.proposal);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="proposal-panel max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
            <Layout size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">AI Proposal Generator</h2>
        </div>

        {/* Project Info */}
        <div className="project-box">
          <h3>{project.title}</h3>
          <p className="line-clamp-2">{project.description}</p>
          <span className="budget">₹{project.budget} Budget</span>
        </div>

        {!proposal && !loading && (
          <>
            {/* 🎯 QUESTIONS UI */}
            <div className="question-box text-left">
              <h3>🎯 Customize Your Proposal</h3>

              {/* Solution Type */}
              <label>Type of Solution *</label>
              <select name="solutionType" onChange={handleChange} value={answers.solutionType}>
                <option value="">Select</option>
                <option value="Web App">Web Application</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Full Stack">Full Stack Development</option>
                <option value="Backend Integration">Backend Integration</option>
              </select>

              {/* Features */}
              <label>Key Features *</label>
              <input
                type="text"
                name="features"
                placeholder="Login, Dashboard, Payment Integration..."
                onChange={handleChange}
                value={answers.features}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label>Timeline</label>
                  <select name="timeline" onChange={handleChange} value={answers.timeline}>
                    <option value="">Select</option>
                    <option value="3-5 days">3–5 Days</option>
                    <option value="1 week">1 Week</option>
                    <option value="2 weeks">2 Weeks</option>
                    <option value="1 month">1 Month</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label>Budget Flexibility</label>
                  <select name="budgetFlexibility" onChange={handleChange} value={answers.budgetFlexibility}>
                    <option value="">Select</option>
                    <option value="Fixed">Fixed Price</option>
                    <option value="Negotiable">Negotiable</option>
                    <option value="Hourly">Hourly Rate</option>
                  </select>
                </div>
              </div>

              {/* Extra */}
              <label>Additional Requirements (Optional)</label>
              <textarea
                name="extra"
                placeholder="Tell the AI any specific points you want mentioned..."
                onChange={handleChange}
                value={answers.extra}
              ></textarea>
            </div>

            {/* Generate Button */}
            <GenerateButton onClick={generateProposal} />
          </>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Proposal */}
        {!loading && proposal && !editMode && (
          <ProposalDisplay
            proposal={proposal}
            onEdit={() => setEditMode(true)}
          />
        )}

        {/* Editor */}
        {editMode && (
          <ProposalEditor
            proposal={proposal}
            setProposal={setProposal}
            onSave={() => setEditMode(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProposalPanel;
