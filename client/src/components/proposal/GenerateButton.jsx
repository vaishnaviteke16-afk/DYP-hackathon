import React from "react";
import { Sparkles } from "lucide-react";

const GenerateButton = ({ onClick }) => {
  return (
    <button className="generate-btn" onClick={onClick}>
      <Sparkles className="w-5 h-5 mr-2 inline" />
      Generate AI Proposal
    </button>
  );
};

export default GenerateButton;
