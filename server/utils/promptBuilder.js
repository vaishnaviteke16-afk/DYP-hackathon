export const buildProposalPrompt = ({
  projectTitle,
  description,
  budget,
  skills,
  userAnswers = {},
}) => {
  return `
You are an expert freelance proposal writer.

Your task is to generate a HIGH-QUALITY, PROFESSIONAL, and CLIENT-WINNING proposal for a student freelancer.

The proposal must be:
- Personalized
- Well-structured
- Easy to read
- Human-like (not robotic)
- Confident but friendly

----------------------------
📌 PROJECT DETAILS
----------------------------
Title: ${projectTitle}
Description: ${description}
Budget: ₹${budget}
Required Skills: ${skills}

----------------------------
🎯 USER PREFERENCES
----------------------------
Solution Type: ${userAnswers.solutionType || "Not specified"}
Key Features: ${userAnswers.features || "Not specified"}
Timeline Preference: ${userAnswers.timeline || "Flexible"}
Budget Flexibility: ${userAnswers.budgetFlexibility || "Flexible"}
Extra Requirements: ${userAnswers.extra || "None"}

----------------------------
📝 INSTRUCTIONS
----------------------------
Generate the proposal with the following structure:

1. Greeting
2. Project Understanding
3. Proposed Solution (based on user preferences)
4. Key Features (bullet points)
5. Timeline (clear breakdown)
6. Cost Explanation (aligned with budget)
7. Why Choose Me (student-focused confidence)
8. Closing Statement

----------------------------
✨ FORMATTING RULES
----------------------------
- Use clear section headings like:
  "Project Understanding:", "Proposed Solution:", etc.
- Use bullet points for features
- Keep paragraphs short and clean
- Make it visually structured (important for UI rendering)
- Do NOT use markdown symbols like ** or ##
- Write headings in plain text followed by colon

----------------------------
🎯 STYLE
----------------------------
- Professional but friendly
- Confident student tone
- Avoid generic phrases
- Make it sound like a real freelancer wrote it

----------------------------
🚀 OUTPUT
----------------------------
Generate ONLY the proposal text.
Do not include any explanations.
`;
};
