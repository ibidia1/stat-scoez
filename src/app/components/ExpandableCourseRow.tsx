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
  jour: number;
  item: number;
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

export const ExpandableCourseRow = React.forwardRef<HTMLDivElement, ExpandableCourseRowProps>(
  function ExpandableCourseRow({
    course, index, isExpanded, onToggle, filterType, isDark,
    history, average, getPercentageColor
  }, ref) {
    const isToRedo = filterType === "toRedo";
    const value = isToRedo ? course.toRedo : course.mastery;
    const safeId = course.name.replace(/[^a-zA-Z0-9]/g, "-") + `-${index}`;

    const scoreColor = isToRedo
      ? (value > 35 ? "#dc2626" : value > 20 ? "#ff8f00" : "#059669")
      : (value >= 80 ? "#059669" : value >= 60 ? "#ff8f00" : "#dc2626");

    const scoreBg = isToRedo
      ? (value > 35 ? "rgba(220,38,38,0.08)" : value > 20 ? "rgba(255,143,0,0.08)" : "rgba(5,150,105,0.08)")
      : (value >= 80 ? "rgba(5,150,105,0.08)" : value >= 60 ? "rgba(255,143,0,0.08)" : "rgba(220,38,38,0.08)");

    const getRankStyle = (idx: number) => {
      if (idx === 0) return { bg: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#78350f", shadow: "0 2px 8px rgba(251,191,36,0.3)" };
      if (idx === 1) return { bg: "linear-gradient(135deg, #d1d5db, #9ca3af)", color: "#374151", shadow: "0 2px 8px rgba(156,163,175,0.3)" };
      if (idx === 2) return { bg: "linear-gradient(135deg, #d97706, #b45309)", color: "#fff", shadow: "0 2px 8px rgba(217,119,6,0.3)" };
      return {
        bg: isDark ? "#1e293b" : "#f1f5f9",
        color: isDark ? "#94a3b8" : "#64748b",
        shadow: "none"
      };
    };
    const rankStyle = getRankStyle(index);

    const gridColor = isDark ? "#1e293b" : "#f1f5f9";
    const axisColor = isDark ? "#475569" : "#94a3b8";
    const axisLineColor = isDark ? "#334155" : "#e2e8f0";
    const tooltipBg = isDark ? "rgba(30,41,59,0.98)" : "rgba(255,255,255,0.98)";
    const tooltipTextColor = isDark ? "#94a3b8" : "#64748b";
    const trackBg = isDark ? "#1e293b" : "#e2e8f0";
    const miniCardBg = isDark ? "#1e293b" : "#f8fafc";
    const miniCardBorder = isDark ? "#334155" : "#e2e8f0";
    const panelBg = isDark ? "#0f172a" : "#ffffff";
    const panelBorder = isDark ? "#1e293b" : "#e2e8f0";
    const rowExpandedBg = isDark ? "rgba(79,124,255,0.08)" : "rgba(79,124,255,0.04)";
    const rowHoverBg = isDark ? "rgba(79,124,255,0.06)" : "rgba(79,124,255,0.03)";

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
          style={{ background: isExpanded ? rowExpandedBg : "rgba(79,124,255,0)" }}
          whileHover={{ background: rowHoverBg, x: 2 }}
          onClick={onToggle}
        >
          {/* Rank */}
          <div style={{ width: "36px" }} className="flex-shrink-0">
            <motion.div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: rankStyle.bg, color: rankStyle.color, fontSize: "12px", fontWeight: 700, boxShadow: rankStyle.shadow }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.04, type: "spring", stiffness: 300 }}
            >
              {index + 1}
            </motion.div>
          </div>

          {/* Course info */}
          <div className="flex-1 min-w-0 mr-3">
            <div className="truncate text-[14px] font-medium text-foreground">{course.name}</div>
            <div className="text-[12px] text-muted-foreground">{course.speciality}</div>
          </div>

          {/* QCM count */}
          <div className="hidden sm:flex items-center justify-center" style={{ width: "80px" }}>
            <span className="px-2 py-0.5 rounded-md text-[12px] font-medium bg-muted text-muted-foreground">
              {course.qcmDone} QCM
            </span>
          </div>

          {/* Score bar + value */}
          <div className="flex items-center gap-3" style={{ width: "140px", justifyContent: "flex-end" }}>
            <div className="hidden md:block flex-1 h-2 rounded-full overflow-hidden" style={{ background: trackBg, maxWidth: "72px" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: scoreColor }}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
              />
            </div>
            <motion.span
              className="px-2 py-0.5 rounded-lg text-[14px] font-bold text-center"
              style={{ color: scoreColor, background: scoreBg, minWidth: "48px" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05, type: "spring" }}
            >
              {value}%
            </motion.span>
          </div>

          {/* Chevron */}
          <motion.div style={{ width: "32px" }} className="flex justify-center"
            animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={16} className="text-muted-foreground" />
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
              <div className="mx-4 mb-3 rounded-xl overflow-hidden"
                style={{ background: panelBg, border: `1px solid ${panelBorder}`, boxShadow: isDark ? "inset 0 2px 8px rgba(0,0,0,0.2)" : "inset 0 2px 8px rgba(0,0,0,0.03)" }}>

                {/* Header */}
                <div className="px-5 pt-4 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${scoreColor}22, ${scoreColor}11)`, border: `1px solid ${scoreColor}33` }}>
                      {isToRedo
                        ? <RotateCcw size={18} style={{ color: scoreColor }} />
                        : <Sparkles size={18} style={{ color: scoreColor }} />}
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-foreground">{course.name} — {course.speciality}</div>
                      <div className="text-[12px] text-muted-foreground">Dernière révision: {course.lastReviewed}</div>
                    </div>
                  </div>
                  <Button size="sm" className="gap-1.5 rounded-[10px] text-[12px] bg-primary text-primary-foreground"
                    onClick={(e) => e.stopPropagation()}>
                    <BookOpen size={14} /> Réviser
                  </Button>
                </div>

                {/* Stats mini cards */}
                <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Maîtrise", val: `${course.mastery}%`, color: getPercentageColor(course.mastery, isDark), icon: <Target size={14} /> },
                    { label: "À refaire", val: `${course.toRedo}%`, color: getPercentageColor(100 - course.toRedo, isDark), icon: <RotateCcw size={14} /> },
                    { label: "QCM faits", val: course.qcmDone.toString(), color: "#4f7cff", icon: <ListChecks size={14} /> },
                    { label: "Dernière note", val: `${history[history.length - 1]?.note ?? 0}/20`, color: getPercentageColor((history[history.length - 1]?.note ?? 0) * 5, isDark), icon: <Award size={14} /> },
                  ].map((stat, si) => (
                    <motion.div key={stat.label} className="rounded-xl p-3 text-center"
                      style={{ background: miniCardBg, border: `1px solid ${miniCardBorder}` }}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: si * 0.05 }}>
                      <div className="flex items-center justify-center gap-1 mb-1 text-muted-foreground">
                        {stat.icon}
                        <span className="text-[11px] font-normal uppercase tracking-wide">{stat.label}</span>
                      </div>
                      <div className="text-[20px] font-bold leading-none" style={{ color: stat.color }}>{stat.val}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart */}
                <div className="px-5 pb-4">
                  <div className="w-full sm:w-1/2 mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Évolution des notes</span>
                      <span className="text-[12px] font-semibold" style={{ color: "#059669" }}>Moy. {average.toFixed(1)}/20</span>
                    </div>
                    <div className="rounded-xl overflow-hidden" style={{ background: miniCardBg, border: `1px solid ${miniCardBorder}` }}>
                      <div style={{ width: "100%", height: 160, minWidth: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={history} id={`area-row-${safeId}`} margin={{ top: 12, right: 16, left: -16, bottom: 4 }}>
                            <defs>
                              <linearGradient id={`grad-row-${safeId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f7cff" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4f7cff" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis dataKey="date" stroke={axisColor} style={{ fontSize: "11px" }} tickLine={false}
                              axisLine={{ stroke: axisLineColor, strokeWidth: 1 }} dy={6} />
                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke={axisColor}
                              style={{ fontSize: "11px" }} tickLine={false}
                              axisLine={{ stroke: axisLineColor, strokeWidth: 1 }} dx={-6} />
                            <Tooltip
                              content={({ active, payload }: any) => {
                                if (active && payload?.length) {
                                  return (
                                    <div style={{ backgroundColor: tooltipBg, borderRadius: "10px", padding: "8px 12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                                      <p style={{ marginBottom: "2px", color: tooltipTextColor, fontSize: "11px" }}>{payload[0].payload.date}</p>
                                      <p style={{ color: "#4f7cff", fontWeight: 700, fontSize: "15px", lineHeight: 1 }}>
                                        {payload[0].value}<span style={{ fontSize: "11px", fontWeight: 400 }}>/20</span>
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                              cursor={{ stroke: isDark ? "#f1f5f9" : "#1e293b", strokeWidth: 1.5 }}
                            />
                            <ReferenceLine y={average} stroke="#059669" strokeDasharray="6 4" strokeWidth={1.5} />
                            <Area type="monotone" dataKey="note" stroke="#4f7cff" strokeWidth={3}
                              fillOpacity={1} fill={`url(#grad-row-${safeId})`} dot={false}
                              activeDot={{ r: 4, fill: "#4f7cff", strokeWidth: 2, stroke: "#fff" }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Mini footer stats */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {[
                        { label: "Pire note", val: Math.min(...history.map(h => h.note)), colorClass: "text-red-600 dark:text-red-400", bgClass: "bg-red-50 dark:bg-red-950/30" },
                        { label: "Meilleure", val: Math.max(...history.map(h => h.note)), colorClass: "text-green-600 dark:text-green-400", bgClass: "bg-green-50 dark:bg-green-950/30" },
                        { label: "Essais", val: history.length, colorClass: "text-orange-500 dark:text-orange-400", bgClass: "bg-orange-50 dark:bg-orange-950/30" },
                      ].map((s) => (
                        <div key={s.label} className={`rounded-lg p-2 text-center ${s.bgClass}`}>
                          <div className={`text-[10px] font-normal uppercase tracking-wide mb-0.5 opacity-80 ${s.colorClass}`}>{s.label}</div>
                          <div className={`text-[18px] font-bold leading-none ${s.colorClass}`}>{s.val}</div>
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
  }
);
