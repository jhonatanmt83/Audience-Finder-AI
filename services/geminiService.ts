
import { GoogleGenAI, Type } from "@google/genai";
import { AudienceResponse } from '../types';

const getAdjacentStates = async (location: string): Promise<AudienceResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Based on the US location "${location}", identify:
    1. The "primaryState": The state where this location acts (the home state).
    2. The "nearbyStates": A list of adjacent or nearby states suitable for a marketing campaign.
    
    Respond ONLY with a JSON object.
  `;
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      showLocation: {
        type: Type.OBJECT,
        description: "An object containing the latitude and longitude of the event location.",
        properties: {
          latitude: {
            type: Type.NUMBER,
            description: "The latitude of the location."
          },
          longitude: {
            type: Type.NUMBER,
            description: "The longitude of the location."
          }
        },
        required: ["latitude", "longitude"]
      },
      primaryState: {
        type: Type.OBJECT,
        description: "The state where the event is physically located.",
        properties: {
            name: { type: Type.STRING },
            abbreviation: { type: Type.STRING }
        },
        required: ["name", "abbreviation"]
      },
      nearbyStates: {
        type: Type.ARRAY,
        description: "An array of adjacent or nearby states to target.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The full name of the US state.",
            },
            abbreviation: {
              type: Type.STRING,
              description: "The two-letter postal abbreviation for the state.",
            }
          },
          required: ["name", "abbreviation"],
        },
      },
    },
    required: ["showLocation", "primaryState", "nearbyStates"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonString = response.text ? response.text.trim() : "";
    if (!jsonString) {
        throw new Error("Empty response from AI");
    }
    
    const parsedResponse: AudienceResponse = JSON.parse(jsonString);
    
    const { showLocation, primaryState, nearbyStates } = parsedResponse;
    
    if (
        showLocation &&
        typeof showLocation.latitude === 'number' && 
        primaryState && 
        primaryState.name &&
        Array.isArray(nearbyStates)
    ) {
        return parsedResponse;
    } else {
        throw new Error("Invalid response format from AI.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get audience data from AI.");
  }
};

export { getAdjacentStates };
