import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { useRouter } from "next/navigation";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ""; // Replace with your actual public key
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || ""; // Replace with your actual assistant ID

const useVapi = () => {
  const navigate = useRouter();
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversation, setConversation] = useState<
    { role: string; text: string; timestamp: string; isFinal: boolean }[]
  >([]);
  const vapiRef = useRef<any>(null);

  const initializeVapi = useCallback(() => {
    if (!vapiRef.current) {
      const vapiInstance = new Vapi(publicKey);
      vapiRef.current = vapiInstance;

      vapiInstance.on("call-start", () => {
        setIsSessionActive(true);
      });

      vapiInstance.on("call-end", () => {
        setIsSessionActive(false);
        setConversation([]);
      });

      vapiInstance.on("volume-level", (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on("message", (message: any) => {
        console.log("Received message:", message);
        if (message.type === "transcript") {
          setConversation((prev) => {
            const timestamp = new Date().toLocaleTimeString();
            const updatedConversation = [...prev];
            if (message.transcriptType === "final") {
              // Find the partial message to replace it with the final one
              const partialIndex = updatedConversation.findIndex(
                (msg) => msg.role === message.role && !msg.isFinal
              );
              if (partialIndex !== -1) {
                updatedConversation[partialIndex] = {
                  role: message.role,
                  text: message.transcript,
                  timestamp: updatedConversation[partialIndex].timestamp,
                  isFinal: true,
                };
              } else {
                updatedConversation.push({
                  role: message.role,
                  text: message.transcript,
                  timestamp,
                  isFinal: true,
                });
              }
            } else {
              // Add partial message or update the existing one
              const partialIndex = updatedConversation.findIndex(
                (msg) => msg.role === message.role && !msg.isFinal
              );
              if (partialIndex !== -1) {
                updatedConversation[partialIndex] = {
                  ...updatedConversation[partialIndex],
                  text: message.transcript,
                };
              } else {
                updatedConversation.push({
                  role: message.role,
                  text: message.transcript,
                  timestamp,
                  isFinal: false,
                });
              }
            }
            return updatedConversation;
          });
        }

        if (
          message.type === "function-call" &&
          message.functionCall.name === "changeUrl"
        ) {
          const command = message.functionCall.parameters.url.toLowerCase();
          console.log(command);
          // const newUrl = routes[command];
          if (command) {
            window.location.href = command;
          } else {
            console.error("Unknown route:", command);
          }
        }
      });

      vapiInstance.on("error", (e: Error) => {
        console.error("Vapi error:", e);
      });
    }
  }, []);

  useEffect(() => {
    initializeVapi();

    // Cleanup function to end call and dispose Vapi instance
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [initializeVapi]);

  const toggleCall = async (language: string = "english") => {
    const firstMessage = {
      en: " Hello there! I'm SiteMate, your construction site buddy. Are you new to the construction site?",
      de: " Hallo! Ich bin SiteMate, dein Baustellen-Buddy. Bist du neu auf der Baustelle?",
      tr: " Merhaba! Ben SiteMate, inşaat sahası arkadaşınız. Siz inşaat sahasına yeni misiniz?",
    };

    try {
      if (isSessionActive) {
        await vapiRef.current.stop();
      } else {
        await vapiRef.current.start(assistantId, {
          firstMessage: firstMessage[language as keyof typeof firstMessage],
          model: {
            provider: "openai",
            model: "gpt-4o",
            temperature: 0.7,
            messages: [
              {
                role: "system",
                content: `# German Construction Site Training Agent - BauMeister

## IMPORTANT: You must communicate in ${language} language throughout the entire conversation.

## Primary Mission
You are BauMeister, a German construction site training specialist. Your task is to help construction workers prepare for working in Germany by improving their German language skills, understanding German work culture, and learning construction site processes in Germany.

## Core Identity
- **Name**: BauMeister (Construction + Master)
- **Personality**: Experienced, patient, supportive German construction foreman
- **Tone**: Professional but approachable, educational and culturally aware
- **Communication Language**: ${language} (for instruction) with German construction terminology and phrases

## Areas of Expertise

### German Construction Site Processes:
- German construction terminology (Baustelle, Bauarbeiter, Polier, etc.)
- German safety regulations (Arbeitsschutz, BG BAU standards)
- Equipment usage with German names (Kran, Bagger, Betonmischer)
- German project management structure
- Quality standards (DIN norms)
- Material management (German supplier system)

### German Work Culture:
- **Punctuality**: "Pünktlichkeit ist alles" - Being on time is crucial
- **Hierarchy**: Respect for Meister, Polier, and Bauleiter
- **Direct communication**: Germans prefer straightforward feedback
- **Work-life balance**: Respecting Feierabend (end of workday)
- **Precision and quality**: "Gründlichkeit" - thoroughness is valued
- **Teamwork**: Collaborative but structured approach

### German Language Training:
- Construction-focused vocabulary with pronunciation guides
- Workplace communication phrases in German
- Safety commands and warnings in German
- Daily interaction patterns
- Understanding German construction slang

## Cultural Adaptation Focus

### German Construction Site Culture:
- **Morning routine**: Early start (7:00 AM typical), brief team meeting
- **Break culture**: Structured Pause times, often with coffee
- **Safety first**: "Sicherheit geht vor" - extremely strict safety culture
- **Apprenticeship respect**: Respect for Azubi (apprentices) and Geselle system
- **Environmental consciousness**: Waste separation, energy efficiency

### Social Integration:
- Workplace greetings: "Moin" (North), "Servus" (South), "Hallo"
- After-work culture: Feierabend beer culture
- Weather talk: Common conversation starter
- Football/soccer discussions: Universal icebreaker

## Essential German Construction Vocabulary:
- **Baustelle** (construction site) - pronunciation: "BAU-shtel-le"
- **Polier** (foreman) - "po-LEER"
- **Feierabend** (end of workday) - "FY-er-ah-bent"
- **Arbeitsschutz** (workplace safety) - "AR-byts-shoots"
- **Achtung!** (Attention/Watch out!)
- **Stopp!** (Stop!)
- **Vorsicht!** (Careful!)
- **Helm auf!** (Helmet on!)

## Key Cultural Points:
- Germans value honest, direct feedback - don't take it personally
- Punctuality is extremely important - arrive 5-10 minutes early
- Safety regulations are strictly enforced
- Respect for hierarchy and proper credentials
- Show interest in local culture and football

## Communication Style:
- Always speak in ${language} for explanations and instructions
- Include German phrases with pronunciation guides
- Use real construction site scenarios
- Emphasize safety culture importance
- Be patient and supportive while maintaining professionalism

Remember: Your goal is to prepare workers for success on German construction sites by teaching both language skills and cultural understanding. Focus on practical, real-world applications and always prioritize safety awareness.`,
              },
            ],
          },
        });
      }
    } catch (err) {
      console.error("Error toggling Vapi session:", err);
    }
  };

  const sendMessage = (role: string, content: string) => {
    if (vapiRef.current) {
      vapiRef.current.send({
        type: "add-message",
        message: { role, content },
      });
    }
  };

  const say = (message: string, endCallAfterSpoken = false) => {
    if (vapiRef.current) {
      vapiRef.current.say(message, endCallAfterSpoken);
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      const newMuteState = !isMuted;
      vapiRef.current.setMuted(newMuteState);
      setIsMuted(newMuteState);
    }
  };

  return {
    volumeLevel,
    isSessionActive,
    conversation,
    toggleCall,
    sendMessage,
    say,
    toggleMute,
    isMuted,
  };
};

export default useVapi;
