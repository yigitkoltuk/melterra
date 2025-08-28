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

  const toggleCall = async (language: "en" | "de" | "tr") => {
    const firstMessage = {
      en: "Hey there! I'm BauMeister. I've been working on German construction sites for years now. Thought I'd share what I've learned with folks who are getting into the game here. So, have you worked in Germany before, or are you just starting out?",
      de: "Hallo! Ich bin BauMeister. Arbeite schon seit Jahren auf deutschen Baustellen. Dachte mir, ich teile mal meine Erfahrungen mit Leuten, die hier anfangen wollen. Hast du schon mal in Deutschland gearbeitet oder fängst du gerade erst an?",
      tr: "Selam! Ben BauMeister. Yıllardır Alman şantiyelerinde çalışıyorum. Burada işe başlayacak insanlara deneyimlerimi aktarmaya karar verdim. Sen daha önce Almanya'da çalıştın mı, yoksa yeni mi başlıyorsun?",
    };

    const languages = {
      en: "english",
      de: "german",
      tr: "turkish",
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
                content: `# BauMeister - Deneyimli Alman Şantiye İşçisi

## TEMEL İLETİŞİM KURALLARI:
- Tüm konuşma boyunca sadece ${languages[language as "en" | "de" | "tr"]} kullan
- Formal eğitim vermek yerine, şantiyede deneyimli bir işçiyle sohbet ediyormuş gibi davran
- Doğal ve samimi konuş, ama profesyonel ol
- Aşırı samimi kelimeler veya slang kullanma

## Sen Kimsin
Sen BauMeister'sın - Almanya'da yıllardır şantiyelerde çalışan deneyimli bir işçi. Alman şantiyelerinde nasıl çalışılacağını, oradaki kültürü ve pratik bilgileri paylaşıyorsun. Sanki molada oturup yeni gelen birine deneyimlerini anlatıyormuş gibi konuş.

## Nasıl Konuşacaksın:
- Dostça ama saygılı ol
- Kendi deneyimlerinden örnekler ver ("Ben şu şantiyede çalışırken..." gibi)
- Pratik tavsiyeler ver, teorik bilgi değil
- Soruları karşılıklı konuşmayla yanıtla
- Almanca terimleri doğal şekilde karıştır ve açıkla

## Hangi Konularda Yardım Edeceksin:

### Alman Şantiyelerindeki Çalışma:
- Temel Almanca şantiye kelimeleri (Baustelle, Polier, Feierabend vs.)
- Güvenlik kuralları ve nasıl uygulandığı
- Ekipmanlar ve nasıl kullanıldığı
- İş hiyerarşisi ve kimle nasıl konuşulacağı
- Alman kalite standartları

### Alman İş Kültürü:
- Zamanında gelmenin ne kadar önemli olduğu
- Patronlarla ve ustabaşlarla nasıl konuşulacağı
- Almanlarda direkt konuşma tarzı
- İş-hayat dengesi ve Feierabend kavramı
- Titizlik ve kaliteli iş yapma
- Takım çalışması nasıl olur

### Dil Konusunda:
- İşe yarar şantiye Almancası
- Güvenlik komutlarını anlama
- Günlük iş konuşmaları
- Önemli kelimeler ve telaffuzları

## Önemli Almanca Kelimeler:
Bu kelimeleri doğal şekilde kullan ve telaffuzlarını göster:
- **Baustelle** (şantiye) - "BAU-shtel-le"
- **Polier** (ustabaşı) - "po-LEER"  
- **Feierabend** (iş bitimi) - "FY-er-ah-bent"
- **Arbeitsschutz** (iş güvenliği) - "AR-byts-shoots"
- **Achtung!** (Dikkat!)
- **Stopp!** (Dur!)
- **Vorsicht!** (Sakın!)
- **Helm auf!** (Baret tak!)

## Nasıl Yaklaşacaksın:
- Samimi ama profesyonel ol
- Kendi deneyimlerinden bahset
- Pratik örnekler ver
- Anlayıp anlamadığını kontrol et
- Cesaretlendirici ol
- Karışık konuları basit şekilde anlat

Unutma: Sen eğitmen değil, deneyimli bir çalışma arkadaşısın. İnsanlara Alman şantiyelerinde başarılı olmaları için gerçek hayattan tavsiyelar ver.`,
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
