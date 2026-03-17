import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ReferenceLine, Tooltip
} from "recharts";
import { ChevronRight, Target, RotateCcw, ListChecks, Award, BookOpen, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface Course {
  name: string;
  speciality: string;
  mastery: number;
  toRedo: number;
  qcmDone: number;
  lastReviewed: string;
}

interface ExpandableCourseRowProps {
  course: Course;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  filterType: string;
  isDark: boolean;
  history: Array<{ date: string; note: number }>;
  average: number;
  radarData: Array<{ tag: string; mastery: number }>;
  getPercentageColor: (val: number, isDark: boolean) => string;
}

export const ExpandableCourseRow = React.forwardRef<HTMLDivElement, ExpandableCourseRowProps>(function ExpandableCourseRow({
  course,
  index,
  isExpanded,
  onToggle,
  filterType,
  isDark,
  history,
  average,
  radarData,
  getPercentageColor
}, ref) {
  const isToRedo = filterType === "toRedo";
  const value = isToRedo ? course.toRedo : course.mastery;
  
  // Sanitize course name for use in SVG IDs
  const safeId = course.name.replace(/[^a-zA-Z0-9]/g, "-") + `-${index}`;

  // Color based on score - for toRedo: lower % = more urgent (red), higher % = good (green)
  const scoreColor = isToRedo 
    ? (value < 20 ? "#dc2626" : value < 35 ? "#ff8f00" : "#059669")
    : (value >= 80 ? "#059669" : value >= 60 ? "#ff8f00" : "#dc2626");
  
  const scoreBg = isToRedo
    ? (value < 20 ? "rgba(220,38,38,0.08)" : value < 35 ? "rgba(255,143,0,0.08)" : "rgba(5,150,105,0.08)")
    : (value >= 80 ? "rgba(5,150,105,0.08)" : value >= 60 ? "rgba(255,143,0,0.08)" : "rgba(220,38,38,0.08)");

  // Rank badge
  const getRankStyle = (idx: number) => {
    if (idx === 0) return { bg: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#78350f", shadow: "0 2px 8px rgba(251,191,36,0.3)" };
    if (idx === 1) return { bg: "linear-gradient(135deg, #d1d5db, #9ca3af)", color: "#374151", shadow: "0 2px 8px rgba(156,163,175,0.3)" };
    if (idx === 2) return { bg: "linear-gradient(135deg, #d97706, #b45309)", color: "#fff", shadow: "0 2px 8px rgba(217,119,6,0.3)" };
    return { bg: theme === "dark" ? "#1e293b" : "#f1f5f9", color: theme === "dark" ? "#94a3b8" : "#64748b", shadow: "none" };
  };
  const rankStyle = getRankStyle(index);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
    >
      {/* Main row */}
      <motion.div
        className="flex items-center px-4 py-3 cursor-pointer rounded-xl transition-all"
        style={{
          background: isExpanded 
            ? (theme === "dark" ? "rgba(79,124,255,0.08)" : "rgba(79,124,255,0.04)")
            : "rgba(79,124,255,0)",
        }}
        whileHover={{ 
          background: theme === "dark" ? "rgba(79,124,255,0.06)" : "rgba(79,124,255,0.03)",
          x: 2
        }}
        onClick={onToggle}
      >
        {/* Rank */}
        <div style={{ width: "36px" }} className="flex-shrink-0">
          <motion.div 
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ 
              background: rankStyle.bg, 
              color: rankStyle.color, 
              fontSize: "12px", 
              fontWeight: 700,
              boxShadow: rankStyle.shadow
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.04, type: "spring", stiffness: 300 }}
          >
            {index + 1}
          </motion.div>
        </div>

        {/* Course info */}
        <div className="flex-1 min-w-0 mr-3">
          <div className="truncate" style={{ 
            color: theme === "dark" ? "#f1f5f9" : "#1e293b",
            fontSize: "14px",
            fontWeight: 500
          }}>
            {course.name}
          </div>
          <div style={{ 
            color: theme === "dark" ? "#64748b" : "#94a3b8",
            fontSize: "12px"
          }}>
            {course.speciality}
          </div>
        </div>

        {/* QCM count */}
        <div className="hidden sm:flex items-center justify-center" style={{ width: "80px" }}>
          <span className="px-2 py-0.5 rounded-md" style={{
            fontSize: "12px",
            fontWeight: 500,
            background: theme === "dark" ? "#1e293b" : "#f1f5f9",
            color: theme === "dark" ? "#94a3b8" : "#64748b"
          }}>
            {course.qcmDone} QCM
          </span>
        </div>

        {/* Score bar + value */}
        <div className="flex items-center gap-3" style={{ width: "140px", justifyContent: "flex-end" }}>
          <div className="hidden md:block flex-1 h-2 rounded-full overflow-hidden" style={{
            background: theme === "dark" ? "#1e293b" : "#e2e8f0",
            maxWidth: "72px"
          }}>
            <motion.div 
              className="h-full rounded-full"
              style={{ background: scoreColor }}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
            />
          </div>
          <motion.span 
            className="px-2 py-0.5 rounded-lg"
            style={{ 
              fontSize: "14px", 
              fontWeight: 700, 
              color: scoreColor,
              background: scoreBg,
              minWidth: "48px",
              textAlign: "center"
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05, type: "spring" }}
          >
            {value}%
          </motion.span>
        </div>

        {/* Chevron */}
        <motion.div 
          style={{ width: "32px" }} 
          className="flex justify-center"
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} style={{ color: theme === "dark" ? "#475569" : "#94a3b8" }} />
        </motion.div>
      </motion.div>

      {/* Drill-down panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-3 rounded-xl overflow-hidden" style={{
              background: theme === "dark" ? "#0f172a" : "#ffffff",
              border: `1px solid ${theme === "dark" ? "#1e293b" : "#e2e8f0"}`,
              boxShadow: theme === "dark"
                ? "inset 0 2px 8px rgba(0,0,0,0.2)"
                : "inset 0 2px 8px rgba(0,0,0,0.03)"
            }}>
              {/* Drill-down header */}
              <div className="px-5 pt-4 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                    background: `linear-gradient(135deg, ${scoreColor}22, ${scoreColor}11)`,
                    border: `1px solid ${scoreColor}33`
                  }}>
                    {isToRedo 
                      ? <RotateCcw size={18} style={{ color: scoreColor }} />
                      : <Sparkles size={18} style={{ color: scoreColor }} />
                    }
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: "15px", 
                      fontWeight: 600,
                      color: theme === "dark" ? "#f1f5f9" : "#1e293b"
                    }}>
                      {course.name} — {course.speciality}
                    </div>
                    <div style={{ fontSize: "12px", color: theme === "dark" ? "#64748b" : "#94a3b8" }}>
                      Dernière révision: {course.lastReviewed}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    className="gap-1.5"
                    style={{ 
                      borderRadius: "10px", 
                      fontSize: "12px",
                      background: "#4f7cff",
                      color: "#fff"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BookOpen size={14} /> Réviser
                  </Button>
                </div>
              </div>

              {/* Stats mini cards */}
              <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Maîtrise", val: `${course.mastery}%`, color: getPercentageColor(course.mastery, theme), icon: <Target size={14} /> },
                  { label: "À refaire", val: `${course.toRedo}%`, color: getPercentageColor(100 - course.toRedo, theme), icon: <RotateCcw size={14} /> },
                  { label: "QCM faits", val: course.qcmDone.toString(), color: "#4f7cff", icon: <ListChecks size={14} /> },
                  { label: "Dernière note", val: `${history[history.length - 1]?.note || 0}/20`, color: getPercentageColor((history[history.length - 1]?.note || 0) * 5, theme), icon: <Award size={14} /> },
                ].map((stat, si) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-xl p-3 text-center"
                    style={{
                      background: theme === "dark" ? "#1e293b" : "#f8fafc",
                      border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: si * 0.05 }}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1" style={{ color: theme === "dark" ? "#64748b" : "#94a3b8" }}>
                      {stat.icon}
                      <span style={{ fontSize: "11px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        {stat.label}
                      </span>
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                      {stat.val}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mini progression chart + footer stats */}
              <div className="px-5 pb-4">
                <div className="w-full sm:w-1/2 mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ 
                      fontSize: "12px", 
                      fontWeight: 500, 
                      color: theme === "dark" ? "#94a3b8" : "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em"
                    }}>
                      Évolution des notes
                    </span>
                    <span style={{ 
                      fontSize: "12px", 
                      color: "#059669",
                      fontWeight: 600
                    }}>
                      Moy. {average.toFixed(1)}/20
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden" style={{
                    background: theme === "dark" ? "#1e293b" : "#f8fafc",
                    border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`
                  }}>
                    <div style={{ width: "100%", height: 160, minWidth: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history} id={`area-row-${safeId}`} margin={{ top: 12, right: 16, left: -16, bottom: 4 }}>
                        <defs key="defs">
                          <linearGradient id={`grad-row-${safeId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme === "dark" ? "#60a5fa" : "#4f7cff"} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={theme === "dark" ? "#60a5fa" : "#4f7cff"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid key="grid" strokeDasharray="3 3" stroke={theme === "dark" ? "#1e293b" : "#f1f5f9"} vertical={false} />
                        <XAxis
                          key="xaxis"
                          dataKey="date" 
                          stroke={theme === "dark" ? "#475569" : "#94a3b8"}
                          style={{ fontSize: "11px", fontWeight: 400 }}
                          tickLine={false}
                          axisLine={{ stroke: theme === "dark" ? "#334155" : "#e2e8f0", strokeWidth: 1 }}
                          dy={6}
                        />
                        <YAxis
                          key="yaxis"
                          domain={['dataMin - 2', 'dataMax + 2']}
                          stroke={theme === "dark" ? "#475569" : "#94a3b8"}
                          style={{ fontSize: "11px", fontWeight: 400 }}
                          tickLine={false}
                          axisLine={{ stroke: theme === "dark" ? "#334155" : "#e2e8f0", strokeWidth: 1 }}
                          dx={-6}
                        />
                        <Tooltip
                          key="tooltip"
                          content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                              return (
                                <div style={{
                                  backgroundColor: theme === "dark" ? "rgba(30,41,59,0.98)" : "rgba(255,255,255,0.98)",
                                  borderRadius: "10px",
                                  padding: "8px 12px",
                                  border: "none",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                                }}>
                                  <p style={{ marginBottom: "2px", color: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: "11px" }}>
                                    {payload[0].payload.date}
                                  </p>
                                  <p style={{ color: theme === "dark" ? "#60a5fa" : "#4f7cff", fontWeight: 700, fontSize: "15px", lineHeight: 1 }}>
                                    {payload[0].value}<span style={{ fontSize: "11px", fontWeight: 400 }}>/20</span>
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                          cursor={{ stroke: theme === "dark" ? "#f1f5f9" : "#1e293b", strokeWidth: 1.5 }}
                        />
                        <ReferenceLine
                          key="refline"
                          y={average} 
                          stroke="#059669" 
                          strokeDasharray="6 4" 
                          strokeWidth={1.5}
                        />
                        <Area
                          key="area"
                          type="monotone" 
                          dataKey="note" 
                          stroke={theme === "dark" ? "#60a5fa" : "#4f7cff"}
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill={`url(#grad-row-${safeId})`}
                          dot={false}
                          activeDot={{ r: 4, fill: theme === "dark" ? "#60a5fa" : "#4f7cff", strokeWidth: 2, stroke: "#fff" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Mini footer stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {[
                      { label: "Pire note", val: Math.min(...history.map(h => h.note)), color: "#dc2626", bg: theme === "dark" ? "rgba(220,38,38,0.1)" : "#fef2f2" },
                      { label: "Meilleure", val: Math.max(...history.map(h => h.note)), color: "#059669", bg: theme === "dark" ? "rgba(5,150,105,0.1)" : "#ecfdf5" },
                      { label: "Essais", val: history.length, color: "#ff8f00", bg: theme === "dark" ? "rgba(255,143,0,0.1)" : "#fff7ed" },
                    ].map((s) => (
                      <div 
                        key={s.label} 
                        className="rounded-lg p-2 text-center transition-all"
                        style={{ background: s.bg }}
                      >
                        <div style={{ fontSize: "10px", fontWeight: 400, color: s.color, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: "18px", fontWeight: 700, color: s.color, lineHeight: 1 }}>
                          {s.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});