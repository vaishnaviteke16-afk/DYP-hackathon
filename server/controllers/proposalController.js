import { generateProposal as aiGenerateProposal } from "../services/proposalService.js";

export const createProposal = async (req, res) => {
  try {
    const {
      projectTitle,
      description,
      budget,
      skills,
      userAnswers, 
    } = req.body;

    // 🧠 Basic validation
    if (!projectTitle || !description) {
      return res.status(400).json({
        error: "Project title and description are required",
      });
    }

    // 🚀 Call AI Service
    const proposal = await aiGenerateProposal({
      projectTitle,
      description,
      budget,
      skills,
      userAnswers, 
    });

    res.status(200).json({ proposal });

  } catch (error) {
    console.error("Controller Error:", error);

    res.status(500).json({
      error: "Failed to generate proposal",
    });
  }
};
