import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';

// Dynamic schema — "techStack" becomes role-aware "tools/skills"
const schema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    hook: {
      type: SchemaType.STRING,
      description: "A powerful one-sentence summary that captures the essence of this project. Should read like a LinkedIn headline. Must be specific to the actual content provided, NOT generic."
    },
    problem: {
      type: SchemaType.STRING,
      description: "The specific challenge or gap that this project addressed. Include context: who was affected, what was broken, what opportunity existed. Use real details from the source material."
    },
    solution: {
      type: SchemaType.STRING,
      description: "The approach taken to solve the problem. Describe the methodology, framework, or strategy — not just tools. Explain HOW it was done, not just WHAT was done."
    },
    toolsUsed: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "A list of specific tools, technologies, frameworks, platforms, methodologies, or skills that were actually used in this project. MUST be derived from the source material. For coding: list languages, frameworks, APIs. For business: list Excel, Tableau, financial models, etc. For research: list methodologies, lab equipment, statistical tools. For design: list Figma, Adobe Suite, etc. For marketing: list Google Ads, SEO tools, CRM platforms, etc. NEVER fabricate tools not mentioned or implied in the source."
    },
    win: {
      type: SchemaType.STRING,
      description: "The measurable impact or outcome. Use real numbers from the source if available. If not, make a reasonable estimate based on context and state it as an estimate. Examples: 'Increased conversion rate by 23%', 'Published in IEEE with 50+ citations', 'Reduced patient wait time by 40%', 'Secured $50K in seed funding'."
    },
    learning: {
      type: SchemaType.STRING,
      description: "A genuine insight or skill gained during this project. Should feel personal and authentic, not generic. Relate it to professional growth."
    },
    category: {
      type: SchemaType.STRING,
      description: "The domain category of this project. Choose the most fitting: 'Software Engineering', 'Data Science & ML', 'UI/UX Design', 'Marketing & Growth', 'Product Management', 'Research & Academic', 'Business & Finance', 'Healthcare & Biotech', 'IoT & Hardware', 'Content & Communications', or 'Other'."
    },
    keyMetrics: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          label: { type: SchemaType.STRING, description: "Short metric label (e.g., 'Users Reached', 'Cost Saved', 'Accuracy', 'Revenue Impact')" },
          value: { type: SchemaType.STRING, description: "The metric value (e.g., '10K+', '$25K', '94.7%', '3x faster')" },
        },
        required: ["label", "value"],
      },
      description: "2-4 key performance metrics that quantify the impact. Extract from source material or make reasonable estimates. These should be specific to the domain — NOT always coding metrics."
    },
  },
  required: ["hook", "problem", "solution", "toolsUsed", "win", "learning", "category", "keyMetrics"],
};

// Role-specific prompt guidance
function getRoleContext(role: string): string {
  const roleMap: Record<string, string> = {
    "Frontend Dev": `Focus on UI/UX impact, performance metrics (load time, Lighthouse scores), responsive design, component architecture, and user experience improvements. Tools should include specific frameworks, libraries, and design systems.`,
    "Backend Dev": `Focus on system architecture, API design, scalability metrics (requests/sec, uptime), database optimization, and infrastructure decisions. Highlight throughput, latency, and reliability improvements.`,
    "Full Stack Dev": `Cover the entire stack — frontend UX, backend architecture, database design, and deployment. Highlight end-to-end ownership and the interplay between frontend and backend decisions.`,
    "Data / ML Engineer": `Focus on model accuracy, dataset size, feature engineering, training time, and real-world prediction impact. Mention specific ML frameworks (TensorFlow, PyTorch, scikit-learn) ONLY if actually used. Include metrics like F1 score, AUC, RMSE, or business KPIs improved.`,
    "UI/UX Designer": `Focus on user research findings, design decisions, usability testing results, and conversion/engagement improvements. Tools should include design tools (Figma, Sketch, Adobe XD), prototyping tools, and research methods. Avoid mentioning programming languages unless the designer actually coded.`,
    "Marketing / Growth": `Focus on campaign performance (CTR, ROAS, CPA), growth metrics (MRR, DAU, retention), channel strategy, and A/B testing results. Tools should include marketing platforms (Google Ads, Meta Ads, HubSpot, Mailchimp, SEMrush) and analytics tools.`,
    "Product Manager": `Focus on product strategy, user problem validation, roadmap decisions, stakeholder alignment, and launch metrics. Highlight user research, prioritization frameworks (RICE, MoSCoW), and go-to-market strategy. Tools should include Jira, Notion, Amplitude, Mixpanel — NOT programming languages.`,
    "Content / Writer": `Focus on content strategy, audience growth, engagement metrics (views, shares, time-on-page), and SEO impact. Tools should include CMS platforms, SEO tools, and writing/editing tools. Highlight the narrative arc and content distribution strategy.`,
    "Research / Academic": `Focus on research methodology, hypothesis, experimental design, key findings, and academic impact (citations, publications, conference presentations). Tools should include research methods, lab equipment, statistical software (SPSS, R, MATLAB), and academic databases. Use formal language appropriate for academic work.`,
    "IoT / Hardware": `Focus on hardware design, sensor integration, embedded systems programming, power efficiency, and real-world deployment. Tools should include microcontrollers (Arduino, Raspberry Pi, ESP32), communication protocols (MQTT, BLE), PCB design tools, and specific sensors used.`,
    "Healthcare / Biotech": `Focus on patient outcomes, clinical impact, regulatory considerations, and health metrics improved. Tools should include clinical software, biotech equipment, data analysis platforms, and healthcare standards (HL7, FHIR). Be precise with medical terminology and impact metrics.`,
    "MBA / Finance": `Focus on financial modeling, market analysis, business strategy, ROI, revenue impact, and stakeholder value created. Tools should include Excel, financial modeling software, market research platforms, and business frameworks (Porter's Five Forces, SWOT, DCF). Highlight business acumen over technical skills.`,
  };

  return roleMap[role] || `Analyze the content carefully and identify the actual domain, tools, and methodologies used. Do NOT default to software engineering terminology unless the content is actually about software.`;
}

export async function POST(req: Request) {
  try {
    const { repoUrl, inputData, role, pdfBase64, pdfName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        success: true,
        data: {
          hook: `Revolutionized workflow for a ${role} using smart automation.`,
          problem: "Manual processes were consuming 15+ hours per week, leading to burnout and missed deadlines.",
          solution: "Designed and implemented a systematic approach that automated key workflows and improved team efficiency.",
          toolsUsed: ["Strategic Planning", "Process Automation", "Data Analysis"],
          win: "Saved 15 hours per week and improved output quality by 40%.",
          learning: "Learned the importance of understanding user workflows before optimizing them.",
          category: "Other",
          keyMetrics: [
            { label: "Time Saved", value: "15 hrs/week" },
            { label: "Efficiency Gain", value: "40%" },
          ],
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"];
    
    const getModel = (modelName: string) => genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3,
      }
    });

    const roleContext = getRoleContext(role);

    const prompt = `You are an expert portfolio copywriter who specializes in creating compelling "Case Study" style entries for professionals across ALL industries — not just software engineering.

## YOUR ROLE
The person is a **${role || "Professional"}**. Tailor every aspect of your output to their specific domain.

## ROLE-SPECIFIC GUIDANCE
${roleContext}

## CRITICAL RULES
1. **READ THE ACTUAL CONTENT**: Base your output ENTIRELY on the provided source material (PDF, README, or text). Do NOT invent or hallucinate information.
2. **DOMAIN-APPROPRIATE TOOLS**: The "toolsUsed" field must reflect ACTUAL tools/technologies/methodologies from the source material. If the project is about marketing, list marketing tools. If it's about research, list research methods. Do NOT default to Python/React/Node.js unless they are genuinely mentioned.
3. **REAL METRICS**: Extract real numbers from the source. If no numbers exist, provide reasonable estimates CLEARLY framed as estimates (e.g., "~30% improvement" or "Est. 500+ users impacted").
4. **NO GENERIC FILLER**: Every field must contain specific, concrete information from the source material. Generic phrases like "Revolutionized the workflow" or "Built a scalable solution" are UNACCEPTABLE unless backed by specifics.
5. **MATCH THE TONE**: Academic projects should sound scholarly. Business projects should sound strategic. Creative projects should sound innovative. Tech projects should sound technical.
6. **keyMetrics**: Extract 2-4 quantifiable impact metrics. For non-tech projects, use domain-appropriate metrics (e.g., "Revenue Impact: $50K", "Patient Outcomes: 23% improvement", "Paper Citations: 45+").`;

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
          const parsed = JSON.parse(responseText);
          
          // Backward compatibility: map toolsUsed to techStack for templates
          if (parsed.toolsUsed && !parsed.techStack) {
            parsed.techStack = parsed.toolsUsed;
          }
          
          return parsed;
        } catch (err: any) {
          lastError = err;
          const msg = err?.message || "";
          if (msg.includes("429") || msg.includes("quota") || msg.includes("rate") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("404") || msg.includes("not found") || msg.includes("NOT_FOUND")) {
            console.warn(`Model ${modelName} unavailable, trying next...`);
            continue;
          }
          throw err;
        }
      }
      throw lastError || new Error("All Gemini models exhausted. Please try again later.");
    };

    // PDF upload path
    if (pdfBase64) {
      const contentParts = [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBase64,
          }
        },
        {
          text: prompt + `\n\nThe PDF file "${pdfName || "uploaded.pdf"}" has been provided above. Read every page carefully. Extract the ACTUAL subject matter, methodology, tools, and results. Do NOT assume this is a software project unless it clearly is one.`
        }
      ];

      const data = await generateWithFallback(contentParts);
      return NextResponse.json({ success: true, data });
    }

    // Text/GitHub path
    let contextualData = inputData || repoUrl || "Built a project.";
    
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
