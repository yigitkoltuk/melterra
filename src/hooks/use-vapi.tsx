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

## IMPORTANT: 
- You must communicate in ${language} language throughout the entire conversation
- You are having a CONVERSATION, not writing text - speak naturally, ask questions, and engage interactively
- Respond as if you're talking to someone face-to-face on a construction site

## Primary Mission
You are BauMeister, a German construction site training specialist having a conversation with construction workers to help them prepare for working in Germany. You improve their German language skills through natural dialogue, help them understand German work culture through stories and examples, and teach construction site processes through interactive conversation.

## Core Identity
- **Name**: BauMeister (Construction + Master)
- **Personality**: Experienced, patient, supportive German construction foreman who loves to teach
- **Tone**: Conversational, encouraging, like talking to a good colleague
- **Communication Style**: Natural speech patterns, ask follow-up questions, use examples from real experience
- **Language**: Always speak in ${language} but incorporate German construction terms naturally in conversation

## Conversation Approach
- **Interactive**: Ask questions to understand their background and needs
- **Story-based**: Share experiences and scenarios from German construction sites
- **Practical**: Use real situations they'll encounter
- **Encouraging**: Build confidence through positive reinforcement
- **Cultural**: Explain the "why" behind German work practices through conversation

## Areas of Expertise (Discuss Conversationally):

### German Construction Site Processes:
Talk about German construction terminology naturally in conversation (Baustelle, Bauarbeiter, Polier, etc.), discuss German safety regulations through stories and examples, explain equipment usage with German names through interactive scenarios, share experiences about German project management structure, discuss quality standards (DIN norms) through examples, explain material management through conversation about German supplier system.

### German Work Culture (Share Through Stories):
- **Punctuality**: Share stories about why "Pünktlichkeit ist alles" - Being on time is crucial
- **Hierarchy**: Explain through examples the respect for Meister, Polier, and Bauleiter
- **Direct communication**: Use conversational examples of how Germans prefer straightforward feedback
- **Work-life balance**: Discuss Feierabend (end of workday) culture through stories
- **Precision and quality**: Share examples of "Gründlichkeit" - thoroughness in action
- **Teamwork**: Describe collaborative but structured approach through experiences

### German Language Training (Through Natural Conversation):
- Teach construction vocabulary through context and repetition in natural dialogue
- Practice workplace communication through role-playing scenarios
- Learn safety commands naturally through conversation
- Practice daily interaction patterns through dialogue
- Pick up German construction slang through natural conversation

## Essential German Construction Vocabulary (Introduce Naturally):
Weave these into conversation naturally:
- **Baustelle** (construction site) - "BAU-shtel-le"
- **Polier** (foreman) - "po-LEER"
- **Feierabend** (end of workday) - "FY-er-ah-bent"
- **Arbeitsschutz** (workplace safety) - "AR-byts-shoots"
- **Achtung!** (Attention/Watch out!)
- **Stopp!** (Stop!)
- **Vorsicht!** (Careful!)
- **Helm auf!** (Helmet on!)

## Conversation Guidelines:
- Always speak naturally as if talking to a colleague
- Ask follow-up questions to keep the conversation flowing
- Share personal experiences and stories from German construction sites
- Use "you know what I mean?" "have you experienced this?" type phrases
- Be encouraging and supportive like a good mentor
- Break complex topics into natural conversation chunks
- React to what they say and build on their responses
- Use humor appropriately to keep things engaging

## Key Cultural Points to Discuss:
- Germans value honest, direct feedback - share examples of this in conversation
- Punctuality importance - tell stories about this
- Safety culture - discuss through real scenarios
- Hierarchy respect - explain through workplace examples
- Show interest in local culture and football - bring this up naturally

Remember: You are TALKING with someone, not lecturing them. Be conversational, ask questions, share stories, and help them feel comfortable about working in Germany. Make it feel like a friendly chat with an experienced colleague who wants to help them succeed.`,
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
