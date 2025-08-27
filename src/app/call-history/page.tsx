// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Phone,
//   MessageCircle,
//   Clock,
//   TrendingUp,
//   Users,
//   Activity,
// } from "lucide-react";
// import { useVapiAnalytics } from "@/hooks/use-vapi-analytics";

// const AnalyticsDashboard = () => {
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState("7d");
//   const [realTimeData, setRealTimeData] = useState({
//     activeCalls: 0,
//     volumeLevel: 0,
//     messagesPerMinute: 0,
//   });
//   const { data: analyticsData } = useVapiAnalytics();

//   console.log("Fetched analytics data:", analyticsData);

//   // Mock data - gerçek API'nizle değiştirin
//   const mockData = {
//     callMetrics: {
//       total_calls: [{ result: 245 }],
//       avg_call_duration: [{ result: 127.5 }],
//       successful_calls: [{ result: 221 }],
//       calls_by_assistant: [
//         { assistantId: "asst_1", result: 125 },
//         { assistantId: "asst_2", result: 89 },
//         { assistantId: "asst_3", result: 31 },
//       ],
//     },
//     messageMetrics: {
//       total_messages: [{ result: 1847 }],
//       messages_by_type: [
//         { type: "transcript", result: 1024 },
//         { type: "function_call", result: 342 },
//         { type: "error", result: 23 },
//         { type: "other", result: 458 },
//       ],
//     },
//     recentCalls: [
//       {
//         id: "1",
//         status: "ended",
//         duration: 145,
//         createdAt: "2024-01-15T10:30:00Z",
//       },
//       {
//         id: "2",
//         status: "ended",
//         duration: 89,
//         createdAt: "2024-01-15T09:15:00Z",
//       },
//       {
//         id: "3",
//         status: "failed",
//         duration: 12,
//         createdAt: "2024-01-15T08:45:00Z",
//       },
//     ],
//   };

//   useEffect(() => {
//     // Gerçek API çağrısı
//     const fetchAnalytics = async () => {
//       try {
//         setLoading(true);
//         // const response = await fetch(`/api/analytics?range=${timeRange}`);
//         // const data = await response.json();
//         // setAnalytics(data);

//         // Mock data kullanımı
//         setTimeout(() => {
//           setAnalytics(mockData);
//           setLoading(false);
//         }, 1000);
//       } catch (error) {
//         console.error("Analytics fetch error:", error);
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();

//     // Real-time updates simulation
//     const interval = setInterval(() => {
//       setRealTimeData((prev) => ({
//         activeCalls: Math.floor(Math.random() * 10),
//         volumeLevel: Math.random() * 100,
//         messagesPerMinute: Math.floor(Math.random() * 50) + 10,
//       }));
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [timeRange]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
//           <p className="mt-4 text-amber-800">Analytics yükleniyor...</p>
//         </div>
//       </div>
//     );
//   }

//   const totalCalls = analytics?.callMetrics?.total_calls?.[0]?.result || 0;
//   const avgDuration =
//     analytics?.callMetrics?.avg_call_duration?.[0]?.result || 0;
//   const successfulCalls =
//     analytics?.callMetrics?.successful_calls?.[0]?.result || 0;
//   const successRate =
//     totalCalls > 0 ? ((successfulCalls / totalCalls) * 100).toFixed(1) : 0;

//   const pieData =
//     analytics?.callMetrics?.calls_by_assistant?.map((item) => ({
//       name: `Assistant ${item.assistantId.slice(-1)}`,
//       value: item.result,
//       fill:
//         item.assistantId === "asst_1"
//           ? "#f59e0b"
//           : item.assistantId === "asst_2"
//           ? "#ea580c"
//           : "#dc2626",
//     })) || [];

//   const messageTypeData =
//     analytics?.messageMetrics?.messages_by_type?.map((item) => ({
//       name: item.type,
//       value: item.result,
//     })) || [];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-amber-900 mb-2">
//             Vapi Analytics Dashboard
//           </h1>
//           <div className="flex items-center justify-between">
//             <p className="text-amber-700">
//               Son{" "}
//               {timeRange === "7d"
//                 ? "7 gün"
//                 : timeRange === "30d"
//                 ? "30 gün"
//                 : "24 saat"}{" "}
//               içindeki veriler
//             </p>
//             <div className="flex gap-2">
//               {["24h", "7d", "30d"].map((range) => (
//                 <button
//                   key={range}
//                   onClick={() => setTimeRange(range)}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                     timeRange === range
//                       ? "bg-amber-600 text-white"
//                       : "bg-white text-amber-800 hover:bg-amber-100"
//                   }`}
//                 >
//                   {range}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Real-time Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-amber-600">
//                   Aktif Çağrılar
//                 </p>
//                 <p className="text-2xl font-bold text-amber-900">
//                   {realTimeData.activeCalls}
//                 </p>
//               </div>
//               <Activity className="h-8 w-8 text-amber-600" />
//             </div>
//             <div className="mt-2 flex items-center">
//               <div
//                 className={`h-2 w-2 rounded-full mr-2 ${
//                   realTimeData.activeCalls > 0 ? "bg-green-500" : "bg-gray-400"
//                 }`}
//               ></div>
//               <span className="text-xs text-amber-700">Canlı</span>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-amber-600">
//                   Ses Seviyesi
//                 </p>
//                 <p className="text-2xl font-bold text-amber-900">
//                   {Math.round(realTimeData.volumeLevel)}
//                 </p>
//               </div>
//               <div className="h-8 w-8 bg-amber-600 rounded-full flex items-center justify-center">
//                 <div
//                   className="bg-orange-300 rounded-full transition-all duration-200"
//                   style={{
//                     width: `${Math.max(
//                       4,
//                       (realTimeData.volumeLevel / 100) * 20
//                     )}px`,
//                     height: `${Math.max(
//                       4,
//                       (realTimeData.volumeLevel / 100) * 20
//                     )}px`,
//                   }}
//                 ></div>
//               </div>
//             </div>
//             <div className="mt-2 w-full bg-amber-200 rounded-full h-2">
//               <div
//                 className="bg-amber-600 h-2 rounded-full transition-all duration-200"
//                 style={{ width: `${realTimeData.volumeLevel}%` }}
//               ></div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-amber-600">
//                   Mesaj/Dakika
//                 </p>
//                 <p className="text-2xl font-bold text-amber-900">
//                   {realTimeData.messagesPerMinute}
//                 </p>
//               </div>
//               <MessageCircle className="h-8 w-8 text-amber-600" />
//             </div>
//             <p className="text-xs text-amber-700 mt-2">
//               Gerçek zamanlı mesaj trafiği
//             </p>
//           </div>
//         </div>

//         {/* Main Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-amber-600">
//                   Toplam Çağrı
//                 </p>
//                 <p className="text-3xl font-bold text-amber-900">
//                   {totalCalls}
//                 </p>
//               </div>
//               <Phone className="h-8 w-8 text-amber-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-amber-600">Ort. Süre</p>
//                 <p className="text-3xl font-bold text-amber-900">
//                   {Math.round(avgDuration)}s
//                 </p>
//               </div>
//               <Clock className="h-8 w-8 text-amber-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-amber-600">
//                   Başarı Oranı
//                 </p>
//                 <p className="text-3xl font-bold text-amber-900">
//                   {successRate}%
//                 </p>
//               </div>
//               <TrendingUp className="h-8 w-8 text-amber-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-amber-600">
//                   Toplam Mesaj
//                 </p>
//                 <p className="text-3xl font-bold text-amber-900">
//                   {analytics?.messageMetrics?.total_messages?.[0]?.result || 0}
//                 </p>
//               </div>
//               <MessageCircle className="h-8 w-8 text-amber-600" />
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//             <h3 className="text-lg font-semibold text-amber-900 mb-4">
//               Asistan Bazlı Çağrı Dağılımı
//             </h3>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   dataKey="value"
//                   label={({ name, value }) => `${name}: ${value}`}
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.fill} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//             <h3 className="text-lg font-semibold text-amber-900 mb-4">
//               Mesaj Türleri
//             </h3>
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={messageTypeData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" />
//                 <XAxis dataKey="name" stroke="#92400e" />
//                 <YAxis stroke="#92400e" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#fffbeb",
//                     border: "1px solid #fbbf24",
//                     borderRadius: "8px",
//                   }}
//                 />
//                 <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Calls */}
//         <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
//           <h3 className="text-lg font-semibold text-amber-900 mb-4">
//             Son Çağrılar
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-amber-200">
//                   <th className="text-left py-3 px-4 font-medium text-amber-800">
//                     Çağrı ID
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-amber-800">
//                     Durum
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-amber-800">
//                     Süre
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-amber-800">
//                     Tarih
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {analytics?.recentCalls?.map((call) => (
//                   <tr
//                     key={call.id}
//                     className="border-b border-amber-100 hover:bg-amber-50"
//                   >
//                     <td className="py-3 px-4 font-mono text-sm text-amber-900">
//                       {call.id}
//                     </td>
//                     <td className="py-3 px-4">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           call.status === "ended"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {call.status === "ended" ? "Başarılı" : "Başarısız"}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 text-amber-900">
//                       {call.duration}s
//                     </td>
//                     <td className="py-3 px-4 text-amber-700 text-sm">
//                       {new Date(call.createdAt).toLocaleString("tr-TR")}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyticsDashboard;

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
