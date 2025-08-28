"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Users,
  Globe,
  BookOpen,
  Building2,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

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
    transition={{ duration: 0.5 }}
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
  icon: Icon,
  title,
  description,
  highlight = false,
}: {
  icon: any;
  title: string;
  description: string;
  highlight?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex items-start space-x-4 p-4 rounded-xl transition-all hover:scale-[1.02] ${
      highlight
        ? "bg-amber-100 border-2 border-amber-300"
        : "bg-white/50 hover:bg-white/70"
    }`}
  >
    <div
      className={`p-2 rounded-lg ${
        highlight ? "bg-amber-200" : "bg-amber-100"
      }`}
    >
      <Icon
        className={`w-5 h-5 ${highlight ? "text-amber-800" : "text-amber-600"}`}
      />
    </div>
    <div className="flex-1">
      <h4
        className={`font-semibold mb-2 ${
          highlight ? "text-amber-900" : "text-amber-800"
        }`}
      >
        {title}
      </h4>
      <p
        className={`text-sm leading-relaxed ${
          highlight ? "text-amber-700" : "text-amber-600"
        }`}
      >
        {description}
      </p>
    </div>
  </motion.div>
);

export const WelcomeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-sm border-2 border-amber-300/40 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="relative p-8 pb-6">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-1 right-1 p-2 bg-white/80 backdrop-blur-sm rounded-full text-amber-700 hover:text-amber-900 hover:bg-white transition-all shadow-lg"
          >
            <X size={24} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-amber-200 rounded-2xl">
                <Building2 size={40} className="text-amber-800" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-amber-900">
                  WcanX Şantiye Eğitim Modülü
                </h2>
                <p className="text-amber-700 font-medium">
                  Kültürel ve Mesleki Uyum Asistanı
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-amber-200/50 to-orange-200/50 backdrop-blur-sm border border-amber-300/50 rounded-2xl p-4"
            >
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                Hoş Geldiniz! 🇹🇷 → 🇩🇪
              </h3>
              <p className="text-amber-800 leading-relaxed">
                Bu modül,{" "}
                <span className="font-bold text-amber-900">WcanX</span>{" "}
                tarafından Türkiye'den Almanya'ya giden çalışanların inşaat
                sektöründe başarılı olabilmeleri için özel olarak
                geliştirilmiştir.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 space-y-8">
          {/* Özellikler Bölümü */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <DataSection title="Modül Özellikleri" icon={Zap} color="blue">
              <div className="grid md:grid-cols-3 gap-4">
                <InfoRow
                  icon={Globe}
                  title="Kültürel Uyum"
                  description="Alman iş kültürü, sosyal yaşam kuralları ve davranış kodları hakkında kapsamlı rehberlik"
                />
                <InfoRow
                  icon={BookOpen}
                  title="Teknik Terimler"
                  description="İnşaat sektörüne özel Almanca terimler, güvenlik kuralları ve iş talimatları"
                />
                <InfoRow
                  icon={Users}
                  title="Etkili İletişim"
                  description="İş yerinde başarılı iletişim kurma, problem çözme ve takım çalışması becerileri"
                />
              </div>
            </DataSection>
          </motion.div>

          {/* Nasıl Çalışır Bölümü */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <DataSection
              title="Bu Asistan Size Nasıl Yardımcı Olur?"
              icon={CheckCircle}
              color="green"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <InfoRow
                  icon={AlertCircle}
                  title="Güvenlik ve Kurallar"
                  description="İnşaat sahası güvenlik kuralları, acil durum prosedürleri ve Alman iş güvenliği standartları hakkında bilgi verir"
                />
                <InfoRow
                  icon={BookOpen}
                  title="Dil ve Terminoloji"
                  description="Mesleki Almanca terimleri, günlük kullanılan ifadeler ve teknik dokümantasyon okuma becerilerini geliştirir"
                  highlight
                />
                <InfoRow
                  icon={Users}
                  title="Sosyal Entegrasyon"
                  description="Alman iş kültürüne uyum, meslektaşlarla ilişkiler ve günlük yaşam problemlerine pratik çözümler sunar"
                />
                <InfoRow
                  icon={Zap}
                  title="İnteraktif Öğrenme"
                  description="Sesli asistan ile gerçek zamanlı soru-cevap, pratik senaryolar ve kişiselleştirilmiş öğrenme deneyimi"
                  highlight
                />
              </div>
            </DataSection>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
            >
              Hadi Başlayalım! 🚀
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-amber-600 text-sm mt-4 bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50"
            >
              💡 <strong>İpucu:</strong> Mikrofon simgesine tıklayarak sesli
              asistanı kullanmaya başlayabilirsiniz. Almanca ve Türkçe
              sorularınızı cevaplayacak!
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
