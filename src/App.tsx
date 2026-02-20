import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Target, 
  Zap, 
  Users, 
  ChevronDown, 
  Heart, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Globe,
  Sparkles,
  Flag,
  Rocket,
  Cpu,
  Navigation,
  CheckCircle2,
  Egg
} from 'lucide-react';

// --- CONFIGURATION ---
const PROJECT_URL = "https://trousseaprojets.fr/projet/20429-les-2ndes-si-cit-de-figeac-champollion-tirent-leurs-fusees";
const LAUNCH_DATE = "2026-04-11T10:00:00";

interface DonationData {
  collected: number;
  minGoal: number;
  optGoal: number;
  daysLeft: number;
  donors: number;
  lastUpdated: string;
}

// --- CUSTOM HOOKS ---

const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

function useCounter(end: number, duration = 2000, startAnimation = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startAnimation]);

  return count;
}

// --- COMPONENTS ---

const StarsBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(60)].map((_, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full animate-twinkle"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 4 + 2}s`
        }}
      />
    ))}
  </div>
);

const RocketIllustration = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
    <path d="M100 300 Q 70 380 100 430 Q 130 380 100 300" fill="url(#flameGradient)" className="animate-exhaust" />
    <path d="M100 50 C 100 50, 60 150, 60 250 L 140 250 C 140 150, 100 50, 100 50 Z" fill="#E2E8F0" />
    <path d="M100 50 C 100 50, 100 150, 100 250 L 140 250 C 140 150, 100 50, 100 50 Z" fill="#CBD5E1" />
    <circle cx="100" cy="150" r="22" fill="#0F172A" />
    <circle cx="100" cy="150" r="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="3" />
    <circle cx="95" cy="145" r="5" fill="#38BDF8" opacity="0.6" />
    <path d="M60 200 L 10 280 L 60 260 Z" fill="#EF4444" />
    <path d="M140 200 L 190 280 L 140 260 Z" fill="#DC2626" />
    <path d="M95 230 L 100 280 L 105 230 Z" fill="#B91C1C" />
    <rect x="75" y="250" width="50" height="20" rx="4" fill="#64748B" />
    <path d="M80 270 L 120 270 L 110 300 L 90 300 Z" fill="#334155" />
    <defs>
      <linearGradient id="flameGradient" x1="100" y1="300" x2="100" y2="430" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FCD34D" />
        <stop offset="0.4" stopColor="#F97316" />
        <stop offset="0.8" stopColor="#EF4444" />
        <stop offset="1" stopColor="#EF4444" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setProgress(scroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="h-full bg-gradient-to-r from-blue-400 to-purple-500 relative transition-all duration-100 ease-out" 
        style={{ width: `${progress * 100}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-blue-400">
          <Rocket size={16} className="transform rotate-45 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const timeLeft = useCountdown(LAUNCH_DATE);
  const timeTranslations = { days: 'Jours', hours: 'Heures', minutes: 'Minutes', seconds: 'Secondes' };

  // Parallax for rocket
  const rocketY = useTransform(scrollYProgress, [0, 1], ["0vh", "-100vh"]);
  const rocketScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/donation-progress');
        if (res.ok) {
          const data = await res.json();
          setDonationData(data);
        }
      } catch (err) {
        console.error("Failed to fetch donation data", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const animatedCollected = useCounter(donationData?.collected || 0, 2500, !!donationData);

  return (
    <div ref={containerRef} className="relative font-sans bg-[#020408] selection:bg-blue-500/30">
      <ScrollProgress />
      
      {/* Background Grid & Nebula */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] nebula-glow opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] nebula-glow opacity-20"></div>
        <StarsBackground />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <header className="min-h-screen flex flex-col lg:flex-row items-center justify-center py-20 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-full mb-8 font-medium text-xs animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Mission: Figeac → Espace</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
              <span className="text-gradient block">OBJECTIF</span>
              <span className="text-blue-400 italic">ESPACE</span>
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed font-light mb-10 max-w-xl">
              Les élèves de 2nde SI-CIT du Lycée Champollion conçoivent et lancent leurs propres fusées : une aventure pédagogique et scientifique au cœur du Lot.
            </p>

            {/* Countdown */}
            <div className="mb-10">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Lancement prévu dans :</p>
              <div className="flex justify-center lg:justify-start space-x-3">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 glass-panel flex items-center justify-center text-xl md:text-2xl font-bold text-white">
                      {value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-slate-500 text-[8px] mt-2 uppercase tracking-wider font-bold">{timeTranslations[unit as keyof typeof timeTranslations]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href={PROJECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                <span className="relative flex items-center justify-center gap-2">
                  SOUTENIR LE PROJET <Heart className="w-5 h-5" />
                </span>
              </a>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: rocketY, scale: rocketScale }}
            className="flex-1 w-full max-w-md h-[400px] md:h-[600px]"
          >
            <RocketIllustration />
          </motion.div>
        </header>

        {/* Qui sommes-nous Section */}
        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Qui <span className="text-blue-400">sommes-nous ?</span></h2>
              <div className="space-y-4 text-slate-400 font-light leading-relaxed">
                <p>
                  Le projet est entièrement développé au <span className="text-white font-medium">lycée Champollion à Figeac</span> par les élèves des classes de 2nde SI (Sciences de l'Ingénieur) et CIT (Création et innovation technologique).
                </p>
                <p>
                  Nous travaillons au sein d'un <span className="text-white font-medium">fab-lab d'excellence</span> équipé d'imprimantes 3D, de postes CAO, de découpe laser et d'autoclaves pour la cuisson des composites (carbone, kevlar, verre).
                </p>
                <p>
                  Cette année, 8 équipes de 4 élèves conçoivent chacune leur propre fusée. Les étudiants de <span className="text-white font-medium">BTS CIEL</span> nous épaulent pour la partie électronique embarquée.
                </p>
              </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">30</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Élèves de 2nde</div>
              </div>
              <div className="glass-panel p-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">8</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Fusées en vol</div>
              </div>
              <div className="glass-panel p-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">BTS</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Soutien Électronique</div>
              </div>
              <div className="glass-panel p-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">46</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Figeac, Lot</div>
              </div>
            </div>
          </div>
        </section>

        {/* Projet Pédagogique Bento */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Le Projet <span className="text-blue-400">Pédagogique</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">
              Né il y a 5 ans, ce projet fait passer la pédagogie des sciences au travers d'une structure matérielle concrète : le tir de fusées.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Scientifique", desc: "Prédiction des trajectoires et analyse des courbes de vol.", icon: <Globe className="w-6 h-6" /> },
              { title: "Technologique", desc: "Conception CAO et utilisation de matériaux composites.", icon: <Cpu className="w-6 h-6" /> },
              { title: "Physique", desc: "Étude des efforts lors du vol et dimensionnement.", icon: <Zap className="w-6 h-6" /> },
              { title: "Électronique", desc: "Programmation des cartes et caméras embarquées.", icon: <Sparkles className="w-6 h-6" /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="glass-panel p-8 flex flex-col items-center text-center"
              >
                <div className="text-blue-400 mb-4">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission Specs Section */}
        <section className="py-20">
          <div className="glass-panel p-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Objectif Caylus • 11 Avril 2026</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Une Mission de <br/><span className="text-blue-400">Haute Précision.</span></h2>
              <ul className="space-y-4 text-sm text-slate-400 font-light">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  Altitude cible : <span className="text-white font-medium">255 mètres</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  Vitesse max : <span className="text-white font-medium">300 km/h</span> (14g au décollage)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  Validation : <span className="text-white font-medium">41 points stratégiques</span> de contrôle
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  Charge utile : <span className="text-white font-medium">2 œufs de caille</span> intacts à l'arrivée
                </li>
              </ul>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-4">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-xs italic text-slate-400">
                  "Les tirs se font avec des étudiants d'IUT, d'écoles d'ingénieur (INSA, ENSTACA, ENSAE) et d'universités. C'est l'occasion d'échanges sur les métiers de l’ingénierie et de l'espace."
                </p>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Échanges & Orientation <br/>Post-Bac
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Tracker & Budget */}
        <section className="py-20">
          <div className="glass-panel p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Target className="w-48 h-48" />
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Pourquoi nous <span className="text-blue-400">soutenir ?</span></h2>
              <p className="text-slate-400 mb-12 max-w-xl mx-auto font-light">
                Le coût total du projet s'élève à <span className="text-white font-medium">3 066 €</span>. Votre contribution directe permet d'acquérir le matériel critique.
              </p>
              
              {donationData ? (
                <div className="space-y-12 mb-16">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    <div>
                      <div className="text-4xl font-bold text-white tracking-tighter">{animatedCollected}€</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Collectés</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-white tracking-tighter">{donationData.donors}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Donateurs</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-white tracking-tighter">{donationData.daysLeft}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Jours</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-blue-400 tracking-tighter">66%</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Déduction</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="absolute top-0 bottom-0 border-r-2 border-white/30 z-10"
                        style={{ left: `${(donationData.minGoal / donationData.optGoal) * 100}%` }}
                      ></div>
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, (donationData.collected / donationData.optGoal) * 100)}%` }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                      />
                    </div>
                    
                    <div className="relative flex justify-between items-start text-[10px] font-bold uppercase tracking-widest h-10">
                      <div className="text-slate-500">Départ<br/>0€</div>
                      <div 
                        className="text-center text-white absolute"
                        style={{ 
                          left: `${(donationData.minGoal / donationData.optGoal) * 100}%`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <div className="w-px h-2 bg-white/20 mx-auto mb-1"></div>
                        Minimum<br/>{donationData.minGoal}€
                      </div>
                      <div className="text-right text-blue-400">Optimum<br/>{donationData.optGoal}€</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex items-center justify-center gap-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-500">Sync...</span>
                </div>
              )}

              {/* Budget Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-12">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-blue-400" />
                    Objectif Minimum (550€)
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Permet d'acquérir le matériel propre à la fusée : corps, matériel d'impression 3D, fixations et isolants.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    Objectif Optimum (1625€)
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Permet d'acquérir le matériel électronique le plus onéreux : caméras, cartes de vol, composants et capteurs.
                  </p>
                </div>
              </div>

              {/* Detailed Budget List */}
              <div className="mb-12 text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Répartition du budget total (3 066€)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
                  {[
                    { label: "Matériel électronique", val: "1 030€" },
                    { label: "Transport (Caylus)", val: "530€" },
                    { label: "Matériel fusée", val: "530€" },
                    { label: "T-shirts nominatifs", val: "430€" },
                    { label: "Prestation Planète Sciences", val: "400€" },
                    { label: "Propulseurs", val: "146€" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <span className="text-xs font-mono text-white">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <a 
                  href={PROJECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 font-black rounded-2xl transition-all hover:bg-blue-400 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  FAIRE UN DON
                </a>
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <ShieldCheck className="w-4 h-4" />
                    Don sécurisé & défiscalisé
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] text-slate-600 max-w-md mx-auto leading-tight">
                      66% du don est déductible de l'impôt sur le revenu (particuliers) ou 60% de l'impôt sur les sociétés (entreprises).
                    </p>
                    <p className="text-[8px] text-slate-700 max-w-sm mx-auto leading-tight italic">
                      Note : Si vous appartenez au même foyer fiscal qu’un élève bénéficiaire, la défiscalisation s'applique uniquement si le don s'ajoute à votre contribution obligatoire.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 pt-8 border-t border-white/5 text-left">
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  "Grâce à vous, nous démontrons qu'il est possible de réaliser un projet scientifique novateur et ancré dans notre territoire. Nous sommes le seul lycée d'Occitanie à tirer des fusées dans ce cadre pédagogique."
                </p>
                <p className="text-[8px] text-slate-600 mt-4">
                  Contenu élaboré sous la responsabilité du porteur de projet et de ses élèves. Texte original protégé par le droit d'auteur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <Navigation className="text-blue-400 transform rotate-45" size={24} />
              <div>
                <div className="font-bold text-sm tracking-tight">Lycée Champollion</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Figeac, France</div>
              </div>
            </div>
            <div className="flex gap-6 opacity-30 grayscale text-[8px] font-bold uppercase tracking-widest">
              <span>CNES</span>
              <span>Planète Sciences</span>
              <span>Occitanie</span>
            </div>
          </div>
          <div className="mt-12 text-center text-[10px] text-slate-600">
            © 2026 Lycée Champollion - Figeac. Vitrine promotionnelle pédagogique.
          </div>
        </footer>
      </main>

      {/* Floating Action */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] hidden sm:block"
      >
        <div className="glass-panel px-6 py-3 flex items-center gap-4 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
              Live : {donationData?.lastUpdated || "Sync..."}
            </span>
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {donationData?.collected || 0}€ récoltés
          </span>
          <div className="w-px h-4 bg-white/10"></div>
          <a 
            href={PROJECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors flex items-center gap-1"
          >
            Soutenir <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
