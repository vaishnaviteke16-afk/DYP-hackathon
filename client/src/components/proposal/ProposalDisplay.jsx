import React from "react";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { FileDown, Edit3 } from "lucide-react";

const ProposalDisplay = ({ proposal, onEdit }) => {
  // 📄 Function to Download as .docx
  const downloadAsDocx = () => {
    const lines = proposal.split("\n");
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: lines.map((line) => {
            const isHeading = line.includes(":");
            return new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 200, after: 120 },
              children: [
                new TextRun({
                  text: line,
                  bold: isHeading,
                  size: isHeading ? 28 : 24,
                  font: "Calibri",
                }),
              ],
            });
          }),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Proposal.docx");
    });
  };

  // ✨ Function to Format Proposal in UI
  const formatProposal = (text) => {
    return text.split("\n").map((line, index) => {
      if (line.includes(":")) {
        return (
          <h3 key={index} className="section-heading">
            {line}
          </h3>
        );
      }
      if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
        return (
          <li key={index} className="bullet-point">
            {line.replace(/^[•-]\s*/, "")}
          </li>
        );
      }
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className="proposal-display">
      <div className="header">
        <h2 className="main-title font-black uppercase tracking-tight">Generated Proposal</h2>
        <button onClick={onEdit} className="edit-btn flex items-center gap-2">
          <Edit3 size={14} /> Edit
        </button>
      </div>

      <div className="proposal-content text-left">{formatProposal(proposal)}</div>

      <div className="actions">
        <button onClick={downloadAsDocx} className="download-btn">
          <FileDown size={18} /> Download as Word (.docx)
        </button>
      </div>
    </div>
  );
};

export default ProposalDisplay;
