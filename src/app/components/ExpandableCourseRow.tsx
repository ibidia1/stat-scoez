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
      if (idx === 2) return { bg: "linear-gradient(135deg, #d97706, #b45309)", color: "#fff",    shadow: "0 2px 8px rgba(217,119,6,0.3)" };
      return { bg: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b", shadow: "none" };
    };
    const rankStyle = getRankStyle(index);

    const gridColor      = isDark ? "#1e293b"               : "#f1f5f9";
    const axisColor      = isDark ? "#475569"               : "#94a3b8";
    const axisLine       = isDark ? "#334155"               : "#e2e8f0";
    const tooltipBg      = isDark ? "rgba(30,41,59,0.98)"   : "rgba(255,255,255,0.98)";
    const tooltipText    = isDark ? "#94a3b8"               : "#64748b";
    const trackBg        = isDark ? "#1e293b"               : "#e2e8f0";
    const miniCardBg     = isDark ? "#1e293b"               : "#f8fafc";
    const miniCardBorder = isDark ? "#334155"               : "#e2e8f0";
    const panelBg        = isDark ? "#0f172a"               : "#ffffff";
    const panelBorder    = isDark ? "#1e293b"               : "#e2e8f0";

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, delay: index * 0.02 }}
      >
        {/* ── Main row ──────────────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center px-2 sm:px-4 py-3 cursor-pointer rounded-xl"
          style={{ background: isExpanded ? (isDark ? "rgba(79,124,255,0.08)" : "rgba(79,124,255,0.04)") : "transparent" }}
          whileHover={{ background: isDark ? "rgba(79,124,255,0.06)" : "rgba(79,124,255,0.03)", x: 2 }}
          onClick={onToggle}
        >
          {/* Rank */}
          <div className="flex-shrink-0" style={{ width: "28px" }}>
            <motion.div
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[11px] sm:text-[12px] font-bold"
              style={{ background: rankStyle.bg, color: rankStyle.color, boxShadow: rankStyle.shadow }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.04, type: "spring", stiffness: 300 }}
            >
              {index + 1}
            </motion.div>
          </div>

          {/* Course info */}
          <div className="flex-1 min-w-0 mx-2 sm:mx-3">
            <div className="truncate text-[13px] sm:text-[14px] font-medium text-foreground">
              {course.name}
            </div>
            <div className="text-[11px] sm:text-[12px] text-muted-foreground truncate">
              {course.speciality}
            </div>
          </div>

          {/* QCM — masqué sur mobile */}
          <div className="hidden sm:flex items-center justify-center flex-shrink-0" style={{ width: "80px" }}>
            <span className="px-2 py-0.5 rounded-md text-[12px] font-medium bg-muted text-muted-foreground whitespace-nowrap">
              {course.qcmDone} QCM
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Barre de progression — masquée sur mobile */}
            <div className="hidden md:block h-2 rounded-full overflow-hidden" style={{ background: trackBg, width: "56px" }}>
              <motion.div className="h-full rounded-full" style={{ background: scoreColor }}
                initial={{ width: 0 }} animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }} />
            </div>
            <motion.span
              className="px-1.5 sm:px-2 py-0.5 rounded-lg text-[13px] sm:text-[14px] font-bold text-center"
              style={{ color: scoreColor, background: scoreBg, minWidth: "44px" }}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: index * 0.05, type: "spring" }}
            >
              {value}%
            </motion.span>
          </div>

          {/* Chevron */}
          <motion.div className="flex justify-center flex-shrink-0 ml-1" style={{ width: "22px" }}
            animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={14} className="text-muted-foreground" />
          </motion.div>
        </motion.div>

        {/* ── Drill-down panel ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mx-2 sm:mx-4 mb-3 rounded-xl overflow-hidden"
                style={{ background: panelBg, border: `1px solid ${panelBorder}`, boxShadow: isDark ? "inset 0 2px 8px rgba(0,0,0,0.2)" : "inset 0 2px 8px rgba(0,0,0,0.03)" }}>

                {/* Header */}
                <div className="px-4 sm:px-5 pt-4 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `linear-gradient(135deg, ${scoreColor}22, ${scoreColor}11)`, border: `1px solid ${scoreColor}33` }}>
                      {isToRedo
                        ? <RotateCcw size={15} style={{ color: scoreColor }} />
                        : <Sparkles size={15} style={{ color: scoreColor }} />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-foreground leading-snug">{course.name}</div>
                      <div className="text-[11px] text-muted-foreground">{course.speciality} · {course.lastReviewed}</div>
                    </div>
                  </div>
                  <Button size="sm" className="gap-1.5 rounded-[10px] text-[12px] bg-primary text-primary-foreground w-full sm:w-auto flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}>
                    <BookOpen size={13} /> Réviser
                  </Button>
                </div>

                {/* Stats mini cards — 2 cols mobile, 4 cols sm+ */}
                <div className="px-4 sm:px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[
                    { label: "Maîtrise",      val: `${course.mastery}%`,   color: getPercentageColor(course.mastery, isDark),       icon: <Target size={12} /> },
                    { label: "À refaire",     val: `${course.toRedo}%`,    color: getPercentageColor(100 - course.toRedo, isDark),  icon: <RotateCcw size={12} /> },
                    { label: "QCM faits",     val: `${course.qcmDone}`,    color: "#4f7cff",                                        icon: <ListChecks size={12} /> },
                    { label: "Dernière note", val: `${history[history.length - 1]?.note ?? 0}/20`,
                      color: getPercentageColor((history[history.length - 1]?.note ?? 0) * 5, isDark),                              icon: <Award size={12} /> },
                  ].map((stat, si) => (
                    <motion.div key={stat.label} className="rounded-xl p-2 sm:p-3 text-center"
                      style={{ background: miniCardBg, border: `1px solid ${miniCardBorder}` }}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: si * 0.05 }}>
                      <div className="flex items-center justify-center gap-1 mb-1 text-muted-foreground">
                        {stat.icon}
                        <span className="text-[10px] sm:text-[11px] uppercase tracking-wide">{stat.label}</span>
                      </div>
                      <div className="text-[16px] sm:text-[19px] font-bold leading-none" style={{ color: stat.color }}>
                        {stat.val}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart — pleine largeur sur mobile, centrée sur desktop */}
                <div className="px-4 sm:px-5 pb-4">
                  <div className="w-full sm:w-2/3 lg:w-1/2 mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        Évolution des notes
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: "#059669" }}>
                        Moy. {average.toFixed(1)}/20
                      </span>
                    </div>
                    <div className="rounded-xl overflow-hidden" style={{ background: miniCardBg, border: `1px solid ${miniCardBorder}` }}>
                      <div style={{ width: "100%", height: 130 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={history} id={`area-row-${safeId}`} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                            <defs>
                              <linearGradient id={`grad-row-${safeId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#4f7cff" stopOpacity={0.7} />
                                <stop offset="95%" stopColor="#4f7cff" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis dataKey="date" stroke={axisColor} style={{ fontSize: "10px" }} tickLine={false}
                              axisLine={{ stroke: axisLine }} dy={4} />
                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke={axisColor}
                              style={{ fontSize: "10px" }} tickLine={false} axisLine={{ stroke: axisLine }} />
                            <Tooltip
                              content={({ active, payload }: any) => {
                                if (!active || !payload?.length) return null;
                                return (
                                  <div style={{ backgroundColor: tooltipBg, borderRadius: "8px", padding: "6px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
                                    <p style={{ color: tooltipText, fontSize: "10px", marginBottom: "2px" }}>{payload[0].payload.date}</p>
                                    <p style={{ color: "#4f7cff", fontWeight: 700, fontSize: "14px", lineHeight: 1 }}>
                                      {payload[0].value}<span style={{ fontSize: "10px", fontWeight: 400 }}>/20</span>
                                    </p>
                                  </div>
                                );
                              }}
                              cursor={{ stroke: isDark ? "#f1f5f9" : "#1e293b", strokeWidth: 1.5 }}
                            />
                            <ReferenceLine y={average} stroke="#059669" strokeDasharray="5 3" strokeWidth={1.5} />
                            <Area type="monotone" dataKey="note" stroke="#4f7cff" strokeWidth={2.5}
                              fillOpacity={1} fill={`url(#grad-row-${safeId})`} dot={false}
                              activeDot={{ r: 4, fill: "#4f7cff", strokeWidth: 2, stroke: "#fff" }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Footer stats */}
                    <div className="grid grid-cols-3 gap-2 mt-2 sm:mt-3">
                      {[
                        { label: "Pire",      val: Math.min(...history.map(h => h.note)), c: "text-red-600 dark:text-red-400",    bg: "bg-red-50 dark:bg-red-950/30" },
                        { label: "Meilleure", val: Math.max(...history.map(h => h.note)), c: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30" },
                        { label: "Essais",    val: history.length,                        c: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30" },
                      ].map((s) => (
                        <div key={s.label} className={`rounded-lg p-1.5 sm:p-2 text-center ${s.bg}`}>
                          <div className={`text-[9px] sm:text-[10px] uppercase tracking-wide mb-0.5 opacity-80 ${s.c}`}>{s.label}</div>
                          <div className={`text-[15px] sm:text-[17px] font-bold leading-none ${s.c}`}>{s.val}</div>
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
