
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedAppConcept, CourseNode } from "../types";
import { SYSTEM_INSTRUCTION_GENERATOR, SYSTEM_INSTRUCTION_CHAT, SYSTEM_INSTRUCTION_TUTOR, SYSTEM_INSTRUCTION_REVERSE_ENGINEER } from "../constants";

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key exists to avoid errors on empty env during dev
const ai = new GoogleGenAI({ apiKey });

export const generateAppConcept = async (prompt: string): Promise<GeneratedAppConcept> => {
  if (!apiKey) throw new Error("API Key not found");

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_GENERATOR,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          desc: { type: Type.STRING, description: "Max 12 words description" },
          category: { type: Type.STRING, enum: ["SaaS Product", "Indie Game", "Dev Tool", "Fintech", "AI Tool", "Data Tool", "Automation", "Content Gen"] },
          potentialMrr: { type: Type.NUMBER, description: "Projected MRR integer between 500 and 15000" },
          hypeComment: { type: Type.STRING, description: "A short reaction to the launch" },
          blueprint: {
            type: Type.OBJECT,
            properties: {
                techStack: { type: Type.STRING },
                coreFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                monetizationStrategy: { type: Type.STRING },
                uniModuleRef: { type: Type.STRING }
            },
            required: ["techStack", "coreFeatures", "monetizationStrategy", "uniModuleRef"]
          }
        },
        required: ["name", "desc", "category", "potentialMrr", "hypeComment", "blueprint"],
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as GeneratedAppConcept;
};

export const generateReverseEngineeredApp = async (sector: string): Promise<GeneratedAppConcept> => {
    if (!apiKey) throw new Error("API Key not found");

    const prompt = `Sector: ${sector}. Create a comprehensive 5-module curriculum to build a specific app for this sector. Ensure Module 5 contains the specific Google AI Studio deployment links.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_REVERSE_ENGINEER,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    desc: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ["SaaS Product", "Indie Game", "Dev Tool", "Fintech", "AI Tool", "Data Tool", "Automation", "Content Gen"] },
                    potentialMrr: { type: Type.NUMBER },
                    hypeComment: { type: Type.STRING },
                    blueprint: {
                        type: Type.OBJECT,
                        properties: {
                            techStack: { type: Type.STRING },
                            coreFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                            monetizationStrategy: { type: Type.STRING },
                            uniModuleRef: { type: Type.STRING }
                        },
                        required: ["techStack", "coreFeatures", "monetizationStrategy", "uniModuleRef"]
                    },
                    customCurriculum: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                xpReward: { type: Type.NUMBER },
                                reputationReward: { type: Type.NUMBER },
                                status: { type: Type.STRING, enum: ["unlocked", "locked"] },
                                category: { type: Type.STRING, enum: ["specialized"] },
                                isProOnly: { type: Type.BOOLEAN },
                                content: { type: Type.STRING },
                                tasks: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            id: { type: Type.STRING },
                                            text: { type: Type.STRING },
                                            codeSnippet: { type: Type.STRING }
                                        }
                                    }
                                },
                                storyScenarios: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            title: { type: Type.STRING },
                                            situation: { type: Type.STRING },
                                            options: {
                                                type: Type.ARRAY,
                                                items: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        text: { type: Type.STRING },
                                                        isCorrect: { type: Type.BOOLEAN },
                                                        feedback: { type: Type.STRING }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                quiz: {
                                     type: Type.ARRAY,
                                     items: {
                                         type: Type.OBJECT,
                                         properties: {
                                             question: { type: Type.STRING },
                                             options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                             correctIndex: { type: Type.NUMBER },
                                             explanation: { type: Type.STRING }
                                         }
                                     }
                                }
                            },
                            required: ["id", "title", "description", "content", "tasks"]
                        }
                    }
                },
                required: ["name", "desc", "category", "potentialMrr", "hypeComment", "blueprint", "customCurriculum"]
            }
        }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const result = JSON.parse(text) as GeneratedAppConcept;
    
    // Post-process: Ensure first is unlocked, others locked
    if (result.customCurriculum && result.customCurriculum.length > 0) {
        result.customCurriculum.forEach((node, index) => {
            node.status = index === 0 ? 'unlocked' : 'locked';
            // Force IDs to be unique to this generation
            node.id = `custom-${Date.now()}-${index}`;
            node.category = 'specialized';
        });
    }
    
    return result;
};

export const chatWithOracle = async (userMessage: string, history: string[]): Promise<string> => {
    if (!apiKey) throw new Error("API Key not found");

    const fullPrompt = `
    History: ${history.join('\n')}
    User: ${userMessage}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_CHAT,
            maxOutputTokens: 100, 
        }
    });

    return response.text || "...";
};

export const getAiTutorHelp = async (question: string, context: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");
  
  const fullPrompt = `
  Lesson Context: ${context}
  
  Student Question: ${question}
  `;

  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
          systemInstruction: SYSTEM_INSTRUCTION_TUTOR,
          maxOutputTokens: 300,
      }
  });

  return response.text || "I'm having trouble connecting to the knowledge base right now.";
};

export const generatePodcastAudio = async (lessonContent: string, lessonTitle: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const prompt = `
  Generate a lively, educational podcast dialogue between two hosts, "Kai" (energetic, curious) and "Dr. V" (senior architect, wise).
  They are discussing the following lesson from Vibe Code University.
  
  Goal: Simplify the technical concepts for a new developer who wants to build startups. 
  Tone: "Indie Hacker", professional but fun, fast-paced.
  
  Lesson Title: ${lessonTitle}
  Lesson Content: ${lessonContent}

  Script Format:
  Kai: [Line]
  Dr. V: [Line]
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: 'Kai',
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
            },
            {
              speaker: 'Dr. V',
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
          ]
        }
      }
    }
  });

  const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioData) throw new Error("Failed to generate audio");
  
  return audioData;
};
