"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Clock,
  Users,
  TrendingUp,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  FileText,
  Headphones,
  BarChart3,
  PlayCircle,
  Settings,
  Zap,
  User,
  Activity,
  Eye,
  EyeOff,
  Copy,
  Download,
  Volume2,
  Bot,
} from "lucide-react";

// Hook'u import edin (gerçek path'inize göre ayarlayın)
import { useAnalyticsVapi } from "@/hooks/use-analytics-vapi";

const CallRecordDashboard: React.FC = () => {
  // Gerçek verileri kullanmak için hook'u çağırın
  const { records, loading, error } = useAnalyticsVapi();

  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-300 border-t-amber-600 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center max-w-md"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Hata Oluştu
          </h3>
          <p className="text-red-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  const record = records[0];
  if (!record) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center"
        >
          <MessageCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-amber-800 mb-2">
            Henüz Veri Yok
          </h3>
          <p className="text-amber-600">
            Görüntülenecek çağrı kaydı bulunamadı.
          </p>
        </motion.div>
      </div>
    );
  }

  const bodyData = JSON.parse(record.body).message;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins} dakika ${secs} saniye`;
  };

  const formatCurrency = (amount: number) => `$${amount?.toFixed(4)}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const copyTranscriptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bodyData.transcript || "");
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2000);
    } catch (err) {
      console.error("Kopyalama başarısız:", err);
    }
  };

  const downloadTranscript = () => {
    const transcript = bodyData.transcript || "Transkript bulunamadı";
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${record.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Transkripti parçalayıp konuşmacıları ayıralım
  const parseTranscript = (transcript: string) => {
    if (!transcript) return [];

    const lines = transcript.split("\n").filter((line) => line.trim());
    return lines.map((line, index) => {
      const isAI =
        line.startsWith("AI:") ||
        line.startsWith("Bot:") ||
        line.startsWith("Assistant:");
      const isCustomer =
        line.startsWith("Customer:") ||
        line.startsWith("User:") ||
        line.startsWith("Human:");

      let speaker = "Unknown";
      let message = line;

      if (isAI) {
        speaker = "AI Asistan";
        message = line.replace(/^(AI|Bot|Assistant):\s*/, "");
      } else if (isCustomer) {
        speaker = "Müşteri";
        message = line.replace(/^(Customer|User|Human):\s*/, "");
      } else if (line.includes(":")) {
        const parts = line.split(":", 2);
        speaker = parts[0].trim();
        message = parts[1].trim();
      }

      return {
        id: index,
        speaker,
        message,
        isAI,
        isCustomer,
        timestamp: null, // Gerçek zamanlama bilgisi yoksa
      };
    });
  };

  const DataSection = ({
    title,
    icon: Icon,
    children,
    color = "amber",
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/60 backdrop-blur-sm border-2 border-${color}-300/40 rounded-2xl p-6 shadow-lg`}
    >
      <h3
        className={`text-xl font-semibold text-${color}-800 mb-4 flex items-center`}
      >
        <Icon className={`w-6 h-6 mr-3 text-${color}-600`} />
        {title}
      </h3>
      {children}
    </motion.div>
  );

  const InfoRow = ({
    label,
    value,
    description,
  }: {
    label: string;
    value: any;
    description?: string;
  }) => (
    <div className="flex justify-between items-start py-2 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <span className="font-medium text-gray-700">{label}</span>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="text-gray-900 font-semibold">{value}</span>
      </div>
    </div>
  );

  const parsedTranscript = parseTranscript(bodyData.transcript || "");

  return (
    <div className="min-h-screen w-full p-6 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Çağrı Raporu #{record.id}
          </h1>
          <p className="text-amber-700">
            {formatDate(record.created_at)} tarihinde oluşturuldu
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Genel Bilgiler */}
          <DataSection title="Genel Bilgiler" icon={FileText}>
            <div className="space-y-1">
              <InfoRow
                label="Çağrı Süresi"
                value={formatDuration(bodyData.durationSeconds)}
                description="Çağrının toplam süresi"
              />
              <InfoRow
                label="Toplam Maliyet"
                value={formatCurrency(bodyData.cost)}
                description="Bu çağrının API kullanım maliyeti"
              />
              <InfoRow
                label="Başlama Zamanı"
                value={formatDate(bodyData.startedAt)}
                description="Çağrının başladığı zaman"
              />
              <InfoRow
                label="Bitiş Zamanı"
                value={formatDate(bodyData.endedAt)}
                description="Çağrının bittiği zaman"
              />
              <InfoRow
                label="Bitiş Sebebi"
                value={
                  bodyData.endedReason === "customer-ended-call"
                    ? "Müşteri Kapattı"
                    : "Asistan Kapattı"
                }
                description="Çağrıyı kim sonlandırdı"
              />
            </div>
          </DataSection>

          {/* Asistan Bilgileri */}
          <DataSection title="Asistan Bilgileri" icon={User} color="blue">
            <div className="space-y-1">
              <InfoRow
                label="Asistan Adı"
                value={bodyData.assistant?.name || "Bilinmeyen"}
                description="Çağrıyı yöneten yapay zeka asistanı"
              />
              <InfoRow
                label="Ses ID"
                value={bodyData.assistant?.voice?.voiceId || "Belirtilmemiş"}
                description="Kullanılan ses profili"
              />
              <InfoRow
                label="Ses Sağlayıcısı"
                value={bodyData.assistant?.voice?.provider || "Belirtilmemiş"}
                description="Ses teknolojisi sağlayıcısı"
              />
              <InfoRow
                label="Başarı Durumu"
                value={
                  bodyData.analysis?.successEvaluation === "true" ? (
                    <span className="text-green-600 font-semibold">
                      Başarılı ✓
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Başarısız ✗
                    </span>
                  )
                }
                description="Çağrının amacına ulaşıp ulaşmadığı"
              />
            </div>
          </DataSection>
        </div>

        {/* Çağrı Analizi */}
        <div className="mb-8">
          <DataSection title="Çağrı Analizi" icon={Activity} color="green">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Çağrı Özeti:
                </h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {bodyData.summary ||
                    bodyData.analysis?.summary ||
                    "Özet bulunamadı"}
                </p>
              </div>
            </div>
          </DataSection>
        </div>

        {/* Geliştirilmiş Transkript Bölümü */}
        <div className="mb-8">
          <DataSection
            title="Konuşma Transkripti"
            icon={MessageCircle}
            color="indigo"
          >
            <div className="space-y-4">
              {/* Transkript Kontrol Butonları */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={copyTranscriptToClipboard}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    copiedTranscript
                      ? "bg-green-100 text-green-700"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedTranscript ? "Kopyalandı!" : "Kopyala"}</span>
                </button>
                <button
                  onClick={downloadTranscript}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>İndir</span>
                </button>
              </div>

              {/* Transkript İstatistikleri */}
              {bodyData.transcript && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-sm text-indigo-600 mb-1">
                      Toplam Kelime
                    </div>
                    <div className="text-lg font-bold text-indigo-800">
                      {bodyData.transcript.split(" ").length}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-sm text-indigo-600 mb-1">
                      Konuşmacı Sayısı
                    </div>
                    <div className="text-lg font-bold text-indigo-800">
                      {new Set(parsedTranscript.map((t) => t.speaker)).size}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-sm text-indigo-600 mb-1">
                      AI Mesajları
                    </div>
                    <div className="text-lg font-bold text-indigo-800">
                      {parsedTranscript.filter((t) => t.isAI).length}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-sm text-indigo-600 mb-1">
                      Müşteri Mesajları
                    </div>
                    <div className="text-lg font-bold text-indigo-800">
                      {parsedTranscript.filter((t) => t.isCustomer).length}
                    </div>
                  </div>
                </div>
              )}

              {/* Konuşma Akışı */}
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {parsedTranscript.length > 0 ? (
                  <div className="space-y-4">
                    {parsedTranscript.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item.id * 0.1 }}
                        className={`flex ${
                          item.isAI ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            item.isAI
                              ? "bg-indigo-100 text-indigo-900"
                              : item.isCustomer
                              ? "bg-green-100 text-green-900"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            {item.isAI ? (
                              <Bot className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                            <span className="text-sm font-semibold">
                              {item.speaker}
                            </span>
                            {item.timestamp && (
                              <span className="text-xs opacity-60">
                                {formatTime(item.timestamp)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Görüntülenecek transkript bulunamadı</p>
                  </div>
                )}
              </div>

              {/* Ham Transkript (İsteğe bağlı) */}
              {bodyData.transcript && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Ham Transkripti Göster
                  </summary>
                  <div className="mt-2 bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {bodyData.transcript}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </DataSection>
        </div>

        {/* Maliyet Dağılımı */}
        <div className="mb-8">
          <DataSection
            title="Maliyet Detayları"
            icon={DollarSign}
            color="emerald"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-sm text-emerald-600 mb-1">
                  Konuşmayı Yazıya Çevirme
                </div>
                <div className="text-lg font-bold text-emerald-800">
                  {formatCurrency(bodyData.costBreakdown?.stt || 0)}
                </div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-sm text-emerald-600 mb-1">
                  Yapay Zeka Modeli
                </div>
                <div className="text-lg font-bold text-emerald-800">
                  {formatCurrency(bodyData.costBreakdown?.llm || 0)}
                </div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-sm text-emerald-600 mb-1">
                  Yazıyı Sese Çevirme
                </div>
                <div className="text-lg font-bold text-emerald-800">
                  {formatCurrency(bodyData.costBreakdown?.tts || 0)}
                </div>
              </div>
              <div className="text-center p-3 bg-emerald-100 rounded-lg border-2 border-emerald-300">
                <div className="text-sm text-emerald-700 mb-1 font-semibold">
                  TOPLAM
                </div>
                <div className="text-lg font-bold text-emerald-900">
                  {formatCurrency(bodyData.costBreakdown?.total || 0)}
                </div>
              </div>
            </div>
          </DataSection>
        </div>

        {/* Kayıt Linkleri */}
        {(bodyData.recordingUrl || bodyData.stereoRecordingUrl) && (
          <div className="mb-8">
            <DataSection title="Ses Kayıtları" icon={PlayCircle} color="purple">
              <div className="space-y-3">
                {bodyData.recordingUrl && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-700">
                        Tekli Kanal Kayıt
                      </span>
                    </div>
                    <a
                      href={bodyData.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Dinle / İndir
                    </a>
                  </div>
                )}
                {bodyData.stereoRecordingUrl && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Headphones className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-700">
                        Stereo Kayıt
                      </span>
                    </div>
                    <a
                      href={bodyData.stereoRecordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Dinle / İndir
                    </a>
                  </div>
                )}
              </div>
            </DataSection>
          </div>
        )}

        {/* Teknik Detaylar Toggle */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-amber-200 text-amber-800 rounded-lg hover:bg-amber-300 transition-colors"
          >
            {showTechnicalDetails ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
            <span>
              {showTechnicalDetails
                ? "Teknik Detayları Gizle"
                : "Teknik Detayları Göster"}
            </span>
          </button>
        </div>

        {/* Teknik Detaylar */}
        {showTechnicalDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <DataSection title="Teknik Detaylar" icon={Settings} color="gray">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Performans Metrikleri:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">
                        Model Gecikmesi
                      </div>
                      <div className="font-bold">
                        {bodyData.artifact?.performanceMetrics
                          ?.modelLatencyAverage || 0}
                        ms
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">Ses Gecikmesi</div>
                      <div className="font-bold">
                        {bodyData.artifact?.performanceMetrics
                          ?.voiceLatencyAverage || 0}
                        ms
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">
                        Transkripsiyon Gecikmesi
                      </div>
                      <div className="font-bold">
                        {bodyData.artifact?.performanceMetrics
                          ?.transcriberLatencyAverage || 0}
                        ms
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Ham Veri (Geliştiriciler İçin):
                  </h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto max-h-96">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(bodyData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </DataSection>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CallRecordDashboard;
