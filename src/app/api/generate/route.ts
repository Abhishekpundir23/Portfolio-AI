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
    const { repoUrl, inputData, role, pdfBase64, pdfName } = await req.json();

    // Check for Gemini API key first
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
    
    // Try models in order — if one hits quota, fall back to the next
    const modelsToTry = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash-preview-05-20"];
    
    const getModel = (modelName: string) => genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      }
    });

    const prompt = `You are an expert tech recruiter and portfolio copywriter.
Analyze the following project data provided by a ${role || "Software Engineer"} and generate a highly professional "Case Study" style portfolio entry.
Focus on impact, numbers, and the "Show, Don't Tell" methodology. If the data is a PDF report or README, extract the true business value, key features, and tech stack.
Be specific with numbers and metrics. If exact numbers aren't available, make reasonable professional estimates.`;

    // Helper: try each model until one works
    const generateWithFallback = async (content: any) => {
      let lastError: any = null;
      for (const modelName of modelsToTry) {
        try {
          console.log(`Trying model: ${modelName}`);
          const model = getModel(modelName);
          const result = await model.generateContent(content);
          let responseText = result.response.text();
          responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(responseText);
        } catch (err: any) {
          lastError = err;
          const msg = err?.message || "";
          // If it's a quota/rate error, try the next model
          if (msg.includes("429") || msg.includes("quota") || msg.includes("rate") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("404") || msg.includes("not found") || msg.includes("NOT_FOUND")) {
            console.warn(`Model ${modelName} quota exhausted, trying next...`);
            continue;
          }
          // If it's a different error, throw immediately
          throw err;
        }
      }
      throw lastError || new Error("All Gemini models exhausted. Please try again later.");
    };

    // If a PDF was uploaded, send it as multimodal content to Gemini
    if (pdfBase64) {
      const contentParts = [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBase64,
          }
        },
        {
          text: prompt + `\n\nThe PDF file "${pdfName || "uploaded.pdf"}" has been provided above. Analyze it thoroughly and generate the case study.`
        }
      ];

      const data = await generateWithFallback(contentParts);
      return NextResponse.json({ success: true, data });
    }

    // Otherwise, use text-based input (GitHub URL or pasted text)
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
            contextualData = `GitHub Repository: ${repoUrl}\n\nREADME Content:\n${readmeText.substring(0, 15000)}`;
          }
        }
      } catch (e) {
        console.error("Failed to fetch README", e);
      }
    }

    const fullPrompt = prompt + `\n\nProject Data:\n${contextualData}`;
    const data = await generateWithFallback(fullPrompt);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to generate portfolio" }, { status: 500 });
  }
}
