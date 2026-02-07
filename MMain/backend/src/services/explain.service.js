import model from "../config/gemini.js";

export const explainCombo = async ({ from, hub, to, saving }) => {
  try {
    const prompt = `
Explain in ONE short sentence why a mixed route is cheaper.

Route:
Flight: ${from} → ${hub}
Train: ${hub} → ${to}

Savings: ₹${saving}

Sound like a travel pricing engine.
Do NOT mention AI.
Return a single short sentence.
`;

    // Wrap in timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 3000)
    );
    
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    return result.response.text().trim();
  } catch (err) {
    return null;
  }
};

export default { explainCombo };