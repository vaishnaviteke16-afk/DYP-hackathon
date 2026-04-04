import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildProposalPrompt } from "../utils/promptBuilder.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateProposal = async (data) => {
  try {
    const prompt = buildProposalPrompt(data);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const response = result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini Error:", error);

    // 🔥 Fallback (VERY IMPORTANT)
    return `
Hello,

I am excited to work on your project "${data.projectTitle}".

I understand your requirements: ${data.description}

🔧 Approach:
I will build a clean, responsive, and user-friendly solution.

⏱️ Timeline:
Day 1-2: Planning & Design  
Day 3-5: Development & Testing  

💰 Cost:
₹${data.budget} based on features and complexity.

Looking forward to working with you!

Best regards,  
Student Freelancer
`;
  }
};
