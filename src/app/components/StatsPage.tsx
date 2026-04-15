import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis,
  PieChart, Pie, Cell, CartesianGrid, ReferenceLine
} from "recharts";
import { 
  Search, Flame, CheckCircle, Clock, TrendingUp, Target, TrendingDown, 
  ListChecks, BarChart3 as BarChart3Icon,
  Award, Zap, Calendar, Activity, ChevronRight, BookOpen, RotateCcw,
  Trophy, Moon, Sun
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { ExpandableCourseRow } from "./ExpandableCourseRow";

// --- DONNÉES MOCK ---

const mockRadarData: { [key: string]: Array<{ tag: string; mastery: number }> } = {
  J1: [
    { tag: "Cardiologie-CCV", mastery: 78 },
    { tag: "Gynécologie", mastery: 65 },
    { tag: "Psychiatrie", mastery: 70 },
    { tag: "Chirurgie", mastery: 68 },
    { tag: "Gastro", mastery: 72 },
    { tag: "Neurologie", mastery: 60 },
    { tag: "ORL/Ophtalmo", mastery: 75 },
    { tag: "Pneumologie", mastery: 66 }
  ],
  J2: [
    { tag: "Cancérologie", mastery: 72 },
    { tag: "Néphrologie", mastery: 50 },
    { tag: "Infectiologie", mastery: 85 },
    { tag: "Hématologie", mastery: 60 },
    { tag: "Endocrinologie", mastery: 68 },
    { tag: "Rhumatologie", mastery: 55 }
  ],
  "Cardiologie-CCV": [
    { tag: "Pharmaco", mastery: 75 },
    { tag: "Anatomie", mastery: 80 },
    { tag: "Physiologie", mastery: 70 },
    { tag: "Clinique", mastery: 85 },
    { tag: "Biologie", mastery: 60 }
  ],
  "Gynécologie": [
    { tag: "Obstétrique", mastery: 70 },
    { tag: "Gynéco", mastery: 65 },
    { tag: "Pharmaco", mastery: 68 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Imagerie", mastery: 60 }
  ],
  "Psychiatrie": [
    { tag: "Sémiologie", mastery: 75 },
    { tag: "Pharmaco", mastery: 70 },
    { tag: "Thérapies", mastery: 65 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Urgences", mastery: 68 }
  ],
  "Chirurgie générale": [
    { tag: "Techniques", mastery: 65 },
    { tag: "Anatomie", mastery: 72 },
    { tag: "Clinique", mastery: 68 },
    { tag: "Complications", mastery: 60 },
    { tag: "Urgences", mastery: 70 }
  ],
  "Gastro-entérologie": [
    { tag: "Pharmaco", mastery: 70 },
    { tag: "Anatomie", mastery: 75 },
    { tag: "Physiologie", mastery: 72 },
    { tag: "Clinique", mastery: 78 },
    { tag: "Endoscopie", mastery: 65 }
  ],
  "Neurologie": [
    { tag: "Anatomie", mastery: 58 },
    { tag: "Sémiologie", mastery: 62 },
    { tag: "Pharmaco", mastery: 60 },
    { tag: "Clinique", mastery: 65 },
    { tag: "Imagerie", mastery: 55 }
  ],
  "ORL/Ophtalmologie": [
    { tag: "ORL", mastery: 75 },
    { tag: "Ophtalmologie", mastery: 72 },
    { tag: "Anatomie", mastery: 78 },
    { tag: "Clinique", mastery: 80 },
    { tag: "Pharmaco", mastery: 70 }
  ],
  "Pneumologie": [
    { tag: "Pharmaco", mastery: 65 },
    { tag: "Anatomie", mastery: 70 },
    { tag: "Physiologie", mastery: 68 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Imagerie", mastery: 62 }
  ],
  "Cancérologie": [
    { tag: "CBP", mastery: 80 },
    { tag: "CCR", mastery: 65 },
    { tag: "Prostate", mastery: 75 },
    { tag: "Cavum", mastery: 60 },
    { tag: "Sein", mastery: 85 },
    { tag: "Col", mastery: 70 }
  ],
  "Néphrologie": [
    { tag: "IRA", mastery: 50 },
    { tag: "IRC", mastery: 55 },
    { tag: "Néphrotique", mastery: 45 },
    { tag: "HTA", mastery: 60 },
    { tag: "Dialyse", mastery: 40 }
  ],
  "Infectiologie": [
    { tag: "VIH", mastery: 85 },
    { tag: "Tuberculose", mastery: 80 },
    { tag: "Hépatites", mastery: 75 },
    { tag: "Méningites", mastery: 70 },
    { tag: "Sepsis", mastery: 78 }
  ],
  "Hématologie": [
    { tag: "Anémies", mastery: 60 },
    { tag: "Leucémies", mastery: 55 },
    { tag: "Lymphomes", mastery: 50 },
    { tag: "Hémostase", mastery: 65 },
    { tag: "Transfusion", mastery: 58 }
  ],
  "Endocrinologie": [
    { tag: "Pharmaco", mastery: 65 },
    { tag: "Anatomie", mastery: 55 },
    { tag: "Physiologie", mastery: 75 },
    { tag: "Clinique", mastery: 70 },
    { tag: "Biologie", mastery: 68 }
  ],
  "Rhumatologie": [
    { tag: "Anatomie", mastery: 52 },
    { tag: "Sémiologie", mastery: 55 },
    { tag: "Pharmaco", mastery: 60 },
    { tag: "Clinique", mastery: 58 },
    { tag: "Imagerie", mastery: 50 }
  ]
};

const mockCourseRadarData: { [key: string]: Array<{ tag: string; mastery: number }> } = {
  "SCA": [
    { tag: "Pharmaco", mastery: 85 }, { tag: "Anatomie", mastery: 75 },
    { tag: "Physiologie", mastery: 80 }, { tag: "Clinique", mastery: 90 }, { tag: "Biologie", mastery: 70 }
  ],
  "HTA": [
    { tag: "Pharmaco", mastery: 90 }, { tag: "Anatomie", mastery: 50 },
    { tag: "Physiologie", mastery: 80 }, { tag: "Clinique", mastery: 85 }, { tag: "Biologie", mastery: 75 }
  ],
  "MVTE": [
    { tag: "Pharmaco", mastery: 70 }, { tag: "Anatomie", mastery: 85 },
    { tag: "Physiologie", mastery: 75 }, { tag: "Clinique", mastery: 80 }, { tag: "Biologie", mastery: 65 }
  ],
  "Endocardite": [
    { tag: "Pharmaco", mastery: 88 }, { tag: "Anatomie", mastery: 60 },
    { tag: "Physiologie", mastery: 70 }, { tag: "Clinique", mastery: 92 }, { tag: "Biologie", mastery: 85 }
  ],
  "ECG de base": [
    { tag: "Pharmaco", mastery: 20 }, { tag: "Anatomie", mastery: 90 },
    { tag: "Physiologie", mastery: 95 }, { tag: "Clinique", mastery: 85 }, { tag: "Biologie", mastery: 10 }
  ],
  "Arythmies": [
    { tag: "Pharmaco", mastery: 72 }, { tag: "Anatomie", mastery: 68 },
    { tag: "Physiologie", mastery: 78 }, { tag: "Clinique", mastery: 80 }, { tag: "Biologie", mastery: 65 }
  ],
  "AVC": [
    { tag: "Clinique", mastery: 65 }, { tag: "Imagerie", mastery: 60 },
    { tag: "Urgences", mastery: 68 }, { tag: "Traitement", mastery: 62 }, { tag: "Séquelles", mastery: 58 }
  ],
  "Épilepsie": [
    { tag: "Sémiologie", mastery: 60 }, { tag: "Pharmaco", mastery: 58 },
    { tag: "Clinique", mastery: 62 }, { tag: "Classification", mastery: 55 }, { tag: "Urgences", mastery: 65 }
  ],
  "VIH": [
    { tag: "Pharmaco", mastery: 90 }, { tag: "Diagnostic", mastery: 85 },
    { tag: "Clinique", mastery: 88 }, { tag: "Biologie", mastery: 82 }, { tag: "Prévention", mastery: 95 }
  ],
  "Tuberculose": [
    { tag: "Diagnostic", mastery: 82 }, { tag: "Pharmaco", mastery: 80 },
    { tag: "Clinique", mastery: 78 }, { tag: "Complications", mastery: 75 }, { tag: "Prévention", mastery: 85 }
  ],
  "IRA": [
    { tag: "Étiologies", mastery: 55 }, { tag: "Diagnostic", mastery: 50 },
    { tag: "Biologie", mastery: 60 }, { tag: "Clinique", mastery: 52 }, { tag: "Traitement", mastery: 48 }
  ],
  "IRC": [
    { tag: "Étiologies", mastery: 60 }, { tag: "Stades", mastery: 58 },
    { tag: "Biologie", mastery: 65 }, { tag: "Complications", mastery: 52 }, { tag: "Dialyse", mastery: 50 }
  ],
};

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

const mockCourses: Course[] = [
  // ── JOUR 1 ──────────────────────────────────────────────────────────────────
  // 🧠 Neurologie
  { name: "AVC",                           speciality: "Neurologie",              jour: 1, item: 1,  mastery: 62, toRedo: 38, qcmDone: 75,  lastReviewed: "2025-01-08" },
  { name: "Céphalées",                     speciality: "Neurologie",              jour: 1, item: 16, mastery: 68, toRedo: 32, qcmDone: 82,  lastReviewed: "2025-01-10" },
  { name: "Épilepsies",                    speciality: "Neurologie",              jour: 1, item: 26, mastery: 58, toRedo: 42, qcmDone: 65,  lastReviewed: "2025-01-06" },
  // 🧠 Psychiatrie
  { name: "États confusionnels",           speciality: "Psychiatrie",             jour: 1, item: 29, mastery: 70, toRedo: 30, qcmDone: 88,  lastReviewed: "2025-01-12" },
  { name: "Schizophrénie",                 speciality: "Psychiatrie",             jour: 1, item: 63, mastery: 55, toRedo: 45, qcmDone: 70,  lastReviewed: "2025-01-07" },
  { name: "Troubles de l'humeur",          speciality: "Psychiatrie",             jour: 1, item: 70, mastery: 72, toRedo: 28, qcmDone: 80,  lastReviewed: "2025-01-11" },
  { name: "Troubles anxieux",              speciality: "Psychiatrie",             jour: 1, item: 69, mastery: 75, toRedo: 25, qcmDone: 92,  lastReviewed: "2025-01-13" },
  // 👁️ Ophtalmologie
  { name: "Œil rouge",                     speciality: "Ophtalmologie",           jour: 1, item: 56, mastery: 78, toRedo: 22, qcmDone: 95,  lastReviewed: "2025-01-14" },
  // 👂 ORL
  { name: "IVAS",                          speciality: "ORL",                     jour: 1, item: 42, mastery: 82, toRedo: 18, qcmDone: 105, lastReviewed: "2025-01-15" },
  { name: "Cancer du cavum",               speciality: "ORL",                     jour: 1, item: 12, mastery: 52, toRedo: 48, qcmDone: 60,  lastReviewed: "2025-01-05" },
  // 🫁 Pneumologie – Allergologie
  { name: "CBP",                           speciality: "Pneumologie",             jour: 1, item: 11, mastery: 82, toRedo: 18, qcmDone: 130, lastReviewed: "2025-01-13" },
  { name: "Infections respiratoires basses", speciality: "Pneumologie",           jour: 1, item: 43, mastery: 70, toRedo: 30, qcmDone: 88,  lastReviewed: "2025-01-11" },
  { name: "Tuberculose pulmonaire",        speciality: "Pneumologie",             jour: 1, item: 72, mastery: 80, toRedo: 20, qcmDone: 125, lastReviewed: "2025-01-12" },
  { name: "Asthme",                        speciality: "Pneumologie",             jour: 1, item: 7,  mastery: 68, toRedo: 32, qcmDone: 85,  lastReviewed: "2025-01-10" },
  { name: "BPCO",                          speciality: "Pneumologie",             jour: 1, item: 9,  mastery: 60, toRedo: 40, qcmDone: 78,  lastReviewed: "2025-01-08" },
  // ❤️ Cardiologie – CCVT
  { name: "SCA",                           speciality: "Cardiologie-CCVT",        jour: 1, item: 65, mastery: 82, toRedo: 18, qcmDone: 95,  lastReviewed: "2025-01-14" },
  { name: "Douleur thoracique",            speciality: "Cardiologie-CCVT",        jour: 1, item: 22, mastery: 88, toRedo: 12, qcmDone: 102, lastReviewed: "2025-01-15" },
  { name: "HTA",                           speciality: "Cardiologie-CCVT",        jour: 1, item: 38, mastery: 85, toRedo: 15, qcmDone: 110, lastReviewed: "2025-01-13" },
  { name: "Endocardite infectieuse",       speciality: "Cardiologie-CCVT",        jour: 1, item: 25, mastery: 75, toRedo: 25, qcmDone: 90,  lastReviewed: "2025-01-10" },
  { name: "Ischémie des membres",          speciality: "Cardiologie-CCVT",        jour: 1, item: 49, mastery: 65, toRedo: 35, qcmDone: 72,  lastReviewed: "2025-01-09" },
  { name: "MVTE",                          speciality: "Cardiologie-CCVT",        jour: 1, item: 51, mastery: 75, toRedo: 25, qcmDone: 85,  lastReviewed: "2025-01-12" },
  // 🍽️ Gastro-entérologie
  { name: "Dysphagies",                    speciality: "Gastro-entérologie",      jour: 1, item: 24, mastery: 60, toRedo: 40, qcmDone: 68,  lastReviewed: "2025-01-07" },
  { name: "Ictères",                       speciality: "Gastro-entérologie",      jour: 1, item: 41, mastery: 65, toRedo: 35, qcmDone: 75,  lastReviewed: "2025-01-09" },
  { name: "Diarrhées chroniques",          speciality: "Gastro-entérologie",      jour: 1, item: 21, mastery: 70, toRedo: 30, qcmDone: 82,  lastReviewed: "2025-01-11" },
  { name: "Ulcère gastro-duodénal",        speciality: "Gastro-entérologie",      jour: 1, item: 74, mastery: 72, toRedo: 28, qcmDone: 90,  lastReviewed: "2025-01-12" },
  { name: "Hémorragies digestives",        speciality: "Gastro-entérologie",      jour: 1, item: 34, mastery: 78, toRedo: 22, qcmDone: 98,  lastReviewed: "2025-01-13" },
  // 🔪 Chirurgie générale
  { name: "Péritonite aiguë",              speciality: "Chirurgie générale",      jour: 1, item: 57, mastery: 68, toRedo: 32, qcmDone: 75,  lastReviewed: "2025-01-09" },
  { name: "Appendicite aiguë",             speciality: "Chirurgie générale",      jour: 1, item: 4,  mastery: 85, toRedo: 15, qcmDone: 112, lastReviewed: "2025-01-14" },
  { name: "Cancer colorectal",             speciality: "Chirurgie générale",      jour: 1, item: 15, mastery: 70, toRedo: 30, qcmDone: 82,  lastReviewed: "2025-01-10" },
  { name: "Occlusion intestinale aiguë",   speciality: "Chirurgie générale",      jour: 1, item: 54, mastery: 62, toRedo: 38, qcmDone: 70,  lastReviewed: "2025-01-08" },
  // 👩‍⚕️ Gynécologie – Obstétrique
  { name: "Cancer du col",                 speciality: "Gynécologie-Obstétrique", jour: 1, item: 13, mastery: 72, toRedo: 28, qcmDone: 88,  lastReviewed: "2025-01-11" },
  { name: "Cancer du sein",                speciality: "Gynécologie-Obstétrique", jour: 1, item: 14, mastery: 80, toRedo: 20, qcmDone: 105, lastReviewed: "2025-01-13" },
  { name: "Contraception",                 speciality: "Gynécologie-Obstétrique", jour: 1, item: 18, mastery: 90, toRedo: 10, qcmDone: 120, lastReviewed: "2025-01-15" },
  { name: "Grossesse extra-utérine",       speciality: "Gynécologie-Obstétrique", jour: 1, item: 32, mastery: 68, toRedo: 32, qcmDone: 82,  lastReviewed: "2025-01-10" },
  { name: "Prééclampsie – éclampsie",      speciality: "Gynécologie-Obstétrique", jour: 1, item: 60, mastery: 58, toRedo: 42, qcmDone: 72,  lastReviewed: "2025-01-07" },
  { name: "Métrorragies",                  speciality: "Gynécologie-Obstétrique", jour: 1, item: 53, mastery: 65, toRedo: 35, qcmDone: 78,  lastReviewed: "2025-01-09" },

  // ── JOUR 2 ──────────────────────────────────────────────────────────────────
  // 🟢 Urologie
  { name: "Tumeurs de la prostate",        speciality: "Urologie",                jour: 2, item: 73, mastery: 72, toRedo: 28, qcmDone: 88,  lastReviewed: "2025-01-11" },
  { name: "Lithiase urinaire",             speciality: "Urologie",                jour: 2, item: 50, mastery: 78, toRedo: 22, qcmDone: 95,  lastReviewed: "2025-01-13" },
  { name: "Hématuries",                    speciality: "Urologie",                jour: 2, item: 33, mastery: 65, toRedo: 35, qcmDone: 72,  lastReviewed: "2025-01-09" },
  { name: "Infections urinaires",          speciality: "Urologie",                jour: 2, item: 45, mastery: 88, toRedo: 12, qcmDone: 115, lastReviewed: "2025-01-15" },
  // 🟢 Néphrologie
  { name: "Troubles acido-basiques",       speciality: "Néphrologie",             jour: 2, item: 68, mastery: 55, toRedo: 45, qcmDone: 70,  lastReviewed: "2025-01-06" },
  { name: "Dyskaliémies",                  speciality: "Néphrologie",             jour: 2, item: 71, mastery: 50, toRedo: 50, qcmDone: 65,  lastReviewed: "2025-01-04" },
  { name: "Troubles de l'hydratation",     speciality: "Néphrologie",             jour: 2, item: 71, mastery: 52, toRedo: 48, qcmDone: 62,  lastReviewed: "2025-01-04" },
  { name: "Œdèmes",                        speciality: "Néphrologie",             jour: 2, item: 55, mastery: 60, toRedo: 40, qcmDone: 75,  lastReviewed: "2025-01-07" },
  { name: "Insuffisance rénale aiguë",     speciality: "Néphrologie",             jour: 2, item: 46, mastery: 48, toRedo: 52, qcmDone: 60,  lastReviewed: "2025-01-03" },
  // 🔥 Réanimation
  { name: "Intoxication",                  speciality: "Réanimation",             jour: 2, item: 48, mastery: 65, toRedo: 35, qcmDone: 80,  lastReviewed: "2025-01-09" },
  { name: "Polytraumatisme",               speciality: "Réanimation",             jour: 2, item: 59, mastery: 68, toRedo: 32, qcmDone: 85,  lastReviewed: "2025-01-10" },
  { name: "État de choc hémorragique",     speciality: "Réanimation",             jour: 2, item: 28, mastery: 72, toRedo: 28, qcmDone: 92,  lastReviewed: "2025-01-11" },
  { name: "État de choc cardiogénique",    speciality: "Réanimation",             jour: 2, item: 27, mastery: 70, toRedo: 30, qcmDone: 88,  lastReviewed: "2025-01-11" },
  { name: "États septiques graves",        speciality: "Réanimation",             jour: 2, item: 30, mastery: 78, toRedo: 22, qcmDone: 102, lastReviewed: "2025-01-14" },
  { name: "Arrêt cardio-circulatoire",     speciality: "Réanimation",             jour: 2, item: 5,  mastery: 85, toRedo: 15, qcmDone: 120, lastReviewed: "2025-01-15" },
  { name: "Brûlures cutanées",             speciality: "Réanimation",             jour: 2, item: 10, mastery: 55, toRedo: 45, qcmDone: 65,  lastReviewed: "2025-01-06" },
  { name: "Traumatisme crânien",           speciality: "Réanimation",             jour: 2, item: 67, mastery: 62, toRedo: 38, qcmDone: 75,  lastReviewed: "2025-01-08" },
  { name: "Comas",                         speciality: "Réanimation",             jour: 2, item: 17, mastery: 65, toRedo: 35, qcmDone: 78,  lastReviewed: "2025-01-09" },
  { name: "Prise en charge d'une douleur aiguë", speciality: "Réanimation",      jour: 2, item: 61, mastery: 80, toRedo: 20, qcmDone: 105, lastReviewed: "2025-01-13" },
  // 🧬 Endocrinologie
  { name: "Insuffisance surrénalienne aiguë", speciality: "Endocrinologie",       jour: 2, item: 47, mastery: 55, toRedo: 45, qcmDone: 65,  lastReviewed: "2025-01-06" },
  { name: "Hyperthyroïdie",                speciality: "Endocrinologie",          jour: 2, item: 39, mastery: 65, toRedo: 35, qcmDone: 80,  lastReviewed: "2025-01-09" },
  { name: "Hypothyroïdie",                 speciality: "Endocrinologie",          jour: 2, item: 40, mastery: 68, toRedo: 32, qcmDone: 82,  lastReviewed: "2025-01-10" },
  { name: "Dyslipidémies",                 speciality: "Endocrinologie",          jour: 2, item: 23, mastery: 75, toRedo: 25, qcmDone: 95,  lastReviewed: "2025-01-12" },
  { name: "Diabète sucré",                 speciality: "Endocrinologie",          jour: 2, item: 20, mastery: 65, toRedo: 35, qcmDone: 90,  lastReviewed: "2025-01-14" },
  // 🧬 Médecine Interne
  { name: "Hypercalcémies",               speciality: "Médecine Interne",         jour: 2, item: 37, mastery: 55, toRedo: 45, qcmDone: 62,  lastReviewed: "2025-01-05" },
  { name: "Purpura",                       speciality: "Médecine Interne",        jour: 2, item: 62, mastery: 60, toRedo: 40, qcmDone: 70,  lastReviewed: "2025-01-07" },
  // 🦠 Infectiologie
  { name: "Méningite",                     speciality: "Infectiologie",           jour: 2, item: 52, mastery: 78, toRedo: 22, qcmDone: 105, lastReviewed: "2025-01-13" },
  { name: "IST",                           speciality: "Infectiologie",           jour: 2, item: 44, mastery: 85, toRedo: 15, qcmDone: 118, lastReviewed: "2025-01-15" },
  { name: "Hépatites virales",             speciality: "Infectiologie",           jour: 2, item: 35, mastery: 80, toRedo: 20, qcmDone: 110, lastReviewed: "2025-01-14" },
  // 🩸 Hématologie
  { name: "Splénomégalies",               speciality: "Hématologie",              jour: 2, item: 64, mastery: 58, toRedo: 42, qcmDone: 68,  lastReviewed: "2025-01-06" },
  { name: "Adénopathies superficielles",   speciality: "Hématologie",             jour: 2, item: 2,  mastery: 62, toRedo: 38, qcmDone: 75,  lastReviewed: "2025-01-08" },
  { name: "Anémie",                        speciality: "Hématologie",             jour: 2, item: 3,  mastery: 60, toRedo: 40, qcmDone: 88,  lastReviewed: "2025-01-07" },
  { name: "Transfusion sanguine",          speciality: "Hématologie",             jour: 2, item: 66, mastery: 52, toRedo: 48, qcmDone: 72,  lastReviewed: "2025-01-05" },
  // 🦴 Orthopédie – Rhumatologie
  { name: "Arthrite septique",             speciality: "Orthopédie-Rhumatologie", jour: 2, item: 6,  mastery: 65, toRedo: 35, qcmDone: 75,  lastReviewed: "2025-01-08" },
  { name: "Fractures ouvertes de la jambe", speciality: "Orthopédie-Rhumatologie", jour: 2, item: 31, mastery: 70, toRedo: 30, qcmDone: 82, lastReviewed: "2025-01-10" },
  { name: "Polyarthrite rhumatoïde",       speciality: "Orthopédie-Rhumatologie", jour: 2, item: 58, mastery: 68, toRedo: 32, qcmDone: 80,  lastReviewed: "2025-01-09" },
  // 👶 Pédiatrie
  { name: "Bronchiolite",                  speciality: "Pédiatrie",               jour: 2, item: 8,  mastery: 80, toRedo: 20, qcmDone: 105, lastReviewed: "2025-01-13" },
  { name: "Déshydratation aiguë de l'enfant", speciality: "Pédiatrie",            jour: 2, item: 37, mastery: 72, toRedo: 28, qcmDone: 88,  lastReviewed: "2025-01-11" },
  { name: "Vaccinations",                  speciality: "Pédiatrie",               jour: 2, item: 75, mastery: 90, toRedo: 10, qcmDone: 125, lastReviewed: "2025-01-15" },
];

const weeklyProgressData = [
  { day: "Lun", qcm: 20, time: 2 },
  { day: "Mar", qcm: 25, time: 2.5 },
  { day: "Mer", qcm: 30, time: 3 },
  { day: "Jeu", qcm: 22, time: 2.2 },
  { day: "Ven", qcm: 28, time: 2.8 },
  { day: "Sam", qcm: 35, time: 3.5 },
  { day: "Dim", qcm: 0, time: 0 }
];

const mockCourseHistory: { [key: string]: Array<{ date: string; note: number }> } = {
  "ECG de base": [
    { date: "15 Déc", note: 14 }, { date: "22 Déc", note: 16 }, { date: "28 Déc", note: 17 },
    { date: "05 Jan", note: 18 }, { date: "12 Jan", note: 19 }, { date: "19 Jan", note: 19 }
  ],
  "SCA": [
    { date: "10 Déc", note: 10 }, { date: "18 Déc", note: 12 }, { date: "25 Déc", note: 14 },
    { date: "02 Jan", note: 15 }, { date: "10 Jan", note: 16 }, { date: "17 Jan", note: 17 }
  ],
  "HTA": [
    { date: "12 Déc", note: 12 }, { date: "20 Déc", note: 14 }, { date: "28 Déc", note: 16 },
    { date: "05 Jan", note: 17 }, { date: "13 Jan", note: 18 }, { date: "20 Jan", note: 18 }
  ],
  "IRA": [
    { date: "08 Déc", note: 6 }, { date: "16 Déc", note: 7 }, { date: "24 Déc", note: 8 },
    { date: "02 Jan", note: 9 }, { date: "10 Jan", note: 10 }
  ],
  "VIH": [
    { date: "08 Déc", note: 14 }, { date: "16 Déc", note: 15 }, { date: "24 Déc", note: 16 },
    { date: "02 Jan", note: 17 }, { date: "10 Jan", note: 17 }
  ],
};

const getHistoryForCourse = (courseName: string, mastery: number): Array<{ date: string; note: number }> => {
  if (mockCourseHistory[courseName]) return mockCourseHistory[courseName];
  const baseNote = Math.round(mastery * 20 / 100);
  return [
    { date: "15 Déc", note: Math.max(4, baseNote - 4) },
    { date: "22 Déc", note: Math.max(5, baseNote - 3) },
    { date: "29 Déc", note: Math.max(6, baseNote - 2) },
    { date: "05 Jan", note: Math.max(7, baseNote - 1) },
    { date: "12 Jan", note: baseNote },
  ];
};

const successPercentage = 65;
const qcmStats = {
  completed: 1850,
  totalQcm: 2500,
  seriesCompleted: 120,
  totalSeries: 200,
  bestObjective: "Cardiologie-CCV",
  bestObjectivePercent: 98,
  worstObjective: "Néphrologie",
  worstObjectivePercent: 55
};

// --- Utilitaires couleurs ---

const getPercentageColor = (percentage: number, isDark: boolean) => {
  if (percentage < 50) return isDark ? "#ef4444" : "#dc2626";
  if (percentage < 75) return isDark ? "#f97316" : "#ff8f00";
  return isDark ? "#22c55e" : "#059669";
};

// --- AnimatedCounter ---
const AnimatedCounter = ({ value, suffix = "" }: { value: number | string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
  useEffect(() => {
    let start = 0;
    const end = numValue;
    if (start === end) return;
    const duration = 1000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [numValue]);
  return <>{count}{suffix}</>;
};

// --- StatCard ---
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: { value: number; isUp: boolean };
  color: string;
  onClick?: () => void;
}

const StatCard = ({ icon, label, value, trend, color, onClick }: StatCardProps) => (
  <motion.div whileHover={{ scale: 1.005, y: -1 }} whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
    <Card className={`relative overflow-hidden cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 ${onClick ? 'hover:shadow-lg' : ''}`} onClick={onClick}>
      <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/8 to-transparent opacity-80"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: '200% 200%' }} />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <motion.div className="p-3 rounded-xl bg-background/80 shadow-sm"
            whileHover={{ rotate: [0, -2, 2, -2, 0] }} transition={{ duration: 0.5 }}>
            {icon}
          </motion.div>
          {trend && (
            <Badge variant={trend.isUp ? "default" : "destructive"} className="gap-1">
              {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.value}%
            </Badge>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <h3 className={`${color} text-3xl tracking-tight`}>
            {value.includes('%') ? <><AnimatedCounter value={parseInt(value)} />%</>
              : value.match(/^\d+$/) ? <AnimatedCounter value={parseInt(value)} />
              : value}
          </h3>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// --- CircularProgress ---
const CircularProgress = ({ value, size = 120, strokeWidth = 12, label, isDark = false }:
  { value: number; size?: number; strokeWidth?: number; label?: string; isDark?: boolean }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = getPercentageColor(value, isDark);
  return (
    <motion.div className="relative inline-flex items-center justify-center"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, type: "spring" }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius}
          stroke={isDark ? "#334155" : "#e2e8f0"} strokeWidth={strokeWidth} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span className="text-3xl" style={{ color }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <AnimatedCounter value={value} suffix="%" />
        </motion.span>
        {label && <span className="text-xs text-muted-foreground mt-1">{label}</span>}
      </div>
    </motion.div>
  );
};

// --- DonutChart ---
const EnhancedDonutChart = ({ data, isDark }: { data: any[]; isDark: boolean }) => {
  const COLORS = isDark
    ? ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#fb923c", "#f472b6"]
    : ["#4f7cff", "#059669", "#ff8f00", "#dc2626", "#8b5cf6", "#f97316", "#ec4899"];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart id="pie-chart-specialty">
        <Pie key="pie" data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
          paddingAngle={5} dataKey="value" label={({ percentage }) => `${percentage}%`}>
          {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip key="tooltip"
          formatter={(value: any, name: any, props: any) => [`${value} QCM (${props.payload.percentage}%)`, name]}
          contentStyle={{
            backgroundColor: isDark ? "#334155" : "#ffffff",
            borderColor: isDark ? "#475569" : "#e2e8f0",
            borderRadius: "8px"
          }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// --- Composant Principal ---
interface StatsPageProps {
  theme?: string;
}

export default function StatsPage({ theme = "light" }: StatsPageProps) {
  const [query, setQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterType, setFilterType] = useState("toRedo");
  const [filterSpeciality, setFilterSpeciality] = useState("all"); // filtre spécialité Score QE
  const [filterJour, setFilterJour] = useState("all"); // filtre jour J1/J2
  const [selectedSpec, setSelectedSpec] = useState("J1");
  const [selectedCourseForRadar, setSelectedCourseForRadar] = useState("all");
  const [comparisonMetric, setComparisonMetric] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [timePeriod, setTimePeriod] = useState("7j");
  const [displayCount, setDisplayCount] = useState<5 | 10 | 15>(10);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Liste unique des spécialités pour le filtre
  const allSpecialities = Array.from(new Set(mockCourses.map(c => c.speciality))).sort();

  const filteredCourses = mockCourses.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
    const matchesSpec = filterSpeciality === "all" || c.speciality === filterSpeciality;
    const matchesJour = filterJour === "all" || c.jour === Number(filterJour);
    return matchesQuery && matchesSpec && matchesJour;
  });

  // toRedo: plus urgent en premier (valeur haute = plus à refaire)
  // mastery: mieux maîtrisé en premier (valeur haute = meilleur)
  const sortedCourses = [...filteredCourses].sort((a, b) =>
    filterType === "toRedo" ? b.toRedo - a.toRedo : b.mastery - a.mastery
  );

  const isSpec = ["J1", "J2"].includes(selectedSpec);

  let radarData: Array<{ tag: string; mastery: number }> = [];
  let radarTitle = "";
  if (isSpec) {
    radarData = mockRadarData[selectedSpec] || [];
    radarTitle = `Maîtrise - ${selectedSpec}`;
  } else {
    if (selectedCourseForRadar === "all") {
      radarData = mockRadarData[selectedSpec] || [];
      radarTitle = `Maîtrise - ${selectedSpec}`;
    } else {
      radarData = mockCourseRadarData[selectedCourseForRadar] || [];
      radarTitle = `${selectedSpec} - ${selectedCourseForRadar}`;
    }
  }

  const coursesForSubFilter = !isSpec ? mockCourses.filter(c => c.speciality === selectedSpec) : [];
  const totalQcm = mockCourses.reduce((sum, c) => sum + c.qcmDone, 0);
  const weeklyQcm = 160;
  const progressPercent = Math.round((totalQcm / 5000) * 100);

  const weeklyQcmBySpeciality = [
    { name: "Cardiologie-CCV", value: 45 },
    { name: "Gastro-entérologie", value: 28 },
    { name: "Infectiologie", value: 22 },
    { name: "Pneumologie", value: 18 },
    { name: "Endocrinologie", value: 20 },
    { name: "Néphrologie", value: 15 },
    { name: "Gynécologie", value: 12 }
  ];
  const totalWeeklyQcm = weeklyQcmBySpeciality.reduce((sum, item) => sum + item.value, 0);
  const donutData = weeklyQcmBySpeciality.map(item => ({
    ...item,
    percentage: Math.round((item.value / totalWeeklyQcm) * 100)
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const comparisonMetricInfo: Record<string, { label: string; value: string; average: string; percentile: number }> = {
    time: { label: "Temps hebdomadaire", value: "14h 30min", average: "12h 15min", percentile: 72 },
    weeklyQcm: { label: "QCM hebdomadaires", value: weeklyQcm.toString(), average: "145", percentile: 68 },
    totalQcm: { label: "Total QCM", value: totalQcm.toString(), average: "1425", percentile: 75 }
  };
  const comparisonInfo = comparisonMetric ? comparisonMetricInfo[comparisonMetric] : null;

  const CourseDetailDialog = () => {
    if (!selectedCourse) return null;
    const DialogWrapper = isMobile ? Drawer : Dialog;
    const ContentWrapper = isMobile ? DrawerContent : DialogContent;
    const HeaderWrapper = isMobile ? DrawerHeader : DialogHeader;
    const TitleWrapper = isMobile ? DrawerTitle : DialogTitle;
    const DescriptionWrapper = isMobile ? DrawerDescription : DialogDescription;
    const history = getHistoryForCourse(selectedCourse.name, selectedCourse.mastery);
    const avg = history.reduce((s, h) => s + h.note, 0) / history.length;
    const radarDataForCourse = mockCourseRadarData[selectedCourse.name] || [];

    return (
      <DialogWrapper open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <ContentWrapper className="max-w-2xl">
          <HeaderWrapper>
            <TitleWrapper className="flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              {selectedCourse.name}
            </TitleWrapper>
            <DescriptionWrapper>{selectedCourse.speciality} · Dernière révision: {selectedCourse.lastReviewed}</DescriptionWrapper>
          </HeaderWrapper>
          <div className="space-y-5 p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center">
                <CircularProgress value={selectedCourse.mastery} size={100} strokeWidth={10} isDark={isDarkMode} />
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">Maîtrise</p>
              </div>
              <div className="text-center">
                <CircularProgress value={100 - selectedCourse.toRedo} size={100} strokeWidth={10} isDark={isDarkMode} />
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">Progression</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "QCM faits", val: selectedCourse.qcmDone.toString(), color: "#4f7cff" },
                { label: "À refaire", val: `${selectedCourse.toRedo}%`, color: getPercentageColor(100 - selectedCourse.toRedo, isDarkMode) },
                { label: "Moy. note", val: avg.toFixed(1), color: "#059669" },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl p-3 text-center bg-muted border border-border">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">{stat.label}</div>
                  <div className="text-[22px] font-bold leading-none" style={{ color: stat.color }}>{stat.val}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Évolution des notes</span>
              </div>
              <div className="rounded-xl overflow-hidden bg-muted border border-border">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={history} id="area-chart-dialog" margin={{ top: 12, right: 16, left: -16, bottom: 4 }}>
                    <defs>
                      <linearGradient id="dlgGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f7cff" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4f7cff" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} vertical={false} />
                    <XAxis dataKey="date" stroke={isDarkMode ? "#475569" : "#94a3b8"} style={{ fontSize: "11px" }} tickLine={false} dy={6} />
                    <YAxis domain={[0, 20]} stroke={isDarkMode ? "#475569" : "#94a3b8"} style={{ fontSize: "11px" }} tickLine={false} dx={-6} ticks={[0, 5, 10, 15, 20]} />
                    <Tooltip content={({ active, payload }: any) => {
                      if (active && payload?.length) {
                        return (
                          <div className="rounded-xl px-3 py-2 shadow-xl bg-popover border border-border">
                            <p className="text-[11px] text-muted-foreground mb-0.5">{payload[0].payload.date}</p>
                            <p className="text-[15px] font-bold text-primary leading-none">{payload[0].value}<span className="text-[11px] font-normal">/20</span></p>
                          </div>
                        );
                      }
                      return null;
                    }} cursor={{ stroke: isDarkMode ? "#f1f5f9" : "#1e293b", strokeWidth: 1.5 }} />
                    <ReferenceLine y={avg} stroke="#059669" strokeDasharray="6 4" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="note" stroke="#4f7cff" strokeWidth={2} fillOpacity={1} fill="url(#dlgGrad)" dot={false} activeDot={{ r: 4, fill: "#4f7cff", strokeWidth: 2, stroke: "#fff" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            {radarDataForCourse.length > 0 && (
              <div>
                <div className="mb-2"><span className="text-sm font-semibold text-foreground">Radar par tag</span></div>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarDataForCourse} id="radar-chart-dialog">
                    <PolarGrid stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                    <PolarAngleAxis dataKey="tag" tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b", fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Maîtrise" dataKey="mastery" stroke="#4f7cff" fill="#4f7cff" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl p-3 text-center bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30">
                <div className="text-[10px] text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Pire note</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 leading-none">{Math.min(...history.map(h => h.note))}</div>
              </div>
              <div className="rounded-xl p-3 text-center bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/30">
                <div className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Meilleure note</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 leading-none">{Math.max(...history.map(h => h.note))}</div>
              </div>
              <div className="rounded-xl p-3 text-center bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30">
                <div className="text-[10px] text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Total essais</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 leading-none">{history.length}</div>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </DialogWrapper>
    );
  };

  return (
    <motion.div className="space-y-6 pb-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* En-tête */}
      <motion.div variants={itemVariants} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-foreground flex items-center gap-2 text-xl sm:text-2xl">
            <Activity className="text-primary" size={22} />
            Tableau de bord
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Suivez vos performances et identifiez vos axes d'amélioration
          </p>
        </div>
        <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="outline" size="icon"
          className="self-start sm:self-auto transition-all duration-300 hover:scale-105 flex-shrink-0"
          aria-label={isDarkMode ? "Mode clair" : "Mode sombre"}>
          <motion.div initial={false} animate={{ rotate: isDarkMode ? 180 : 0 }} transition={{ duration: 0.3 }}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* KPIs */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Clock className="text-primary" size={24} />} label="Temps hebdomadaire"
          value="14h 30min" trend={{ value: 12, isUp: true }} color="text-primary"
          onClick={() => setComparisonMetric("time")} />
        <StatCard icon={<CheckCircle className="text-purple-500" size={24} />} label="QCM cette semaine"
          value={weeklyQcm.toString()} trend={{ value: 8, isUp: true }} color="text-purple-500"
          onClick={() => setComparisonMetric("weeklyQcm")} />
        <StatCard icon={<BarChart3Icon className="text-accent" size={24} />} label="Total QCM faits"
          value={totalQcm.toString()} color="text-accent" onClick={() => setComparisonMetric("totalQcm")} />
        <StatCard icon={<TrendingUp className="text-success" size={24} />} label="Progression"
          value={`${progressPercent}%`} trend={{ value: 5, isUp: true }} color="text-success" />
      </motion.section>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Évolution hebdomadaire */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.01, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="overflow-hidden relative border-2 hover:border-primary/50 transition-all duration-300 h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-accent/6 to-transparent opacity-70 pointer-events-none z-0" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-primary" size={20} />
                Activité hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 relative">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weeklyProgressData} id="area-chart-weekly">
                  <defs>
                    <linearGradient id="colorQcmWeekly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDarkMode ? "#60a5fa" : "#4f7cff"} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={isDarkMode ? "#60a5fa" : "#4f7cff"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke={isDarkMode ? "#94a3b8" : "#64748b"} style={{ fontSize: '12px' }} />
                  <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{
                    backgroundColor: isDarkMode ? "#334155" : "#ffffff",
                    borderColor: isDarkMode ? "#475569" : "#e2e8f0",
                    borderRadius: "8px"
                  }} />
                  <Area type="monotone" dataKey="qcm"
                    stroke={isDarkMode ? "#60a5fa" : "#4f7cff"} strokeWidth={3}
                    fillOpacity={1} fill="url(#colorQcmWeekly)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Donut QCM par spécialité */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.003, y: -1 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="overflow-hidden relative border-2 hover:border-success/50 transition-all duration-300 h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-success/12 via-accent/6 to-transparent opacity-70 pointer-events-none z-0" />
            <CardHeader className="relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-success" size={20} />
                  QCM répartis par spécialité
                </CardTitle>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-full sm:w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7j">7 jours</SelectItem>
                    <SelectItem value="15j">15 jours</SelectItem>
                    <SelectItem value="30j">30 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 relative">
              <EnhancedDonutChart data={donutData} isDark={isDarkMode} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Score QE */}
      <TopCoursesSection
        sortedCourses={sortedCourses}
        displayCount={displayCount}
        setDisplayCount={setDisplayCount}
        filterType={filterType}
        setFilterType={setFilterType}
        filterSpeciality={filterSpeciality}
        setFilterSpeciality={setFilterSpeciality}
        allSpecialities={allSpecialities}
        filterJour={filterJour}
        setFilterJour={setFilterJour}
        expandedCourseId={expandedCourseId}
        setExpandedCourseId={setExpandedCourseId}
        isDark={isDarkMode}
        getHistoryForCourse={getHistoryForCourse}
        getPercentageColor={getPercentageColor}
        itemVariants={itemVariants}
        query={query}
        setQuery={setQuery}
      />

      {/* Stats QCM + Radar */}
      <StatsAndRadarSection
        successPercentage={successPercentage}
        qcmStats={qcmStats}
        radarData={radarData}
        radarTitle={radarTitle}
        selectedSpec={selectedSpec}
        setSelectedSpec={setSelectedSpec}
        selectedCourseForRadar={selectedCourseForRadar}
        setSelectedCourseForRadar={setSelectedCourseForRadar}
        isSpec={isSpec}
        coursesForSubFilter={coursesForSubFilter}
        isDark={isDarkMode}
        itemVariants={itemVariants}
      />

      {/* Comparison Dialog */}
      {comparisonMetric && comparisonInfo && (
        isMobile ? (
          <Drawer open={!!comparisonMetric} onOpenChange={() => setComparisonMetric(null)}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Comparaison avec vos pairs</DrawerTitle>
                <DrawerDescription>{comparisonInfo.label}</DrawerDescription>
              </DrawerHeader>
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground mb-1">Votre score</p><p className="text-2xl text-primary">{comparisonInfo.value}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground mb-1">Moyenne</p><p className="text-2xl text-muted-foreground">{comparisonInfo.average}</p></CardContent></Card>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2"><span>Votre percentile</span><span className="text-primary">{comparisonInfo.percentile}%</span></div>
                  <Progress value={comparisonInfo.percentile} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Vous êtes dans le top {100 - comparisonInfo.percentile}% des étudiants</p>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={!!comparisonMetric} onOpenChange={() => setComparisonMetric(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Comparaison avec vos pairs</DialogTitle>
                <DialogDescription>{comparisonInfo.label}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground mb-1">Votre score</p><p className="text-2xl text-primary">{comparisonInfo.value}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground mb-1">Moyenne</p><p className="text-2xl text-muted-foreground">{comparisonInfo.average}</p></CardContent></Card>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2"><span>Votre percentile</span><span className="text-primary">{comparisonInfo.percentile}%</span></div>
                  <Progress value={comparisonInfo.percentile} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Vous êtes dans le top {100 - comparisonInfo.percentile}% des étudiants</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      )}

      <CourseDetailDialog />
    </motion.div>
  );
}

// ─── TopCoursesSection ────────────────────────────────────────────────────────
// Utilise isDark (boolean) + classes Tailwind dark: pour être cohérent
// avec le dark mode appliqué via document.documentElement.classList
function TopCoursesSection({
  sortedCourses, displayCount, setDisplayCount, filterType, setFilterType,
  filterSpeciality, setFilterSpeciality, allSpecialities,
  filterJour, setFilterJour,
  expandedCourseId, setExpandedCourseId, isDark, getHistoryForCourse,
  getPercentageColor, itemVariants, query, setQuery
}: any) {
  const avgScore = sortedCourses.length > 0
    ? Math.round(
        sortedCourses.slice(0, displayCount).reduce((s: number, c: any) =>
          s + (filterType === "toRedo" ? c.toRedo : c.mastery), 0
        ) / Math.min(displayCount, sortedCourses.length)
      )
    : 0;

  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.005, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
      {/* La card utilise bg-card + text-card-foreground via Tailwind,
          dark: est activé automatiquement via .dark sur documentElement */}
      <Card className="relative border-0 overflow-hidden bg-card">
        {/* Barre accent top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: filterType === "toRedo"
              ? "linear-gradient(90deg, #dc2626, #ff8f00)"
              : "linear-gradient(90deg, #059669, #4f7cff)"
          }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <CardHeader className="relative pb-2">
          {/* Desktop: titre gauche + contrôles droite en ligne | Mobile: empilé */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">

            {/* Badge score + titre */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <motion.div className="relative flex-shrink-0"
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }} transition={{ duration: 0.4 }}
                role="img" aria-label="Score QE">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{
                  background: filterType === "toRedo" ? "linear-gradient(135deg, #dc2626, #ff8f00)" : "linear-gradient(135deg, #059669, #4f7cff)",
                  boxShadow: filterType === "toRedo" ? "0 4px 16px rgba(220,38,38,0.3)" : "0 4px 16px rgba(5,150,105,0.3)"
                }}>
                  <motion.div className="absolute inset-0"
                    style={{ background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }} />
                  <motion.div className="relative z-10 text-white text-center"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <div style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1 }}>{avgScore}</div>
                    <div style={{ fontSize: "8px", fontWeight: 500, opacity: 0.9, letterSpacing: "0.05em" }}>SCORE</div>
                  </motion.div>
                </div>
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] sm:text-[17px] font-bold text-foreground">Score QE®</span>
                  <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                    {filterType === "toRedo" ? <Flame size={18} className="text-accent" /> : <Trophy size={18} className="text-success" />}
                  </motion.div>
                </div>
                <p className="text-[11px] sm:text-[12px] text-muted-foreground">
                  {sortedCourses.length} cours · {Math.min(displayCount, sortedCourses.length)} affichés
                </p>
              </div>
            </div>

            {/* Contrôles
                – Mobile  (<lg) : search pleine largeur, puis 2 lignes de 2 éléments
                – Desktop (lg+) : tout en une seule ligne flex               */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
              {/* Search */}
              <div className="relative w-full lg:w-auto lg:min-w-[200px] lg:max-w-[260px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="text" placeholder="Rechercher un cours..."
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-muted border-border text-[13px] w-full"
                  value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>

              {/* Ligne 2 mobile / inline desktop : count + jour */}
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="flex rounded-xl overflow-hidden border border-border bg-muted">
                  {([5, 10, 15] as const).map((count) => (
                    <motion.button key={count} onClick={() => setDisplayCount(count)}
                      className={`px-3 py-1.5 text-[13px] transition-all ${
                        displayCount === count ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                      } ${count !== 15 ? "border-r border-border" : ""}`}
                      whileTap={{ scale: 0.97 }}>
                      {count}
                    </motion.button>
                  ))}
                </div>
                <div className="flex rounded-xl overflow-hidden border border-border bg-muted">
                  {(["all", "1", "2"] as const).map((j) => (
                    <motion.button key={j} onClick={() => setFilterJour(j)}
                      className={`px-3 py-1.5 text-[13px] transition-all ${
                        filterJour === j ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                      } ${j !== "2" ? "border-r border-border" : ""}`}
                      whileTap={{ scale: 0.97 }}>
                      {j === "all" ? "Tous" : `J${j}`}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Ligne 3 mobile / inline desktop : 2 selects */}
              <div className="flex items-center gap-2 lg:gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px] lg:w-[160px] rounded-xl bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toRedo">
                      <span className="flex items-center gap-2"><RotateCcw size={13} /> À refaire</span>
                    </SelectItem>
                    <SelectItem value="mastery">
                      <span className="flex items-center gap-2"><Trophy size={13} /> Mieux maîtrisés</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSpeciality} onValueChange={setFilterSpeciality}>
                  <SelectTrigger className="w-[155px] lg:w-[175px] rounded-xl bg-muted border-border">
                    <SelectValue placeholder="Toutes spécialités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes spécialités</SelectItem>
                    {allSpecialities.map((s: string) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative pt-0">
          {/* En-tête colonnes */}
          <div className="flex items-center px-2 sm:px-4 py-2 mb-1 border-b border-border">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex-shrink-0" style={{ width: "36px" }}>#</span>
            <span className="flex-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Cours</span>
            <span className="hidden sm:block text-[11px] font-medium text-muted-foreground uppercase tracking-wider text-center flex-shrink-0" style={{ width: "80px" }}>QCM</span>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider text-right flex-shrink-0" style={{ width: "140px" }}>
              {filterType === "toRedo" ? "À refaire" : "Maîtrise"}
            </span>
            <span style={{ width: "32px" }} />
          </div>

          {/* Liste cours */}
          <div className="space-y-0">
            <AnimatePresence mode="popLayout">
              {sortedCourses.slice(0, displayCount).map((course: any, index: number) => {
                const history = getHistoryForCourse(course.name, course.mastery);
                const average = history.reduce((s: number, h: any) => s + h.note, 0) / history.length;
                return (
                  <ExpandableCourseRow
                    key={course.name}
                    course={course}
                    index={index}
                    isExpanded={expandedCourseId === course.name}
                    onToggle={() => setExpandedCourseId(expandedCourseId === course.name ? null : course.name)}
                    filterType={filterType}
                    isDark={isDark}
                    history={history}
                    average={average}
                    radarData={[]}
                    getPercentageColor={getPercentageColor}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── StatsAndRadarSection ─────────────────────────────────────────────────────
function StatsAndRadarSection({
  successPercentage, qcmStats, radarData, radarTitle, selectedSpec,
  setSelectedSpec, selectedCourseForRadar, setSelectedCourseForRadar,
  isSpec, coursesForSubFilter, isDark, itemVariants
}: any) {
  // Toggle states
  const [precisionAsNote, setPrecisionAsNote] = React.useState(false);
  const [completedAsPct, setCompletedAsPct] = React.useState(false);
  const [seriesAsPct, setSeriesAsPct] = React.useState(false);
  const [bestAsNote, setBestAsNote] = React.useState(false);
  const [worstAsNote, setWorstAsNote] = React.useState(false);

  const pctToNote = (pct: number) => ((pct / 100) * 20).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Statistiques QCM */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.005, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="relative border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-success/6 to-transparent opacity-70 pointer-events-none z-0" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="text-primary" size={20} />
              Statistiques QCM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Précision globale */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div
                  className="cursor-pointer select-none"
                  onClick={() => setPrecisionAsNote(v => !v)}
                  title="Cliquer pour changer de format"
                >
                  <CircularProgress value={successPercentage} size={160} strokeWidth={14}
                    isDark={isDark}
                    overrideLabel={precisionAsNote
                      ? `${pctToNote(successPercentage)}/20`
                      : undefined
                    }
                  />
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  Précision globale
                  <span className="text-[10px] opacity-50">(clic)</span>
                </span>
              </div>

              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* QCM Complétés */}
                  <motion.div whileHover={{ scale: 1.005 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30 relative overflow-hidden cursor-pointer"
                      onClick={() => setCompletedAsPct(v => !v)}>
                      <CardContent className="p-3 sm:p-4 relative">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                          <CheckCircle className="text-primary" size={16} />
                          <span className="text-xs sm:text-sm text-muted-foreground">QCM complétés</span>
                        </div>
                        <motion.p
                          key={completedAsPct ? "pct" : "raw"}
                          className="text-lg sm:text-xl font-semibold text-foreground"
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {completedAsPct
                            ? `${Math.round((qcmStats.completed / qcmStats.totalQcm) * 100)}%`
                            : `${qcmStats.completed} / ${qcmStats.totalQcm}`}
                        </motion.p>
                        {!completedAsPct && (
                          <Progress value={(qcmStats.completed / qcmStats.totalQcm) * 100} className="mt-1.5 sm:mt-2 h-1" />
                        )}
                        <p className="text-[10px] text-muted-foreground/50 mt-1">clic pour {completedAsPct ? "fraction" : "pourcentage"}</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Séries complétées */}
                  <motion.div whileHover={{ scale: 1.005 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="bg-gradient-to-br from-success/10 to-transparent border-success/30 relative overflow-hidden cursor-pointer"
                      onClick={() => setSeriesAsPct(v => !v)}>
                      <CardContent className="p-3 sm:p-4 relative">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                          <ListChecks className="text-success" size={16} />
                          <span className="text-xs sm:text-sm text-muted-foreground">Séries complétées</span>
                        </div>
                        <motion.p
                          key={seriesAsPct ? "pct" : "raw"}
                          className="text-lg sm:text-xl font-semibold text-foreground"
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {seriesAsPct
                            ? `${Math.round((qcmStats.seriesCompleted / qcmStats.totalSeries) * 100)}%`
                            : `${qcmStats.seriesCompleted} / ${qcmStats.totalSeries}`}
                        </motion.p>
                        {!seriesAsPct && (
                          <Progress value={(qcmStats.seriesCompleted / qcmStats.totalSeries) * 100} className="mt-1.5 sm:mt-2 h-1" />
                        )}
                        <p className="text-[10px] text-muted-foreground/50 mt-1">clic pour {seriesAsPct ? "fraction" : "pourcentage"}</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Meilleur */}
                  <motion.div whileHover={{ scale: 1.005 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="bg-gradient-to-br from-success/10 to-transparent border-success/30 relative overflow-hidden cursor-pointer"
                      onClick={() => setBestAsNote(v => !v)}>
                      <CardContent className="p-3 sm:p-4 relative">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                          <TrendingUp className="text-success" size={16} />
                          <span className="text-xs sm:text-sm text-muted-foreground">Meilleur</span>
                        </div>
                        <p className="text-xs sm:text-sm truncate text-foreground mb-0.5">{qcmStats.bestObjective}</p>
                        <motion.p
                          key={bestAsNote ? "note" : "pct"}
                          className="text-lg sm:text-xl font-semibold text-success"
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {bestAsNote
                            ? `${pctToNote(qcmStats.bestObjectivePercent)}/20`
                            : `${qcmStats.bestObjectivePercent}%`}
                        </motion.p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1">clic pour {bestAsNote ? "pourcentage" : "note /20"}</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* À améliorer */}
                  <motion.div whileHover={{ scale: 1.005 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="bg-gradient-to-br from-destructive/10 to-transparent border-destructive/30 relative overflow-hidden cursor-pointer"
                      onClick={() => setWorstAsNote(v => !v)}>
                      <CardContent className="p-3 sm:p-4 relative">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                          <TrendingDown className="text-destructive" size={16} />
                          <span className="text-xs sm:text-sm text-muted-foreground">À améliorer</span>
                        </div>
                        <p className="text-xs sm:text-sm truncate text-foreground mb-0.5">{qcmStats.worstObjective}</p>
                        <motion.p
                          key={worstAsNote ? "note" : "pct"}
                          className="text-lg sm:text-xl font-semibold text-destructive"
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {worstAsNote
                            ? `${pctToNote(qcmStats.worstObjectivePercent)}/20`
                            : `${qcmStats.worstObjectivePercent}%`}
                        </motion.p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1">clic pour {worstAsNote ? "pourcentage" : "note /20"}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Radar */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.005, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="relative border-2 hover:border-accent/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent opacity-70 pointer-events-none z-0" />
          <CardHeader className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-accent" size={20} />
                {radarTitle}
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={selectedSpec} onValueChange={(value) => {
                  setSelectedSpec(value);
                  setSelectedCourseForRadar("all");
                }}>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["J1","J2","Cardiologie-CCV","Gynécologie","Psychiatrie","Chirurgie générale",
                      "Gastro-entérologie","Neurologie","ORL/Ophtalmologie","Pneumologie",
                      "Cancérologie","Néphrologie","Infectiologie","Hématologie","Endocrinologie","Rhumatologie"
                    ].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {!isSpec && coursesForSubFilter.length > 0 && (
                  <Select value={selectedCourseForRadar} onValueChange={setSelectedCourseForRadar}>
                    <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Cours" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Vue globale</SelectItem>
                      {coursesForSubFilter.map((c: any) => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div style={{ width: '100%', height: 280 }} className="sm:!h-[350px]">
              {radarData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Aucune donnée disponible pour cette sélection
                </div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData} id="radar-chart-main">
                  <PolarGrid stroke={isDark ? "#475569" : "#d1d5db"} />
                  <PolarAngleAxis dataKey="tag" tick={{ fill: isDark ? "#f8fafc" : "#1e293b", fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Maîtrise" dataKey="mastery"
                    stroke={isDark ? "#60a5fa" : "#4f7cff"}
                    fill={isDark ? "#60a5fa" : "#4f7cff"}
                    fillOpacity={0.6} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{
                    backgroundColor: isDark ? "#334155" : "#ffffff",
                    borderColor: isDark ? "#475569" : "#e2e8f0",
                    borderRadius: "8px"
                  }} />
                </RadarChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
