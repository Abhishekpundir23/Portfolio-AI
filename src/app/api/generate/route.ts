import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';

const schema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    hook: { type: SchemaType.STRING, description: "A one-sentence punchy summary of the project." },
    problem: { type: SchemaType.STRING, description: "What was the pain point? (e.g., 'Manual sorting of 1000+ emails was taking 5 hours/day')." },
    solution: { type: SchemaType.STRING, description: "How did the user solve it? (e.g., 'Built a Python script using Regex and LLM APIs')." },
    techStack: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "A list of tools used." },
    win: { type: SchemaType.STRING, description: "A quantified result (e.g., 'Reduced processing time from 5 hours to 10 minutes')." },
    learning: { type: SchemaType.STRING, description: "One thing the student learned during the process." }
  },
  required: ["hook", "problem", "solution", "techStack", "win", "learning"],
};

export async function POST(req: Request) {
  try {
    const { repoUrl, inputData, role } = await req.json();

    // Check for Gemini API key first, then fallback to OpenAI key for backwards compatibility
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Mock generation if no API key is provided
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        success: true,
        data: {
          hook: `Revolutionized workflow for a ${role} using automation.`,
          problem: "Manual processes were consuming 15+ hours per week, leading to developer burnout.",
          solution: "Architected a full-stack Next.js application that automates data synchronization.",
          techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
          win: "Saved 15 hours per week and increased deployment speed by 40%.",
          learning: "Learned how to properly structure serverless functions for optimal cold starts."
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      }
    });

    let contextualData = inputData || repoUrl || "Built a project using Next.js and Supabase.";
    
    // Fetch GitHub README if a GitHub URL is provided
    if (repoUrl && repoUrl.includes("github.com")) {
      try {
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (match) {
          const owner = match[1];
          const repo = match[2].replace('.git', '');
          const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: {
              'Accept': 'application/vnd.github.v3.raw',
              'User-Agent': 'Portfolio-Generator-App'
            }
          });
          
          if (readmeResponse.ok) {
            const readmeText = await readmeResponse.text();
            contextualData = `GitHub Repository: ${repoUrl}\n\nREADME Content:\n${readmeText.substring(0, 15000)}`; // limit to 15k chars to avoid token limits
          }
        }
      } catch (e) {
        console.error("Failed to fetch README", e);
      }
    }

    const prompt = `You are an expert tech recruiter and portfolio copywriter.
Analyze the following project data provided by a ${role || "Software Engineer"} and generate a highly professional "Case Study" style portfolio entry.
Focus on impact, numbers, and the "Show, Don't Tell" methodology. If the data is a README, extract the true business value and tech stack.

Project Data:
${contextualData}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Sometimes AI still wraps JSON in markdown blocks despite mimeType settings
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(responseText);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to generate portfolio" }, { status: 500 });
  }
}
