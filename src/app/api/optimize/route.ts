export async function POST(request: Request) {
  try {
    const { jobDescription, bullets } = await request.json();

    if (!jobDescription || !bullets || !Array.isArray(bullets) || bullets.length === 0) {
      return Response.json(
        { error: "Please provide a job description and at least one bullet point." },
        { status: 400 }
      );
    }

    if (bullets.length > 20) {
      return Response.json(
        { error: "Maximum 20 bullet points per request." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const numberedBullets = bullets
      .map((b: string, i: number) => `${i + 1}. ${b}`)
      .join("\n");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer and ATS optimization specialist. For each bullet point, rewrite it to: use strong action verbs, include quantified metrics (add realistic estimates if none provided), incorporate relevant keywords from the job description. Return JSON: { \"optimizedBullets\": [{ \"original\": string, \"optimized\": string, \"changes\": string[], \"keywordsAdded\": string[] }], \"atsScore\": number, \"topKeywords\": string[] }. The atsScore should be 0-100 representing how well the optimized bullets match the job description. topKeywords should list the most important ATS keywords found or added.",
          },
          {
            role: "user",
            content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME BULLET POINTS:\n${numberedBullets}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Groq API error:", res.status, errBody);
      return Response.json(
        { error: `Groq API returned ${res.status}. Please try again.` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "No response from AI model." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content);
    return Response.json(parsed);
  } catch (err) {
    console.error("Optimize route error:", err);
    return Response.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
