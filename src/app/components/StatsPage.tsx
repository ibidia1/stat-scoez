import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis,
  RadialBarChart, RadialBar, PieChart, Pie, Cell, CartesianGrid, ReferenceLine
} from "recharts";
import { 
  Search, Flame, CheckCircle, Clock, TrendingUp, Target, TrendingDown, 
  ListChecks, BarChart3 as BarChart3Icon, ChevronUp, ChevronDown,
  Award, Zap, Calendar, Activity, ChevronRight, BookOpen, RotateCcw,
  Eye, Trophy, Hash, Sparkles, ArrowRight, AlertCircle, Moon, Sun
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

// Hiérarchie J1/J2 selon le système tunisien
const J1_SPECIALITIES = [
  "Cardiologie-CCV",
  "Gynécologie",
  "Psychiatrie",
  "Chirurgie générale",
  "Gastro-entérologie",
  "Neurologie",
  "ORL/Ophtalmologie",
  "Pneumologie"
];

const J2_SPECIALITIES = [
  "Cancérologie",
  "Néphrologie",
  "Infectiologie",
  "Hématologie",
  "Endocrinologie",
  "Rhumatologie"
];

const mockRadarData: { [key: string]: Array<{ tag: string; mastery: number }> } = {
  // Vue J1 - Moyenne des spécialités
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
  // Vue J2 - Moyenne des spécialités
  J2: [
    { tag: "Cancérologie", mastery: 72 },
    { tag: "Néphrologie", mastery: 50 },
    { tag: "Infectiologie", mastery: 85 },
    { tag: "Hématologie", mastery: 60 },
    { tag: "Endocrinologie", mastery: 68 },
    { tag: "Rhumatologie", mastery: 55 }
  ],
  // Spécialités J1
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
  // Spécialités J2
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
  // Cardiologie-CCV
  "SCA": [
    { tag: "Pharmaco", mastery: 85 },
    { tag: "Anatomie", mastery: 75 },
    { tag: "Physiologie", mastery: 80 },
    { tag: "Clinique", mastery: 90 },
    { tag: "Biologie", mastery: 70 }
  ],
  "HTA": [
    { tag: "Pharmaco", mastery: 90 },
    { tag: "Anatomie", mastery: 50 },
    { tag: "Physiologie", mastery: 80 },
    { tag: "Clinique", mastery: 85 },
    { tag: "Biologie", mastery: 75 }
  ],
  "MVTE": [
    { tag: "Pharmaco", mastery: 70 },
    { tag: "Anatomie", mastery: 85 },
    { tag: "Physiologie", mastery: 75 },
    { tag: "Clinique", mastery: 80 },
    { tag: "Biologie", mastery: 65 }
  ],
  "Endocardite": [
    { tag: "Pharmaco", mastery: 88 },
    { tag: "Anatomie", mastery: 60 },
    { tag: "Physiologie", mastery: 70 },
    { tag: "Clinique", mastery: 92 },
    { tag: "Biologie", mastery: 85 }
  ],
  "ECG de base": [
    { tag: "Pharmaco", mastery: 20 },
    { tag: "Anatomie", mastery: 90 },
    { tag: "Physiologie", mastery: 95 },
    { tag: "Clinique", mastery: 85 },
    { tag: "Biologie", mastery: 10 }
  ],
  "Arythmies": [
    { tag: "Pharmaco", mastery: 72 },
    { tag: "Anatomie", mastery: 68 },
    { tag: "Physiologie", mastery: 78 },
    { tag: "Clinique", mastery: 80 },
    { tag: "Biologie", mastery: 65 }
  ],
  // Gynécologie
  "Grossesse": [
    { tag: "Obstétrique", mastery: 75 },
    { tag: "Pharmaco", mastery: 70 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Complications", mastery: 68 },
    { tag: "Imagerie", mastery: 65 }
  ],
  "Accouchement": [
    { tag: "Techniques", mastery: 70 },
    { tag: "Complications", mastery: 65 },
    { tag: "Urgences", mastery: 68 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Analgésie", mastery: 60 }
  ],
  "Fibrome": [
    { tag: "Diagnostic", mastery: 65 },
    { tag: "Clinique", mastery: 68 },
    { tag: "Traitement", mastery: 62 },
    { tag: "Imagerie", mastery: 70 },
    { tag: "Chirurgie", mastery: 58 }
  ],
  // Psychiatrie
  "Dépression": [
    { tag: "Sémiologie", mastery: 75 },
    { tag: "Pharmaco", mastery: 72 },
    { tag: "Psychothérapie", mastery: 68 },
    { tag: "Clinique", mastery: 78 },
    { tag: "Urgences", mastery: 70 }
  ],
  "Schizophrénie": [
    { tag: "Sémiologie", mastery: 70 },
    { tag: "Pharmaco", mastery: 68 },
    { tag: "Clinique", mastery: 65 },
    { tag: "Évolution", mastery: 62 },
    { tag: "Urgences", mastery: 72 }
  ],
  // Gastro-entérologie
  "Cirrhose": [
    { tag: "Étiologies", mastery: 78 },
    { tag: "Complications", mastery: 75 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Biologie", mastery: 80 },
    { tag: "Traitement", mastery: 70 }
  ],
  "MICI": [
    { tag: "Diagnostic", mastery: 70 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Traitement", mastery: 68 },
    { tag: "Complications", mastery: 65 },
    { tag: "Biologie", mastery: 75 }
  ],
  // Neurologie
  "AVC": [
    { tag: "Clinique", mastery: 65 },
    { tag: "Imagerie", mastery: 60 },
    { tag: "Urgences", mastery: 68 },
    { tag: "Traitement", mastery: 62 },
    { tag: "Séquelles", mastery: 58 }
  ],
  "Épilepsie": [
    { tag: "Sémiologie", mastery: 60 },
    { tag: "Pharmaco", mastery: 58 },
    { tag: "Clinique", mastery: 62 },
    { tag: "Classification", mastery: 55 },
    { tag: "Urgences", mastery: 65 }
  ],
  // Pneumologie
  "Asthme": [
    { tag: "Physiopath", mastery: 70 },
    { tag: "Pharmaco", mastery: 68 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Urgences", mastery: 65 },
    { tag: "Complications", mastery: 62 }
  ],
  "BPCO": [
    { tag: "Physiopath", mastery: 65 },
    { tag: "Pharmaco", mastery: 68 },
    { tag: "Clinique", mastery: 70 },
    { tag: "Exacerbation", mastery: 62 },
    { tag: "Oxygénothérapie", mastery: 60 }
  ],
  // Endocrinologie
  "Diabète type 1": [
    { tag: "Pharmaco", mastery: 75 },
    { tag: "Physiopath", mastery: 70 },
    { tag: "Clinique", mastery: 68 },
    { tag: "Complications", mastery: 72 },
    { tag: "Biologie", mastery: 85 }
  ],
  "Diabète type 2": [
    { tag: "Pharmaco", mastery: 80 },
    { tag: "Physiopath", mastery: 75 },
    { tag: "Clinique", mastery: 78 },
    { tag: "Complications", mastery: 70 },
    { tag: "Biologie", mastery: 82 }
  ],
  "Thyroïde": [
    { tag: "Pharmaco", mastery: 60 },
    { tag: "Anatomie", mastery: 70 },
    { tag: "Physiologie", mastery: 65 },
    { tag: "Clinique", mastery: 75 },
    { tag: "Biologie", mastery: 90 }
  ],
  // Néphrologie
  "IRA": [
    { tag: "Étiologies", mastery: 55 },
    { tag: "Diagnostic", mastery: 50 },
    { tag: "Biologie", mastery: 60 },
    { tag: "Clinique", mastery: 52 },
    { tag: "Traitement", mastery: 48 }
  ],
  "IRC": [
    { tag: "Étiologies", mastery: 60 },
    { tag: "Stades", mastery: 58 },
    { tag: "Biologie", mastery: 65 },
    { tag: "Complications", mastery: 52 },
    { tag: "Dialyse", mastery: 50 }
  ],
  // Cancérologie
  "CBP": [
    { tag: "Épidémio", mastery: 85 },
    { tag: "Diagnostic", mastery: 80 },
    { tag: "Traitement", mastery: 75 },
    { tag: "Complications", mastery: 82 },
    { tag: "Suivi", mastery: 78 }
  ],
  "CCR": [
    { tag: "Épidémio", mastery: 70 },
    { tag: "Diagnostic", mastery: 65 },
    { tag: "Traitement", mastery: 68 },
    { tag: "Complications", mastery: 60 },
    { tag: "Suivi", mastery: 72 }
  ],
  // Infectiologie
  "VIH": [
    { tag: "Pharmaco", mastery: 90 },
    { tag: "Diagnostic", mastery: 85 },
    { tag: "Clinique", mastery: 88 },
    { tag: "Biologie", mastery: 82 },
    { tag: "Prévention", mastery: 95 }
  ],
  "Tuberculose": [
    { tag: "Diagnostic", mastery: 82 },
    { tag: "Pharmaco", mastery: 80 },
    { tag: "Clinique", mastery: 78 },
    { tag: "Complications", mastery: 75 },
    { tag: "Prévention", mastery: 85 }
  ],
  // Hématologie
  "Anémies": [
    { tag: "Classification", mastery: 65 },
    { tag: "Diagnostic", mastery: 60 },
    { tag: "Biologie", mastery: 70 },
    { tag: "Traitement", mastery: 58 },
    { tag: "Étiologies", mastery: 62 }
  ],
  "Leucémies": [
    { tag: "Classification", mastery: 58 },
    { tag: "Diagnostic", mastery: 55 },
    { tag: "Biologie", mastery: 62 },
    { tag: "Traitement", mastery: 52 },
    { tag: "Complications", mastery: 50 }
  ]
};

interface Course {
  name: string;
  speciality: string;
  mastery: number;
  toRedo: number;
  qcmDone: number;
  lastReviewed: string;
}

const mockCourses: Course[] = [
  // JOUR 1 - Neurologie
  { name: "AVC", speciality: "Neurologie", mastery: 62, toRedo: 38, qcmDone: 75, lastReviewed: "2025-01-08" },
  { name: "Céphalées", speciality: "Neurologie", mastery: 68, toRedo: 32, qcmDone: 82, lastReviewed: "2025-01-10" },
  { name: "Épilepsies", speciality: "Neurologie", mastery: 58, toRedo: 42, qcmDone: 65, lastReviewed: "2025-01-06" },
  
  // JOUR 1 - Psychiatrie
  { name: "États confusionnels", speciality: "Psychiatrie", mastery: 70, toRedo: 30, qcmDone: 88, lastReviewed: "2025-01-12" },
  { name: "Schizophrénie", speciality: "Psychiatrie", mastery: 68, toRedo: 32, qcmDone: 70, lastReviewed: "2025-01-07" },
  { name: "Troubles de l'humeur", speciality: "Psychiatrie", mastery: 72, toRedo: 28, qcmDone: 80, lastReviewed: "2025-01-11" },
  { name: "Troubles anxieux", speciality: "Psychiatrie", mastery: 75, toRedo: 25, qcmDone: 92, lastReviewed: "2025-01-13" },
  
  // JOUR 1 - Ophtalmologie
  { name: "Œil rouge", speciality: "Ophtalmologie", mastery: 78, toRedo: 22, qcmDone: 95, lastReviewed: "2025-01-14" },
  
  // JOUR 1 - ORL
  { name: "IVAS", speciality: "ORL", mastery: 82, toRedo: 18, qcmDone: 105, lastReviewed: "2025-01-15" },
  { name: "Cancer du cavum", speciality: "ORL", mastery: 65, toRedo: 35, qcmDone: 72, lastReviewed: "2025-01-09" },
  
  // JOUR 1 - Pneumologie
  { name: "CBP", speciality: "Pneumologie", mastery: 82, toRedo: 18, qcmDone: 130, lastReviewed: "2025-01-13" },
  { name: "Infections respiratoires basses", speciality: "Pneumologie", mastery: 70, toRedo: 30, qcmDone: 88, lastReviewed: "2025-01-11" },
  { name: "Tuberculose pulmonaire", speciality: "Pneumologie", mastery: 80, toRedo: 20, qcmDone: 125, lastReviewed: "2025-01-12" },
  { name: "Asthme", speciality: "Pneumologie", mastery: 68, toRedo: 32, qcmDone: 85, lastReviewed: "2025-01-10" },
  { name: "BPCO", speciality: "Pneumologie", mastery: 65, toRedo: 35, qcmDone: 78, lastReviewed: "2025-01-08" },
  
  // JOUR 1 - Cardiologie-CCVT
  { name: "SCA", speciality: "Cardiologie-CCVT", mastery: 82, toRedo: 18, qcmDone: 95, lastReviewed: "2025-01-14" },
  { name: "Douleur thoracique", speciality: "Cardiologie-CCVT", mastery: 88, toRedo: 12, qcmDone: 102, lastReviewed: "2025-01-15" },
  { name: "HTA", speciality: "Cardiologie-CCVT", mastery: 88, toRedo: 12, qcmDone: 110, lastReviewed: "2025-01-13" },
  { name: "Endocardite infectieuse", speciality: "Cardiologie-CCVT", mastery: 80, toRedo: 20, qcmDone: 90, lastReviewed: "2025-01-10" },
  { name: "Ischémie des membres", speciality: "Cardiologie-CCVT", mastery: 72, toRedo: 28, qcmDone: 83, lastReviewed: "2025-01-09" },
  { name: "MVTE", speciality: "Cardiologie-CCVT", mastery: 75, toRedo: 25, qcmDone: 85, lastReviewed: "2025-01-12" },
  
  // JOUR 1 - Gastro-entérologie
  { name: "Dysphagies", speciality: "Gastro-entérologie", mastery: 70, toRedo: 30, qcmDone: 77, lastReviewed: "2025-01-10" },
  { name: "Ictères", speciality: "Gastro-entérologie", mastery: 68, toRedo: 32, qcmDone: 85, lastReviewed: "2025-01-11" },
  { name: "Diarrhées chroniques", speciality: "Gastro-entérologie", mastery: 72, toRedo: 28, qcmDone: 91, lastReviewed: "2025-01-12" },
  { name: "Ulcère gastro-duodénal", speciality: "Gastro-entérologie", mastery: 75, toRedo: 25, qcmDone: 95, lastReviewed: "2025-01-12" },
  { name: "Hémorragies digestives", speciality: "Gastro-entérologie", mastery: 78, toRedo: 22, qcmDone: 98, lastReviewed: "2025-01-13" },
  
  // JOUR 1 - Chirurgie générale
  { name: "Péritonite aiguë", speciality: "Chirurgie générale", mastery: 74, toRedo: 26, qcmDone: 89, lastReviewed: "2025-01-11" },
  { name: "Appendicite aiguë", speciality: "Chirurgie générale", mastery: 85, toRedo: 15, qcmDone: 112, lastReviewed: "2025-01-14" },
  { name: "Cancer colorectal", speciality: "Chirurgie générale", mastery: 70, toRedo: 30, qcmDone: 82, lastReviewed: "2025-01-10" },
  { name: "Occlusion intestinale aiguë", speciality: "Chirurgie générale", mastery: 68, toRedo: 32, qcmDone: 76, lastReviewed: "2025-01-09" },
  
  // JOUR 1 - Gynécologie-Obstétrique
  { name: "Cancer du col", speciality: "Gynécologie-Obstétrique", mastery: 72, toRedo: 28, qcmDone: 88, lastReviewed: "2025-01-11" },
  { name: "Cancer du sein", speciality: "Gynécologie-Obstétrique", mastery: 80, toRedo: 20, qcmDone: 105, lastReviewed: "2025-01-13" },
  { name: "Contraception", speciality: "Gynécologie-Obstétrique", mastery: 90, toRedo: 10, qcmDone: 120, lastReviewed: "2025-01-15" },
  { name: "Grossesse extra-utérine", speciality: "Gynécologie-Obstétrique", mastery: 70, toRedo: 30, qcmDone: 85, lastReviewed: "2025-01-10" },
  { name: "Prééclampsie – éclampsie", speciality: "Gynécologie-Obstétrique", mastery: 65, toRedo: 35, qcmDone: 78, lastReviewed: "2025-01-08" },
  { name: "Métrorragies", speciality: "Gynécologie-Obstétrique", mastery: 68, toRedo: 32, qcmDone: 90, lastReviewed: "2025-01-09" },
  
  // JOUR 2 - Urologie
  { name: "Tumeurs de la prostate", speciality: "Urologie", mastery: 75, toRedo: 25, qcmDone: 92, lastReviewed: "2025-01-12" },
  { name: "Lithiase urinaire", speciality: "Urologie", mastery: 78, toRedo: 22, qcmDone: 98, lastReviewed: "2025-01-13" },
  { name: "Hématuries", speciality: "Urologie", mastery: 70, toRedo: 30, qcmDone: 85, lastReviewed: "2025-01-10" },
  { name: "Infections urinaires", speciality: "Urologie", mastery: 88, toRedo: 12, qcmDone: 115, lastReviewed: "2025-01-15" },
  
  // JOUR 2 - Néphrologie
  { name: "Troubles acido-basiques", speciality: "Néphrologie", mastery: 55, toRedo: 45, qcmDone: 70, lastReviewed: "2025-01-06" },
  { name: "Dyskaliémies", speciality: "Néphrologie", mastery: 58, toRedo: 42, qcmDone: 74, lastReviewed: "2025-01-07" },
  { name: "Troubles de l'hydratation", speciality: "Néphrologie", mastery: 60, toRedo: 40, qcmDone: 78, lastReviewed: "2025-01-08" },
  { name: "Œdèmes", speciality: "Néphrologie", mastery: 62, toRedo: 38, qcmDone: 81, lastReviewed: "2025-01-09" },
  { name: "Insuffisance rénale aiguë", speciality: "Néphrologie", mastery: 50, toRedo: 50, qcmDone: 65, lastReviewed: "2025-01-03" },
  
  // JOUR 2 - Réanimation
  { name: "Intoxication", speciality: "Réanimation", mastery: 68, toRedo: 32, qcmDone: 87, lastReviewed: "2025-01-10" },
  { name: "Polytraumatisme", speciality: "Réanimation", mastery: 70, toRedo: 30, qcmDone: 92, lastReviewed: "2025-01-11" },
  { name: "État de choc hémorragique", speciality: "Réanimation", mastery: 72, toRedo: 28, qcmDone: 95, lastReviewed: "2025-01-12" },
  { name: "État de choc cardiogénique", speciality: "Réanimation", mastery: 75, toRedo: 25, qcmDone: 98, lastReviewed: "2025-01-13" },
  { name: "États septiques graves", speciality: "Réanimation", mastery: 78, toRedo: 22, qcmDone: 102, lastReviewed: "2025-01-14" },
  { name: "Arrêt cardio-circulatoire", speciality: "Réanimation", mastery: 85, toRedo: 15, qcmDone: 120, lastReviewed: "2025-01-15" },
  { name: "Brûlures cutanées", speciality: "Réanimation", mastery: 65, toRedo: 35, qcmDone: 75, lastReviewed: "2025-01-08" },
  { name: "Traumatisme crânien", speciality: "Réanimation", mastery: 68, toRedo: 32, qcmDone: 82, lastReviewed: "2025-01-09" },
  { name: "Comas", speciality: "Réanimation", mastery: 70, toRedo: 30, qcmDone: 88, lastReviewed: "2025-01-10" },
  { name: "Prise en charge d'une douleur aiguë", speciality: "Réanimation", mastery: 80, toRedo: 20, qcmDone: 105, lastReviewed: "2025-01-13" },
  
  // JOUR 2 - Endocrinologie
  { name: "Insuffisance surrénalienne aiguë", speciality: "Endocrinologie", mastery: 62, toRedo: 38, qcmDone: 72, lastReviewed: "2025-01-08" },
  { name: "Hyperthyroïdie", speciality: "Endocrinologie", mastery: 68, toRedo: 32, qcmDone: 85, lastReviewed: "2025-01-10" },
  { name: "Hypothyroïdie", speciality: "Endocrinologie", mastery: 70, toRedo: 30, qcmDone: 88, lastReviewed: "2025-01-11" },
  { name: "Dyslipidémies", speciality: "Endocrinologie", mastery: 75, toRedo: 25, qcmDone: 95, lastReviewed: "2025-01-12" },
  { name: "Diabète sucré", speciality: "Endocrinologie", mastery: 65, toRedo: 35, qcmDone: 90, lastReviewed: "2025-01-14" },
  
  // JOUR 2 - Médecine Interne
  { name: "Hypercalcémies", speciality: "Médecine Interne", mastery: 60, toRedo: 40, qcmDone: 75, lastReviewed: "2025-01-07" },
  { name: "Purpura", speciality: "Médecine Interne", mastery: 65, toRedo: 35, qcmDone: 82, lastReviewed: "2025-01-09" },
  
  // JOUR 2 - Infectiologie
  { name: "Méningite", speciality: "Infectiologie", mastery: 78, toRedo: 22, qcmDone: 105, lastReviewed: "2025-01-13" },
  { name: "IST", speciality: "Infectiologie", mastery: 85, toRedo: 15, qcmDone: 118, lastReviewed: "2025-01-15" },
  { name: "Hépatites virales", speciality: "Infectiologie", mastery: 82, toRedo: 18, qcmDone: 110, lastReviewed: "2025-01-14" },
  
  // JOUR 2 - Hématologie
  { name: "Splénomégalies", speciality: "Hématologie", mastery: 62, toRedo: 38, qcmDone: 78, lastReviewed: "2025-01-08" },
  { name: "Adénopathies superficielles", speciality: "Hématologie", mastery: 65, toRedo: 35, qcmDone: 82, lastReviewed: "2025-01-09" },
  { name: "Anémie", speciality: "Hématologie", mastery: 60, toRedo: 40, qcmDone: 88, lastReviewed: "2025-01-07" },
  { name: "Transfusion sanguine", speciality: "Hématologie", mastery: 55, toRedo: 45, qcmDone: 75, lastReviewed: "2025-01-05" },
  
  // JOUR 2 - Orthopédie-Rhumatologie
  { name: "Arthrite septique", speciality: "Orthopédie-Rhumatologie", mastery: 68, toRedo: 32, qcmDone: 85, lastReviewed: "2025-01-10" },
  { name: "Fractures ouvertes de la jambe", speciality: "Orthopédie-Rhumatologie", mastery: 72, toRedo: 28, qcmDone: 92, lastReviewed: "2025-01-11" },
  { name: "Polyarthrite rhumatoïde", speciality: "Orthopédie-Rhumatologie", mastery: 70, toRedo: 30, qcmDone: 88, lastReviewed: "2025-01-10" },
  
  // JOUR 2 - Pédiatrie
  { name: "Bronchiolite", speciality: "Pédiatrie", mastery: 80, toRedo: 20, qcmDone: 105, lastReviewed: "2025-01-13" },
  { name: "Déshydratation aiguë de l'enfant", speciality: "Pédiatrie", mastery: 75, toRedo: 25, qcmDone: 95, lastReviewed: "2025-01-12" },
  { name: "Vaccinations", speciality: "Pédiatrie", mastery: 90, toRedo: 10, qcmDone: 125, lastReviewed: "2025-01-15" }
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

// Mock course score history for drill-down charts
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
  "MVTE": [
    { date: "14 Déc", note: 8 }, { date: "22 Déc", note: 10 }, { date: "30 Déc", note: 12 },
    { date: "07 Jan", note: 14 }, { date: "15 Jan", note: 15 }
  ],
  "Endocardite": [
    { date: "10 Déc", note: 11 }, { date: "19 Déc", note: 13 }, { date: "27 Déc", note: 15 },
    { date: "04 Jan", note: 16 }, { date: "12 Jan", note: 16 }
  ],
  "Arythmies": [
    { date: "15 Déc", note: 9 }, { date: "23 Déc", note: 11 }, { date: "01 Jan", note: 13 },
    { date: "09 Jan", note: 14 }, { date: "17 Jan", note: 15 }
  ],
  "IRA": [
    { date: "08 Déc", note: 6 }, { date: "16 Déc", note: 7 }, { date: "24 Déc", note: 8 },
    { date: "02 Jan", note: 9 }, { date: "10 Jan", note: 10 }
  ],
  "IRC": [
    { date: "10 Déc", note: 7 }, { date: "18 Déc", note: 8 }, { date: "26 Déc", note: 9 },
    { date: "04 Jan", note: 10 }, { date: "12 Jan", note: 11 }
  ],
  "Épilepsie": [
    { date: "05 Déc", note: 7 }, { date: "14 Déc", note: 8 }, { date: "23 Déc", note: 9 },
    { date: "02 Jan", note: 10 }, { date: "11 Jan", note: 12 }
  ],
  "Leucémies": [
    { date: "06 Déc", note: 6 }, { date: "15 Déc", note: 7 }, { date: "24 Déc", note: 8 },
    { date: "03 Jan", note: 9 }, { date: "12 Jan", note: 11 }
  ],
  "VIH": [
    { date: "08 Déc", note: 14 }, { date: "16 Déc", note: 15 }, { date: "24 Déc", note: 16 },
    { date: "02 Jan", note: 17 }, { date: "10 Jan", note: 17 }
  ],
  "Tuberculose": [
    { date: "10 Déc", note: 12 }, { date: "18 Déc", note: 14 }, { date: "27 Déc", note: 15 },
    { date: "05 Jan", note: 16 }, { date: "13 Jan", note: 16 }
  ],
  "CBP": [
    { date: "12 Déc", note: 13 }, { date: "20 Déc", note: 14 }, { date: "28 Déc", note: 15 },
    { date: "06 Jan", note: 16 }, { date: "14 Jan", note: 17 }
  ],
  "Grossesse": [
    { date: "08 Déc", note: 9 }, { date: "17 Déc", note: 11 }, { date: "26 Déc", note: 12 },
    { date: "04 Jan", note: 13 }, { date: "13 Jan", note: 14 }
  ],
  "Fibrome": [
    { date: "06 Déc", note: 8 }, { date: "15 Déc", note: 9 }, { date: "24 Déc", note: 10 },
    { date: "03 Jan", note: 12 }, { date: "12 Jan", note: 13 }
  ],
};

// Generate default history for courses without specific data
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

// --- Fonctions utilitaires ---

const hexToRgb = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
  const hex = Math.round(x).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}).join('');

const getPercentageColor = (percentage: number, isDark: boolean) => {
  if (percentage < 50) {
    return isDark ? "#ef4444" : "#dc2626";
  } else if (percentage < 75) {
    return isDark ? "#f97316" : "#ff8f00";
  } else {
    return isDark ? "#22c55e" : "#059669";
  }
};

const getGradientColor = (index: number, total = 10, isDark = false) => {
  const colors = isDark 
    ? [
        hexToRgb("#ef4444"),
        hexToRgb("#f97316"),
        hexToRgb("#22c55e")
      ]
    : [
        hexToRgb("#dc2626"),
        hexToRgb("#ff8f00"),
        hexToRgb("#059669")
      ];
  
  const fraction = index / (total - 1);
  
  let r, g, b;
  if (fraction < 0.5) {
    const localFraction = fraction * 2;
    r = Math.round(colors[0].r + (colors[1].r - colors[0].r) * localFraction);
    g = Math.round(colors[0].g + (colors[1].g - colors[0].g) * localFraction);
    b = Math.round(colors[0].b + (colors[1].b - colors[0].b) * localFraction);
  } else {
    const localFraction = (fraction - 0.5) * 2;
    r = Math.round(colors[1].r + (colors[2].r - colors[1].r) * localFraction);
    g = Math.round(colors[1].g + (colors[2].g - colors[1].g) * localFraction);
    b = Math.round(colors[1].b + (colors[2].b - colors[1].b) * localFraction);
  }
  return rgbToHex(r, g, b);
};

const getGradientBgColor = (index: number, total = 10, isDark = false, opacity = 0.15) => {
  const colorHex = getGradientColor(index, total, isDark);
  const { r, g, b } = hexToRgb(colorHex);
  
  const bgColor = isDark ? 30 : 255;
  const r_bg = Math.round(r * opacity + bgColor * (1 - opacity));
  const g_bg = Math.round(g * opacity + bgColor * (1 - opacity));
  const b_bg = Math.round(b * opacity + bgColor * (1 - opacity));
  return rgbToHex(r_bg, g_bg, b_bg);
};

// --- Composant Counter animé ---
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
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numValue]);

  return <>{count}{suffix}</>;
};

// --- Composant StatCard amélioré ---
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: { value: number; isUp: boolean };
  color: string;
  onClick?: () => void;
}

const StatCard = ({ icon, label, value, trend, color, onClick }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.005, y: -1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`relative overflow-hidden cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 ${onClick ? 'hover:shadow-lg' : ''}`}
        onClick={onClick}
      >
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/8 to-transparent opacity-80"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        {/* Pulse effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0"
          whileHover={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
              'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.12) 0%, rgba(255, 143, 0, 0.03) 70%)',
              'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              className="p-3 rounded-xl bg-background/80 shadow-sm"
              whileHover={{ rotate: [0, -2, 2, -2, 0] }}
              transition={{ duration: 0.5 }}
            >
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
              {value.includes('%') ? (
                <>
                  <AnimatedCounter value={parseInt(value)} />%
                </>
              ) : value.match(/^\d+$/) ? (
                <AnimatedCounter value={parseInt(value)} />
              ) : (
                value
              )}
            </h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// --- Composant CircularProgress ---
const CircularProgress = ({ 
  value, 
  size = 120, 
  strokeWidth = 12,
  label,
  isDark = false 
}: { 
  value: number; 
  size?: number; 
  strokeWidth?: number;
  label?: string;
  isDark?: boolean;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = getPercentageColor(value, isDark);

  return (
    <motion.div 
      className="relative inline-flex items-center justify-center"
      initial={{ scale: 0, rotate: 0 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? "#334155" : "#e2e8f0"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span 
          className="text-3xl"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatedCounter value={value} suffix="%" />
        </motion.span>
        {label && (
          <span className="text-xs text-muted-foreground mt-1">{label}</span>
        )}
      </div>
    </motion.div>
  );
};

// --- Composant Donut Chart amélioré ---
const EnhancedDonutChart = ({ data, isDark }: { data: any[]; isDark: boolean }) => {
  const COLORS = isDark 
    ? ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#fb923c", "#f472b6"]
    : ["#4f7cff", "#059669", "#ff8f00", "#dc2626", "#8b5cf6", "#f97316", "#ec4899"];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart id="pie-chart-specialty">
        <Pie
          key="pie"
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percentage }) => `${percentage}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          key="tooltip"
          formatter={(value: any, name: any, props: any) => [
            `${value} QCM (${props.payload.percentage}%)`,
            name
          ]}
          contentStyle={{ 
            backgroundColor: isDark ? "#334155" : "#ffffff",
            borderColor: isDark ? "#475569" : "#e2e8f0",
            borderRadius: "8px"
          }} 
        />
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
    // Appliquer la classe dark au body
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const filteredCourses = mockCourses.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) =>
    filterType === "toRedo" ? a.toRedo - b.toRedo : b.mastery - a.mastery
  );

  const isSpec = ["J1", "J2"].includes(selectedSpec);
  
  // Déterminer les données du radar
  let radarData: Array<{ tag: string; mastery: number }> = [];
  let radarTitle = "";
  
  if (isSpec) {
    // Si c'est J1 ou J2, montrer la vue générale
    radarData = mockRadarData[selectedSpec] || [];
    radarTitle = `Maîtrise - ${selectedSpec}`;
  } else {
    // Si c'est une spécialité
    if (selectedCourseForRadar === "all") {
      // Vue générale de la spécialité
      radarData = mockRadarData[selectedSpec] || [];
      radarTitle = `Maîtrise - ${selectedSpec}`;
    } else {
      // Vue d'un cours spécifique
      radarData = mockCourseRadarData[selectedCourseForRadar] || [];
      radarTitle = `${selectedSpec} - ${selectedCourseForRadar}`;
    }
  }

  // Cours disponibles pour le sous-filtre (seulement si c'est une spécialité, pas J1/J2)
  const coursesForSubFilter = !isSpec ? mockCourses.filter(c => c.speciality === selectedSpec) : [];

  const totalQcm = mockCourses.reduce((sum, c) => sum + c.qcmDone, 0);
  const weeklyQcm = 160;
  const progressPercent = Math.round((totalQcm / 5000) * 100);

  // Données pour le donut chart - Répartition des QCM de la semaine par spécialité
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
            {/* Circular scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <CircularProgress 
                  value={selectedCourse.mastery} 
                  size={110} 
                  strokeWidth={10}
                  isDark={isDarkMode}
                />
                <p className="text-sm text-muted-foreground mt-2">Maîtrise</p>
              </div>
              <div className="text-center">
                <CircularProgress 
                  value={100 - selectedCourse.toRedo} 
                  size={110} 
                  strokeWidth={10}
                  isDark={isDarkMode}
                />
                <p className="text-sm text-muted-foreground mt-2">Progression</p>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl p-3 text-center" style={{
                background: isDarkMode ? "#0f172a" : "#f8fafc",
                border: `1px solid ${isDarkMode ? "#1e293b" : "#e2e8f0"}`
              }}>
                <div style={{ fontSize: "11px", color: isDarkMode ? "#64748b" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>QCM faits</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#4f7cff", lineHeight: 1 }}>{selectedCourse.qcmDone}</div>
              </div>
              <div className="rounded-xl p-3 text-center" style={{
                background: isDarkMode ? "#0f172a" : "#f8fafc",
                border: `1px solid ${isDarkMode ? "#1e293b" : "#e2e8f0"}`
              }}>
                <div style={{ fontSize: "11px", color: isDarkMode ? "#64748b" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>À refaire</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: getPercentageColor(100 - selectedCourse.toRedo, isDarkMode), lineHeight: 1 }}>{selectedCourse.toRedo}%</div>
              </div>
              <div className="rounded-xl p-3 text-center" style={{
                background: isDarkMode ? "#0f172a" : "#f8fafc",
                border: `1px solid ${isDarkMode ? "#1e293b" : "#e2e8f0"}`
              }}>
                <div style={{ fontSize: "11px", color: isDarkMode ? "#64748b" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Moy. note</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#059669", lineHeight: 1 }}>{avg.toFixed(1)}</div>
              </div>
            </div>

            {/* Progress chart */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "13px", fontWeight: 600, color: theme === "dark" ? "#f1f5f9" : "#1e293b" }}>
                  Évolution des notes
                </span>
              </div>
              <div className="rounded-xl overflow-hidden" style={{
                background: theme === "dark" ? "#0f172a" : "#f8fafc",
                border: `1px solid ${theme === "dark" ? "#1e293b" : "#e2e8f0"}`
              }}>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={history} id="area-chart-dialog" margin={{ top: 12, right: 16, left: -16, bottom: 4 }}>
                    <defs key="defs">
                      <linearGradient id="dlgGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f7cff" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4f7cff" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid key="grid" strokeDasharray="3 3" stroke={theme === "dark" ? "#1e293b" : "#f1f5f9"} vertical={false} />
                    <XAxis key="xaxis" dataKey="date" stroke={theme === "dark" ? "#475569" : "#94a3b8"} style={{ fontSize: "11px" }} tickLine={false} axisLine={{ stroke: theme === "dark" ? "#334155" : "#e2e8f0" }} dy={6} />
                    <YAxis key="yaxis" domain={[0, 20]} stroke={theme === "dark" ? "#475569" : "#94a3b8"} style={{ fontSize: "11px" }} tickLine={false} axisLine={{ stroke: theme === "dark" ? "#334155" : "#e2e8f0" }} dx={-6} ticks={[0, 5, 10, 15, 20]} />
                    <Tooltip key="tooltip" content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{ backgroundColor: theme === "dark" ? "rgba(30,41,59,0.98)" : "rgba(255,255,255,0.98)", borderRadius: "10px", padding: "8px 12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                            <p style={{ color: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: "11px", marginBottom: "2px" }}>{payload[0].payload.date}</p>
                            <p style={{ color: "#4f7cff", fontWeight: 700, fontSize: "15px", lineHeight: 1 }}>{payload[0].value}<span style={{ fontSize: "11px", fontWeight: 400 }}>/20</span></p>
                          </div>
                        );
                      }
                      return null;
                    }} cursor={{ stroke: theme === "dark" ? "#f1f5f9" : "#1e293b", strokeWidth: 1.5 }} />
                    <ReferenceLine key="refline" y={avg} stroke="#059669" strokeDasharray="6 4" strokeWidth={1.5} />
                    <Area key="area" type="monotone" dataKey="note" stroke="#4f7cff" strokeWidth={2} fillOpacity={1} fill="url(#dlgGrad)" dot={false} activeDot={{ r: 4, fill: "#4f7cff", strokeWidth: 2, stroke: "#fff" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar if available */}
            {radarDataForCourse.length > 0 && (
              <div>
                <div className="mb-2">
                  <span style={{ fontSize: "13px", fontWeight: 600, color: theme === "dark" ? "#f1f5f9" : "#1e293b" }}>
                    Radar par tag
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarDataForCourse} id="radar-chart-dialog">
                    <PolarGrid key="grid" stroke={theme === "dark" ? "#334155" : "#e2e8f0"} />
                    <PolarAngleAxis key="angle" dataKey="tag" tick={{ fill: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: 11 }} />
                    <PolarRadiusAxis key="radius" domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar key="radar" name="Maîtrise" dataKey="mastery" stroke="#4f7cff" fill="#4f7cff" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Footer stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl p-3 text-center transition-all" style={{ background: theme === "dark" ? "rgba(220,38,38,0.1)" : "#fef2f2", border: `1px solid ${theme === "dark" ? "rgba(220,38,38,0.2)" : "#fee2e2"}` }}>
                <div style={{ fontSize: "10px", color: "#dc2626", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Pire note</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#dc2626", lineHeight: 1 }}>{Math.min(...history.map(h => h.note))}</div>
              </div>
              <div className="rounded-xl p-3 text-center transition-all" style={{ background: theme === "dark" ? "rgba(5,150,105,0.1)" : "#ecfdf5", border: `1px solid ${theme === "dark" ? "rgba(5,150,105,0.2)" : "#d1fae5"}` }}>
                <div style={{ fontSize: "10px", color: "#059669", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Meilleure note</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#059669", lineHeight: 1 }}>{Math.max(...history.map(h => h.note))}</div>
              </div>
              <div className="rounded-xl p-3 text-center transition-all" style={{ background: theme === "dark" ? "rgba(255,143,0,0.1)" : "#fff7ed", border: `1px solid ${theme === "dark" ? "rgba(255,143,0,0.2)" : "#fed7aa"}` }}>
                <div style={{ fontSize: "10px", color: "#ff8f00", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Total essais</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#ff8f00", lineHeight: 1 }}>{history.length}</div>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </DialogWrapper>
    );
  };

  return (
    <motion.div 
      className="space-y-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* En-tête */}
      <motion.div variants={itemVariants} className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-foreground flex items-center gap-2">
            <Activity className="text-primary" />
            Tableau de bord
          </h1>
          <p className="text-sm text-muted-foreground">Suivez vos performances et identifiez vos axes d'amélioration</p>
        </div>
        
        {/* Bouton mode nuit */}
        <Button
          onClick={toggleDarkMode}
          variant="outline"
          size="icon"
          className="transition-all duration-300 hover:scale-105"
          aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* KPIs */}
      <motion.section 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={<Clock className="text-primary" size={24} />}
          label="Temps hebdomadaire"
          value="14h 30min"
          trend={{ value: 12, isUp: true }}
          color="text-primary"
          onClick={() => setComparisonMetric("time")}
        />
        <StatCard
          icon={<CheckCircle className="text-purple-500" size={24} />}
          label="QCM cette semaine"
          value={weeklyQcm.toString()}
          trend={{ value: 8, isUp: true }}
          color="text-purple-500"
          onClick={() => setComparisonMetric("weeklyQcm")}
        />
        <StatCard
          icon={<BarChart3Icon className="text-accent" size={24} />}
          label="Total QCM faits"
          value={totalQcm.toString()}
          color="text-accent"
          onClick={() => setComparisonMetric("totalQcm")}
        />
        <StatCard
          icon={<TrendingUp className="text-success" size={24} />}
          label="Progression"
          value={`${progressPercent}%`}
          trend={{ value: 5, isUp: true }}
          color="text-success"
        />
      </motion.section>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Évolution hebdomadaire */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="overflow-hidden relative border-2 hover:border-primary/50 transition-all duration-300 h-full">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/12 via-accent/6 to-transparent opacity-70 pointer-events-none z-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Pulse effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 pointer-events-none z-0"
              whileHover={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.12) 0%, rgba(255, 143, 0, 0.03) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-primary" size={20} />
                Activité hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 relative">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={weeklyProgressData} id="area-chart-weekly">
                  <defs key="defs">
                    <linearGradient id="colorQcmWeekly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme === "dark" ? "#60a5fa" : "#4f7cff"} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={theme === "dark" ? "#60a5fa" : "#4f7cff"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    key="xaxis"
                    dataKey="day" 
                    stroke={theme === "dark" ? "#94a3b8" : "#64748b"}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    key="yaxis"
                    stroke={theme === "dark" ? "#94a3b8" : "#64748b"}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    key="tooltip"
                    contentStyle={{ 
                      backgroundColor: theme === "dark" ? "#334155" : "#ffffff",
                      borderColor: theme === "dark" ? "#475569" : "#e2e8f0",
                      borderRadius: "8px"
                    }}
                  />
                  <Area
                    key="area"
                    type="monotone" 
                    dataKey="qcm" 
                    stroke={theme === "dark" ? "#60a5fa" : "#4f7cff"}
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorQcmWeekly)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Répartition des QCM par spécialité (semaine) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.003, y: -1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="overflow-hidden relative border-2 hover:border-success/50 transition-all duration-300 h-full">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-success/12 via-accent/6 to-transparent opacity-70 pointer-events-none z-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Pulse effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-success/0 to-accent/0 pointer-events-none z-0"
              whileHover={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.12) 0%, rgba(255, 143, 0, 0.03) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            <CardHeader className="relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-success" size={20} />
                  QCM répartis par spécialité
                </CardTitle>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7j">7 jours</SelectItem>
                    <SelectItem value="15j">15 jours</SelectItem>
                    <SelectItem value="30j">30 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-6 relative">
              <EnhancedDonutChart data={donutData} theme={theme} />

            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Score QE - Top Cours */}
      <TopCoursesSection
        sortedCourses={sortedCourses}
        displayCount={displayCount}
        setDisplayCount={setDisplayCount}
        filterType={filterType}
        setFilterType={setFilterType}
        expandedCourseId={expandedCourseId}
        setExpandedCourseId={setExpandedCourseId}
        theme={theme}
        getHistoryForCourse={getHistoryForCourse}
        getPercentageColor={getPercentageColor}
        itemVariants={itemVariants}
        query={query}
        setQuery={setQuery}
      />

      {/* Statistiques QCM et Radar */}
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
        theme={theme}
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

      {/* Course Detail Dialog */}
      <CourseDetailDialog />
    </motion.div>
  );
}

// Top Courses Section Component
function TopCoursesSection({
  sortedCourses, displayCount, setDisplayCount, filterType, setFilterType,
  expandedCourseId, setExpandedCourseId, theme, getHistoryForCourse,
  getPercentageColor, itemVariants, query, setQuery
}: any) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.005, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="relative border-0 overflow-hidden" style={{
        background: theme === "dark" 
          ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: theme === "dark"
          ? "0 4px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(79,124,255,0.15)"
          : "0 4px 32px rgba(79,124,255,0.08), 0 0 0 1px rgba(226,232,240,1)"
      }}>
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: filterType === "toRedo"
              ? (theme === "dark" 
                  ? "linear-gradient(90deg, #ef4444, #f97316)" 
                  : "linear-gradient(90deg, #dc2626, #ff8f00)")
              : (theme === "dark"
                  ? "linear-gradient(90deg, #22c55e, #60a5fa)"
                  : "linear-gradient(90deg, #059669, #4f7cff)")
          }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <CardHeader className="relative pb-2">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative flex-shrink-0"
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                transition={{ duration: 0.4 }}
                role="img"
                aria-label={filterType === "toRedo" ? "Indicateur de révision nécessaire" : "Indicateur de réussite"}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{
                  background: filterType === "toRedo"
                    ? (theme === "dark"
                        ? "linear-gradient(135deg, #ef4444, #f97316)"
                        : "linear-gradient(135deg, #dc2626, #ff8f00)")
                    : (theme === "dark"
                        ? "linear-gradient(135deg, #22c55e, #60a5fa)"
                        : "linear-gradient(135deg, #059669, #4f7cff)"),
                  boxShadow: filterType === "toRedo"
                    ? (theme === "dark"
                        ? "0 4px 16px rgba(239,68,68,0.4)"
                        : "0 4px 16px rgba(220,38,38,0.3)")
                    : (theme === "dark"
                        ? "0 4px 16px rgba(34,197,94,0.4)"
                        : "0 4px 16px rgba(5,150,105,0.3)")
                }}>
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                  <motion.div
                    className="relative z-10"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {filterType === "toRedo" 
                      ? <AlertCircle size={32} style={{ color: "rgba(255,255,255,0.95)", strokeWidth: 2.5 }} /> 
                      : <Target size={32} style={{ color: "rgba(255,255,255,0.95)", strokeWidth: 2.5 }} />
                    }
                  </motion.div>
                </div>
              </motion.div>

              <div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "17px", fontWeight: 700, color: isDarkMode ? "#f1f5f9" : "#1e293b" }}>
                    Score QE®
                  </span>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    {filterType === "toRedo" 
                      ? <Flame size={20} style={{ color: isDarkMode ? "#f97316" : "#ff8f00" }} /> 
                      : <Trophy size={20} style={{ color: isDarkMode ? "#22c55e" : "#059669" }} />
                    }
                  </motion.div>
                </div>
                
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <motion.div 
                className="relative w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-[280px]"
                whileHover={{ scale: 1.005 }}
              >
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: isDarkMode ? "#64748b" : "#94a3b8" }} />
                <Input
                  type="text"
                  placeholder="Rechercher un cours..."
                  className="pl-9 pr-3 py-1.5"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    borderRadius: "12px",
                    border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
                    background: isDarkMode ? "#0f172a" : "#f8fafc",
                    fontSize: "13px"
                  }}
                />
              </motion.div>

              <div className="flex rounded-xl overflow-hidden" style={{
                border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
                background: isDarkMode ? "#0f172a" : "#f8fafc"
              }}>
                {([5, 10, 15] as const).map((count) => (
                  <motion.button
                    key={count}
                    onClick={() => setDisplayCount(count)}
                    className="px-3 py-1.5 transition-all relative"
                    style={{
                      fontSize: "13px",
                      fontWeight: displayCount === count ? 600 : 400,
                      color: displayCount === count ? "#fff" : (isDarkMode ? "#94a3b8" : "#64748b"),
                      background: displayCount === count ? (isDarkMode ? "#60a5fa" : "#4f7cff") : "rgba(79,124,255,0)",
                      borderRight: count !== 15 ? `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}` : "none",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {count}
                  </motion.button>
                ))}
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[160px]" style={{
                  borderRadius: "12px",
                  border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
                  background: isDarkMode ? "#0f172a" : "#f8fafc"
                }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toRedo">
                    <span className="flex items-center gap-2"><RotateCcw size={14} /> À refaire</span>
                  </SelectItem>
                  <SelectItem value="mastery">
                    <span className="flex items-center gap-2"><Trophy size={14} /> Mieux maîtrisés</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative pt-0">
          <div className="flex items-center px-4 py-2 mb-1" style={{
            borderBottom: `1px solid ${isDarkMode ? "#1e293b" : "#f1f5f9"}`
          }}>
            <span style={{ width: "36px", fontSize: "11px", fontWeight: 500, color: isDarkMode ? "#475569" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>#</span>
            <span className="flex-1" style={{ fontSize: "11px", fontWeight: 500, color: isDarkMode ? "#475569" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cours</span>
            <span className="hidden sm:block" style={{ width: "80px", fontSize: "11px", fontWeight: 500, color: isDarkMode ? "#475569" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>QCM</span>
            <span style={{ width: "140px", fontSize: "11px", fontWeight: 500, color: isDarkMode ? "#475569" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>
              {filterType === "toRedo" ? "À refaire" : "Maîtrise"}
            </span>
            <span style={{ width: "32px" }} />
          </div>

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
                    isDark={isDarkMode}
                    history={history}
                    average={average}
                    radarData={[]}
                    getPercentageColor={getPercentageColor}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          <motion.div 
            className="mt-4 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: `1px solid ${theme === "dark" ? "#1e293b" : "#f1f5f9"}` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <span style={{ fontSize: "13px", color: theme === "dark" ? "#64748b" : "#94a3b8" }}>
                {sortedCourses.length} cours au total · Affichés: {Math.min(displayCount, sortedCourses.length)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { 
                  color: theme === "dark" ? "#ef4444" : "#dc2626", 
                  label: "Critique" 
                },
                { 
                  color: theme === "dark" ? "#f97316" : "#ff8f00", 
                  label: "Moyen" 
                },
                { 
                  color: theme === "dark" ? "#22c55e" : "#059669", 
                  label: "Bon" 
                }
              ].map(item => (
                <span key={item.label} className="flex items-center gap-1.5" style={{ fontSize: "12px" }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span style={{ color: theme === "dark" ? "#94a3b8" : "#64748b" }}>{item.label}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Stats and Radar Section Component
function StatsAndRadarSection({
  successPercentage, qcmStats, radarData, radarTitle, selectedSpec,
  setSelectedSpec, selectedCourseForRadar, setSelectedCourseForRadar,
  isSpec, coursesForSubFilter, theme, itemVariants
}: any) {
  return (
    <div className="space-y-4">
      {/* Statistiques QCM - Full Width */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.005, y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/12 via-success/6 to-transparent opacity-70 pointer-events-none z-0"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: '200% 200%' }}
          />
          
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/0 to-success/0 pointer-events-none z-0"
            whileHover={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.15) 0%, rgba(5, 150, 105, 0) 70%)',
                'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.20) 0%, rgba(5, 150, 105, 0.05) 70%)',
                'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.15) 0%, rgba(5, 150, 105, 0) 70%)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="text-primary" size={20} />
              Statistiques QCM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <CircularProgress 
                  value={successPercentage} 
                  size={180} 
                  strokeWidth={16}
                  label="Précision globale"
                  isDark={isDarkMode}
                />
              </div>
              
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <CheckCircle className="text-primary" size={16} />, label: "Complétés", value: qcmStats.completed, total: qcmStats.totalQcm, color: "primary" },
                    { icon: <ListChecks className="text-success" size={16} />, label: "Séries", value: qcmStats.seriesCompleted, total: qcmStats.totalSeries, color: "success" },
                    { icon: <TrendingUp className="text-success" size={16} />, label: "Meilleur", text: qcmStats.bestObjective, value: qcmStats.bestObjectivePercent, color: "success", percent: true },
                    { icon: <TrendingDown className="text-destructive" size={16} />, label: "À améliorer", text: qcmStats.worstObjective, value: qcmStats.worstObjectivePercent, color: "destructive", percent: true }
                  ].map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className={`bg-gradient-to-br from-${stat.color}/10 to-transparent border-${stat.color}/30 relative overflow-hidden`}>
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/5 to-transparent`}
                          animate={{ opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <CardContent className="p-4 relative">
                          <div className="flex items-center gap-2 mb-2">
                            {stat.icon}
                            <span className="text-sm text-muted-foreground">{stat.label}</span>
                          </div>
                          {stat.text && <p className="text-sm truncate">{stat.text}</p>}
                          <p className={`text-xl text-${stat.color}`}>
                            {stat.percent ? (
                              <><AnimatedCounter value={stat.value} />%</>
                            ) : (
                              <><AnimatedCounter value={stat.value} /> / {stat.total}</>
                            )}
                          </p>
                          {!stat.percent && stat.total && (
                            <Progress value={(stat.value / stat.total) * 100} className="mt-2 h-1" />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Maîtrise Row: Full width */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.005, y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative border-2 hover:border-accent/50 transition-all duration-300 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent opacity-70 pointer-events-none z-0"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: '200% 200%' }}
          />

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
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="J1">J1</SelectItem>
                    <SelectItem value="J2">J2</SelectItem>
                    <SelectItem value="Cardiologie-CCV">Cardiologie-CCV</SelectItem>
                    <SelectItem value="Gynécologie">Gynécologie</SelectItem>
                    <SelectItem value="Psychiatrie">Psychiatrie</SelectItem>
                    <SelectItem value="Chirurgie générale">Chirurgie générale</SelectItem>
                    <SelectItem value="Gastro-entérologie">Gastro-entérologie</SelectItem>
                    <SelectItem value="Neurologie">Neurologie</SelectItem>
                    <SelectItem value="ORL/Ophtalmologie">ORL/Ophtalmologie</SelectItem>
                    <SelectItem value="Pneumologie">Pneumologie</SelectItem>
                    <SelectItem value="Cancérologie">Cancérologie</SelectItem>
                    <SelectItem value="Néphrologie">Néphrologie</SelectItem>
                    <SelectItem value="Infectiologie">Infectiologie</SelectItem>
                    <SelectItem value="Hématologie">Hématologie</SelectItem>
                    <SelectItem value="Endocrinologie">Endocrinologie</SelectItem>
                    <SelectItem value="Rhumatologie">Rhumatologie</SelectItem>
                  </SelectContent>
                </Select>
                {!isSpec && coursesForSubFilter.length > 0 && (
                  <Select value={selectedCourseForRadar} onValueChange={setSelectedCourseForRadar}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue placeholder="Cours" />
                    </SelectTrigger>
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
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData} id="radar-chart-main">
                  <PolarGrid key="grid" stroke={theme === "dark" ? "#475569" : "#d1d5db"} />
                  <PolarAngleAxis
                    key="angle"
                    dataKey="tag" 
                    tick={{ fill: theme === "dark" ? "#f8fafc" : "#1e293b", fontSize: 12 }} 
                  />
                  <PolarRadiusAxis key="radius" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Radar
                    key="radar"
                    name="Maîtrise" 
                    dataKey="mastery" 
                    stroke={theme === "dark" ? "#60a5fa" : "#4f7cff"}
                    fill={theme === "dark" ? "#60a5fa" : "#4f7cff"}
                    fillOpacity={0.6} 
                  />
                  <Tooltip key="tooltip" formatter={(v) => `${v}%`} contentStyle={{ 
                    backgroundColor: theme === "dark" ? "#334155" : "#ffffff",
                    borderColor: theme === "dark" ? "#475569" : "#e2e8f0",
                    borderRadius: "8px"
                  }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
