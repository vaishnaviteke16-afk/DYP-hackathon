import React from "react";
import { Check } from "lucide-react";

const ProposalEditor = ({ proposal, setProposal, onSave }) => {
  return (
    <div className="proposal-editor">
      <div className="header">
        <h2 className="main-title font-black text-blue-600">Edit Proposal</h2>
        <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition">
          <Check size={16} /> Save Changes
        </button>
      </div>
      <textarea
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        className="w-full h-80 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
};

export default ProposalEditor;
