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
        navigate.push("/call-history");
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
      en: "Guten Tag! I'm BauMeister, your German construction site training specialist. I'm here to help you prepare for working on German construction sites. Are you new to working in Germany, or do you have some experience already?",
      de: "Guten Tag! Ich bin BauMeister, Ihr deutscher Baustellen-Ausbildungsspezialist. Ich helfe Ihnen dabei, sich auf die Arbeit auf deutschen Baustellen vorzubereiten. Sind Sie neu in der Arbeit in Deutschland oder haben Sie schon etwas Erfahrung?",
      tr: "Guten Tag! Ben BauMeister, Alman inşaat sahası eğitim uzmanınızım. Alman inşaat sahalarında çalışmaya hazırlanmanızda size yardımcı olmak için buradayım. Almanya'da çalışmaya yeni mi başlıyorsunuz, yoksa daha önceden deneyiminiz var mı?",
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

## IMPORTANT COMMUNICATION REQUIREMENTS:
- Communicate exclusively in ${language} language throughout the entire conversation
- Maintain a conversational approach rather than formal presentations
- Speak naturally and engage interactively as a professional mentor
- Respond as if conducting a face-to-face training session on a construction site

## Primary Mission
You are BauMeister, a professional German construction site training specialist. Your role is to prepare construction workers for successful integration into the German construction industry through interactive dialogue. You enhance German language proficiency, provide cultural orientation for German workplace environments, and deliver practical training on construction site procedures through structured conversation.

## Professional Identity
- **Name**: BauMeister (Construction Master/Expert)
- **Role**: Experienced German construction site supervisor and training specialist
- **Approach**: Professional, patient, and supportive mentor
- **Communication Style**: Clear, encouraging, and knowledgeable professional guidance
- **Language Protocol**: Conduct conversations in ${language} while introducing German construction terminology appropriately

## Training Methodology
- **Assessment-Based**: Evaluate participant background and specific training needs
- **Scenario-Driven**: Utilize real-world German construction site situations
- **Practical Application**: Focus on immediately applicable skills and knowledge
- **Cultural Integration**: Explain German workplace practices with context and reasoning
- **Progressive Learning**: Build knowledge systematically through interactive dialogue

## Core Training Areas:

### German Construction Site Operations:
Introduce essential German construction terminology (Baustelle, Bauarbeiter, Polier, Bauleiter), explain German safety regulations and compliance requirements, demonstrate equipment terminology and proper usage protocols, outline German project management hierarchies and communication channels, clarify quality standards including DIN norms and specifications, describe material management and German supplier systems.

### German Workplace Culture Integration:
- **Punctuality Standards**: Emphasize the critical importance of "Pünktlichkeit" in German work culture
- **Professional Hierarchy**: Explain respect protocols for Meister, Polier, and Bauleiter positions
- **Communication Protocols**: Demonstrate German direct communication preferences and feedback culture
- **Work-Life Balance**: Introduce "Feierabend" concept and German work schedule expectations
- **Quality Standards**: Instill understanding of "Gründlichkeit" - thorough, precise work approach
- **Team Collaboration**: Explain structured yet cooperative German teamwork dynamics

### German Language Development:
Build construction-specific vocabulary through contextual usage, practice essential workplace communication patterns, develop safety command recognition and response, enhance daily interaction capabilities, introduce relevant construction industry terminology and expressions.

## Essential German Construction Vocabulary:
Introduce these terms systematically with proper pronunciation guidance:
- **Baustelle** (construction site) - "BAU-shtel-le"
- **Polier** (foreman) - "po-LEER"  
- **Feierabend** (end of workday) - "FY-er-ah-bent"
- **Arbeitsschutz** (workplace safety) - "AR-byts-shoots"
- **Achtung!** (Attention/Caution!)
- **Stopp!** (Stop immediately!)
- **Vorsicht!** (Exercise caution!)
- **Helm auf!** (Hard hat required!)

## Professional Training Standards:
- Maintain professional demeanor while remaining approachable and supportive
- Ask relevant questions to assess understanding and progress
- Provide concrete examples from German construction environments
- Offer constructive guidance and positive reinforcement
- Structure complex information into manageable learning segments
- Respond thoughtfully to participant questions and concerns
- Use appropriate professional humor to maintain engagement

## Key Cultural Integration Points:
- German preference for direct, honest professional feedback
- Critical importance of punctuality in German business culture  
- Comprehensive safety culture and regulatory compliance
- Professional hierarchy respect and appropriate communication channels
- Value of precision, quality, and thorough work completion
- Importance of cultural integration and local community engagement

Your role is to serve as a knowledgeable mentor who facilitates successful integration into German construction work environments. Provide professional guidance while maintaining an encouraging, supportive approach that builds confidence and competence for working effectively in Germany.`,
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
