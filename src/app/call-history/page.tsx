"use client";
import React from "react";
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
} from "lucide-react";

import { useAnalyticsVapi } from "@/hooks/use-analytics-vapi";

const AnalyticsDashboard: React.FC = () => {
  const { records, loading, error } = useAnalyticsVapi();

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

  // Analytics verilerini işle
  const processAnalytics = () => {
    if (!records || records.length === 0) return null;

    const totalCalls = records.length;
    let totalCost = 0;
    let completedCalls = 0;
    const averageDuration = 0;
    const statusCounts: { [key: string]: number } = {};
    const assistantCounts: { [key: string]: number } = {};

    records.forEach((record) => {
      try {
        const data = JSON.parse(record.body);

        if (data.call) {
          totalCost += data.call.cost || 0;
          const status = data.call.status || "unknown";
          statusCounts[status] = (statusCounts[status] || 0) + 1;

          if (status === "completed") completedCalls++;
        }

        if (data.assistant) {
          const assistantName = data.assistant.name || "Bilinmeyen";
          assistantCounts[assistantName] =
            (assistantCounts[assistantName] || 0) + 1;
        }
      } catch (e) {
        console.error("Veri işlenirken hata:", e);
      }
    });

    return {
      totalCalls,
      totalCost,
      completedCalls,
      completionRate:
        totalCalls > 0 ? ((completedCalls / totalCalls) * 100).toFixed(1) : 0,
      statusCounts,
      assistantCounts,
    };
  };

  const analytics = processAnalytics();

  if (!analytics) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center max-w-md"
        >
          <MessageCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-amber-800 mb-2">
            Henüz Veri Yok
          </h3>
          <p className="text-amber-600">
            Görüntülenecek analitik veri bulunamadı.
          </p>
        </motion.div>
      </div>
    );
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "amber",
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/40 backdrop-blur-sm border-2 border-${color}-300/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 text-${color}-600`} />
        <span className={`text-3xl font-bold text-${color}-800`}>{value}</span>
      </div>
      <h3 className={`text-lg font-semibold text-${color}-800 mb-1`}>
        {title}
      </h3>
      {subtitle && <p className={`text-sm text-${color}-600`}>{subtitle}</p>}
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full p-6 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-amber-700">Sesli asistan performans metrikleri</p>
        </motion.div>

        {/* Ana İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Phone}
            title="Toplam Çağrı"
            value={analytics.totalCalls}
            subtitle="Tüm çağrılar"
          />

          <StatCard
            icon={CheckCircle}
            title="Tamamlanma Oranı"
            value={`${analytics.completionRate}%`}
            subtitle="Başarılı çağrılar"
            color="emerald"
          />

          <StatCard
            icon={DollarSign}
            title="Toplam Maliyet"
            value={`$${analytics.totalCost.toFixed(2)}`}
            subtitle="API kullanım maliyeti"
            color="orange"
          />

          <StatCard
            icon={TrendingUp}
            title="Aktif Asistanlar"
            value={Object.keys(analytics.assistantCounts).length}
            subtitle="Farklı asistan sayısı"
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Durum Dağılımı */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/40 backdrop-blur-sm border-2 border-amber-300/30 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Çağrı Durumları
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-amber-700 capitalize">
                    {status === "queued"
                      ? "Beklemede"
                      : status === "completed"
                      ? "Tamamlandı"
                      : status === "failed"
                      ? "Başarısız"
                      : status}
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-amber-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(count / analytics.totalCalls) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-amber-800 font-semibold min-w-[2rem] text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Asistan Dağılımı */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/40 backdrop-blur-sm border-2 border-amber-300/30 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Asistan Kullanımı
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.assistantCounts).map(
                ([assistant, count]) => (
                  <div
                    key={assistant}
                    className="flex items-center justify-between"
                  >
                    <span className="text-amber-700 font-medium">
                      {assistant}
                    </span>
                    <div className="flex items-center">
                      <div className="w-32 bg-orange-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(count / analytics.totalCalls) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-orange-800 font-semibold min-w-[2rem] text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>

        {/* Son Çağrılar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white/40 backdrop-blur-sm border-2 border-amber-300/30 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
            <Clock className="w-6 h-6 mr-2" />
            Son Çağrılar
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-300">
                  <th className="text-left text-amber-800 font-semibold py-3">
                    Tarih
                  </th>
                  <th className="text-left text-amber-800 font-semibold py-3">
                    Asistan
                  </th>
                  <th className="text-left text-amber-800 font-semibold py-3">
                    Durum
                  </th>
                  <th className="text-left text-amber-800 font-semibold py-3">
                    Maliyet
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 5).map((record, index) => {
                  let callData;
                  try {
                    callData = JSON.parse(record.body);
                  } catch {
                    callData = {};
                  }

                  return (
                    <tr
                      key={record.id}
                      className="border-b border-amber-200/50"
                    >
                      <td className="py-3 text-amber-700">
                        {new Date(record.created_at).toLocaleDateString(
                          "tr-TR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                      <td className="py-3 text-amber-700">
                        {callData.assistant?.name || "Bilinmeyen"}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            callData.call?.status === "completed"
                              ? "bg-emerald-200 text-emerald-800"
                              : callData.call?.status === "queued"
                              ? "bg-yellow-200 text-yellow-800"
                              : callData.call?.status === "failed"
                              ? "bg-red-200 text-red-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {callData.call?.status === "queued"
                            ? "Beklemede"
                            : callData.call?.status === "completed"
                            ? "Tamamlandı"
                            : callData.call?.status === "failed"
                            ? "Başarısız"
                            : callData.call?.status || "Bilinmeyen"}
                        </span>
                      </td>
                      <td className="py-3 text-amber-700">
                        ${(callData.call?.cost || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
