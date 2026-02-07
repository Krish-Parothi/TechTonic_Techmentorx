import model from "../config/gemini.js";

export const generateAIPrice = async (route, minPrice, maxPrice, demand, timeOfDay) => {
  try {
    const prompt = `
You are a real-time airline and railway pricing engine.
Generate ONE realistic price (numeric only) for this travel route.

Route Type: ${route}
Min Historical Price: ₹${minPrice}
Max Historical Price: ₹${maxPrice}
Current Demand: ${demand} (Low/Medium/High)
Time of Day: ${timeOfDay}

Return ONLY the price as a number between ${minPrice} and ${maxPrice}.
Do not include currency symbol, text, or explanation.
Example response: 5240
`;

    // Wrap in timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 5000)
    );
    
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const responseText = result.response.text().trim();
    
    // Parse the response - extract just the number
    const price = parseInt(responseText.match(/\d+/)?.[0] || Math.floor((minPrice + maxPrice) / 2));
    
    // Ensure price is within range
    return Math.max(minPrice, Math.min(maxPrice, price));
  } catch (error) {
    console.error("Gemini API error:", error.message);
    // Fallback to random price if API fails
    return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
  }
};
