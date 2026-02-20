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

const RocketIllustration = ({ activePart, onHoverPart }: { activePart?: string | null, onHoverPart?: (part: string | null) => void }) => (
  <svg width="100%" height="100%" viewBox="0 0 200 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float drop-shadow-[0_0_40px_rgba(59,130,246,0.2)]">
    {/* Flame */}
    <path 
      d="M100 320 Q 70 400 100 450 Q 130 400 100 320" 
      fill="url(#flameGradient)" 
      className="animate-exhaust" 
    />
    
    {/* Fins */}
    <path 
      d="M60 220 L 10 300 L 60 280 Z" 
      fill={activePart === 'structure' ? '#3B82F6' : '#EF4444'} 
      className="transition-colors duration-300 cursor-help"
      onMouseEnter={() => onHoverPart?.('structure')}
      onMouseLeave={() => onHoverPart?.(null)}
    />
    <path 
      d="M140 220 L 190 300 L 140 280 Z" 
      fill={activePart === 'structure' ? '#3B82F6' : '#DC2626'} 
      className="transition-colors duration-300 cursor-help"
      onMouseEnter={() => onHoverPart?.('structure')}
      onMouseLeave={() => onHoverPart?.(null)}
    />
    <path 
      d="M95 250 L 100 300 L 105 250 Z" 
      fill="#B91C1C" 
    />

    {/* Main Body */}
    <path 
      d="M100 40 C 100 40, 60 140, 60 270 L 140 270 C 140 140, 100 40, 100 40 Z" 
      fill={activePart === 'structure' ? '#F8FAFC' : '#E2E8F0'} 
      className="transition-colors duration-300 cursor-help"
      onMouseEnter={() => onHoverPart?.('structure')}
      onMouseLeave={() => onHoverPart?.(null)}
    />
    <path 
      d="M100 40 C 100 40, 100 140, 100 270 L 140 270 C 140 140, 100 40, 100 40 Z" 
      fill={activePart === 'structure' ? '#F1F5F9' : '#CBD5E1'} 
      className="transition-colors duration-300 cursor-help"
      onMouseEnter={() => onHoverPart?.('structure')}
      onMouseLeave={() => onHoverPart?.(null)}
    />

    {/* Window / Payload Area */}
    <circle 
      cx="100" cy="140" r="24" 
      fill="#0F172A" 
      className="cursor-help"
      onMouseEnter={() => onHoverPart?.('payload')}
      onMouseLeave={() => onHoverPart?.(null)}
    />
    <circle 
      cx="100" cy="140" r="18" 
      fill={activePart === 'payload' ? '#3B82F6' : '#1E293B'} 
      stroke="#38BDF8" 
      strokeWidth="3" 
      className="transition-colors duration-300"
    />
    <circle cx="94" cy="134" r="6" fill="#38BDF8" opacity="0.4" />

    {/* Electronics Section */}
    <rect 
      x="75" y="200" width="50" height="40" rx="4" 
      fill={activePart === 'electronics' ? '#3B82F6' : '#64748B'} 
      className="transition-colors duration-300 cursor-help"
      onMouseEnter={() => onHoverPart?.('electronics')}
      onMouseLeave={() => onHoverPart?.(null)}
    />
    <path d="M80 210 H 120 M 80 220 H 120 M 80 230 H 120" stroke="#1E293B" strokeWidth="1" opacity="0.5" />

    {/* Engine Nozzle */}
    <path 
      d="M80 270 L 120 270 L 110 310 L 90 310 Z" 
      fill={activePart === 'propulsion' ? '#3B82F6' : '#334155'} 
      className="transition-colors duration-300 cursor-help"
      onMouseEnter={() => onHoverPart?.('propulsion')}
      onMouseLeave={() => onHoverPart?.(null)}
    />

    <defs>
      <linearGradient id="flameGradient" x1="100" y1="320" x2="100" y2="450" gradientUnits="userSpaceOnUse">
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
  const [activePart, setActivePart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/donation-progress');
        if (res.ok) {
          const data = await res.json();
          setDonationData(data);
        } else {
          throw new Error('API response not ok');
        }
      } catch (err) {
        console.error("Failed to fetch donation data, using fallback", err);
        // Fallback data if API fails
        setDonationData({
          collected: 150,
          minGoal: 550,
          optGoal: 1625,
          daysLeft: 30,
          donors: 4,
          lastUpdated: new Date().toLocaleTimeString('fr-FR')
        });
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const animatedCollected = useCounter(donationData?.collected || 0, 2500, !!donationData);

  return (
    <div ref={containerRef} className="relative font-sans bg-[#020408] selection:bg-blue-500/30 scanline-container">
      <ScrollProgress />
      
      {/* Background Grid & Nebula */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <motion.div 
          animate={{ 
            x: (mousePos.x - window.innerWidth / 2) * 0.05,
            y: (mousePos.y - window.innerHeight / 2) * 0.05
          }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] nebula-glow opacity-30"
        />
        <motion.div 
          animate={{ 
            x: (mousePos.x - window.innerWidth / 2) * -0.03,
            y: (mousePos.y - window.innerHeight / 2) * -0.03
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] nebula-glow opacity-20"
        />
        {/* Mouse Follow Glow */}
        <motion.div 
          animate={{ 
            x: mousePos.x - 200,
            y: mousePos.y - 200
          }}
          className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"
        />
        <StarsBackground />
      </div>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6">
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
              <span className="font-mono tracking-tighter uppercase">Status: Ready for Ignition</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter mb-8 leading-[0.85]">
              <span className="text-gradient block">OBJECTIF</span>
              <span className="text-blue-400 italic blue-glow-text">ESPACE</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light mb-10 max-w-xl">
              Au Lycée Champollion de Figeac, 30 jeunes talents conçoivent le futur de l'ingénierie spatiale française.
            </p>

            {/* Mission Control Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-2xl">
              {[
                { label: "Altitude", val: "255m" },
                { label: "Vitesse", val: "300km/h" },
                { label: "Force G", val: "14g" },
                { label: "Équipes", val: "8" }
              ].map((stat, i) => (
                <div key={i} className="glass-panel p-4 text-center border-white/10">
                  <div className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-widest">{stat.label}</div>
                  <div className="text-lg font-mono text-blue-400">{stat.val}</div>
                </div>
              ))}
            </div>

            {/* Countdown */}
            <div className="mb-10">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <Zap size={12} className="text-blue-400" /> T-Minus to Launch
              </p>
              <div className="flex justify-center lg:justify-start space-x-3">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 glass-panel flex items-center justify-center text-2xl md:text-3xl font-bold text-white border-white/20">
                      {value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-slate-400 text-[10px] mt-2 uppercase tracking-widest font-bold">{timeTranslations[unit as keyof typeof timeTranslations]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <motion.a 
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(37, 99, 235, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                href={PROJECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-5 bg-blue-600 text-white font-black rounded-2xl overflow-hidden transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)]"
              >
                <span className="relative flex items-center justify-center gap-3">
                  PROPULSER LE PROJET <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.a>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: rocketY, scale: rocketScale }}
            className="flex-1 w-full max-w-md h-[500px] md:h-[700px] relative"
          >
            <RocketIllustration activePart={activePart} onHoverPart={setActivePart} />
            
            {/* Interactive Tooltips */}
            {activePart && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-1/2 left-full ml-8 glass-panel p-6 w-64 z-50 border-blue-500/40 shadow-blue-500/20"
              >
                <h4 className="text-blue-400 font-bold uppercase text-[10px] mb-3 tracking-[0.2em]">
                  {activePart === 'payload' && "Charge Utile (Mission Œufs)"}
                  {activePart === 'electronics' && "Systèmes Électroniques"}
                  {activePart === 'structure' && "Structure & Aérodynamique"}
                  {activePart === 'propulsion' && "Système de Propulsion"}
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-light">
                  {activePart === 'payload' && "Deux œufs de caille doivent survivre à 14g d'accélération. Un défi de protection thermique et mécanique."}
                  {activePart === 'electronics' && "Cartes CIEL conçues par nos BTS : télémétrie, caméras 4K et gestion du déploiement parachute."}
                  {activePart === 'structure' && "Corps en fibre de carbone et ailerons balsa, optimisés pour atteindre 300km/h sans vibration."}
                  {activePart === 'propulsion' && "Moteurs à poudre agréés CNES, délivrant une poussée massive pour atteindre 255m d'apogée."}
                </p>
              </motion.div>
            )}
          </motion.div>
        </header>

        {/* Qui sommes-nous Section */}
        <section className="py-20 relative">
          <div className="absolute top-0 right-0 w-64 h-64 nebula-glow opacity-10 -z-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">L'Humain au cœur du projet</span>
              </div>
              <h2 className="text-5xl font-bold mb-8 tracking-tighter leading-tight">
                Forger les <span className="text-blue-400">Génies</span> de demain à Figeac.
              </h2>
              <div className="space-y-6 text-lg text-slate-400 font-light leading-relaxed">
                <p>
                  Le projet est entièrement développé au <span className="text-white font-medium">lycée Champollion à Figeac (46)</span> par les élèves des classes de 2nde SI et CIT.
                </p>
                <p>
                  Plus qu'un simple exercice scolaire, c'est une immersion totale dans le monde de l'ingénierie. Dans notre <span className="text-white font-medium">Fab-Lab</span>, les élèves manipulent des technologies de pointe : impression 3D, découpe laser, et cuisson de composites haute performance.
                </p>
                <p>
                  C'est ici, dans le Lot, que nous prouvons que l'innovation n'a pas de frontières. Nous formons une jeunesse prête à relever les défis de l'espace et du futur de l'humanité.
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Futurs Ingénieurs", val: "30", icon: <Users size={20} /> },
                { label: "Fusées Uniques", val: "8", icon: <Rocket size={20} /> },
                { label: "Expertise BTS", val: "CIEL", icon: <Cpu size={20} /> },
                { label: "Territoire", val: "FIGEAC", icon: <Globe size={20} /> }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                  className="glass-panel p-8 text-center border-white/5 flex flex-col items-center gap-4"
                >
                  <div className="text-blue-400 bg-blue-500/10 p-3 rounded-xl">{item.icon}</div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1 font-mono">{item.val}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Anatomy / Pedagogical Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 tracking-tighter">Anatomie d'une <span className="text-blue-400">Mission</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
              Découvrez comment nos élèves transforment des concepts théoriques en une machine capable de fendre l'air à 300km/h.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Structure & Matériaux", 
                desc: "Utilisation de carbone, kevlar et balsa pour un rapport poids/résistance optimal.",
                details: "Cuisson en autoclave pour une rigidité maximale.",
                icon: <ShieldCheck className="text-blue-400" />
              },
              { 
                title: "Électronique de Bord", 
                desc: "Systèmes embarqués gérant la télémétrie et l'ouverture du parachute.",
                details: "Capteurs de pression, accéléromètres et caméras HD.",
                icon: <Cpu className="text-blue-400" />
              },
              { 
                title: "Récupération", 
                desc: "Système de parachute calculé pour une descente précise en 42 secondes.",
                details: "Ouverture automatique déclenchée à l'apogée.",
                icon: <Navigation className="text-blue-400" />
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-panel p-10 flex flex-col gap-6 border-white/5"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">{item.icon}</div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-auto pt-6 border-t border-white/5 text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                  {item.details}
                </div>
              </motion.div>
            ))}
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
          <div className="glass-panel p-12 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-blue-500/5 -z-10" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Navigation size={20} /></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">Mission Profile • Caylus 2026</span>
              </div>
              <h2 className="text-5xl font-bold mb-8 tracking-tighter leading-tight">Une Précision <br/><span className="text-blue-400 italic blue-glow-text">Chirurgicale.</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Altitude Cible", val: "255m", sub: "Précision requise" },
                  { label: "Vitesse Max", val: "300km/h", sub: "Mach 0.25 approx." },
                  { label: "Accélération", val: "14g", sub: "Décollage brutal" },
                  { label: "Temps de Vol", val: "42s", sub: "Descente contrôlée" }
                ].map((spec, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="text-2xl font-bold text-white mb-1">{spec.val}</div>
                    <div className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">{spec.label}</div>
                    <div className="text-[8px] text-slate-500 italic">{spec.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-8">
              <div className="glass-panel p-8 bg-blue-500/5 border-blue-500/20">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Le Défi Scientifique
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  "Nous ne nous contentons pas de lancer des objets. Nous prédisons des trajectoires, analysons des flux de données et dimensionnons des structures pour résister à des forces extrêmes. C'est l'essence même de l'ingénierie."
                </p>
              </div>
              <div className="flex items-center gap-6 p-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020408] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                      {i === 1 ? "INSA" : i === 2 ? "ENSAE" : "UPS"}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Partenariats avec les <br/>Grandes Écoles
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Tracker & Budget */}
        <section className="py-20">
          <div className="glass-panel p-12 relative overflow-hidden border-blue-500/10">
            <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12">
              <Rocket className="w-64 h-64" />
            </div>

            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 text-blue-400 mb-6 font-mono text-xs uppercase tracking-[0.3em]">
                <Heart size={14} className="animate-pulse" /> Investir dans le Futur
              </div>
              <h2 className="text-6xl font-bold mb-6 tracking-tighter leading-tight">Propulser l'Innovation <br/><span className="text-blue-400 italic">Territoriale.</span></h2>
              <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
                Chaque don est un moteur pour nos élèves. Nous démontrons qu'à Figeac, nous pouvons réaliser des projets scientifiques de classe mondiale.
              </p>
              
              {donationData ? (
                <div className="space-y-16 mb-20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {[
                      { label: "Collectés", val: `${animatedCollected}€`, color: "text-white" },
                      { label: "Donateurs", val: donationData.donors, color: "text-white" },
                      { label: "Jours Restants", val: donationData.daysLeft, color: "text-white" },
                      { label: "Défiscalisation", val: "66%", color: "text-blue-400" }
                    ].map((stat, i) => (
                      <div key={i} className="relative group">
                        <div className={`text-5xl font-bold tracking-tighter mb-2 ${stat.color}`}>{stat.val}</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-blue-400 transition-colors">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-8">
                    <div className="relative h-6 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                      <div 
                        className="absolute top-0 bottom-0 border-r-2 border-white/40 z-20"
                        style={{ left: `${(donationData.minGoal / donationData.optGoal) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Seuil Critique</div>
                      </div>
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, (donationData.collected / donationData.optGoal) * 100)}%` }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] relative"
                      >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                      </motion.div>
                    </div>
                    
                    <div className="relative flex justify-between items-start text-[10px] font-bold uppercase tracking-[0.2em] h-12">
                      <div className="text-slate-500">Base<br/>0€</div>
                      <div 
                        className="text-center text-white absolute"
                        style={{ 
                          left: `${(donationData.minGoal / donationData.optGoal) * 100}%`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <div className="w-px h-4 bg-white/20 mx-auto mb-2"></div>
                        Minimum<br/><span className="text-blue-400">{donationData.minGoal}€</span>
                      </div>
                      <div className="text-right text-blue-400">Optimum<br/>{donationData.optGoal}€</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center gap-6">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="font-mono text-xs uppercase tracking-[0.4em] text-blue-400 animate-pulse">Establishing Uplink...</span>
                </div>
              )}

              {/* Budget Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-16">
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-3 text-lg">
                    <Rocket className="w-5 h-5 text-blue-400" />
                    Phase 1: Structure (550€)
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Financement des matériaux composites, impression 3D haute précision et systèmes de fixation aéronautiques.
                  </p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-3 text-lg">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    Phase 2: Intelligence (1625€)
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Acquisition des caméras 4K embarquées, calculateurs de vol et capteurs environnementaux avancés.
                  </p>
                </motion.div>
              </div>

              {/* Detailed Budget List */}
              <div className="mb-20 glass-panel p-8 bg-white/[0.01] border-white/5">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-8 text-center">Répartition Analytique du Budget (3 066€)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-4">
                  {[
                    { label: "Systèmes Électroniques", val: "1 030€" },
                    { label: "Logistique & Transport", val: "530€" },
                    { label: "Structure & Matériaux", val: "530€" },
                    { label: "Équipements Équipes", val: "430€" },
                    { label: "Expertise Technique", val: "400€" },
                    { label: "Systèmes de Propulsion", val: "146€" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 group">
                      <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                      <span className="text-sm font-mono text-blue-400">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-8">
                <motion.a 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  href={PROJECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 font-black rounded-2xl transition-all flex items-center justify-center gap-4 text-lg"
                >
                  <Heart className="w-6 h-6 fill-blue-600 text-blue-600" />
                  SOUTENIR LA MISSION
                </motion.a>
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    Transaction Sécurisée • Défiscalisation Immédiate
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed font-light">
                      Votre don est déductible à hauteur de <span className="text-white font-medium">66%</span> (Particuliers) ou <span className="text-white font-medium">60%</span> (Entreprises).
                    </p>
                    <p className="text-[10px] text-slate-600 max-w-md mx-auto leading-tight italic">
                      Note fiscale : Pour les parents d'élèves, la déduction s'applique sur la part excédant la contribution obligatoire au voyage.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-24 pt-12 border-t border-white/5 text-center">
                <p className="text-sm text-slate-500 leading-relaxed italic font-light max-w-2xl mx-auto">
                  "À travers ce projet, nous démontrons l'excellence de notre territoire. Figeac n'est pas seulement une ville d'histoire, c'est un pôle d'avenir où la jeunesse ose défier les lois de la physique."
                </p>
                <div className="mt-8 flex justify-center gap-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                  <div className="text-[10px] font-bold border border-white px-3 py-1">FIGEAC</div>
                  <div className="text-[10px] font-bold border border-white px-3 py-1">FRANCE</div>
                  <div className="text-[10px] font-bold border border-white px-3 py-1">ESPACE</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 border-t border-white/5 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Navigation className="transform rotate-45" size={24} />
                </div>
                <div>
                  <div className="font-black text-xl tracking-tighter">CHAMPOLLION</div>
                  <div className="text-[10px] text-blue-400 uppercase tracking-[0.4em] font-bold">Aerospace Division</div>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                Le Lycée Champollion de Figeac s'engage pour l'excellence scientifique et l'épanouissement des futurs talents de l'ingénierie française.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Localisation</h5>
                <ul className="text-xs text-slate-500 space-y-3 font-light">
                  <li>Figeac, Lot (46)</li>
                  <li>Région Occitanie</li>
                  <li>France</li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Partenaires</h5>
                <ul className="text-xs text-slate-500 space-y-3 font-light">
                  <li>CNES Toulouse</li>
                  <li>Planète Sciences</li>
                  <li>Base de Caylus</li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Valeurs</h5>
                <ul className="text-xs text-slate-500 space-y-3 font-light">
                  <li>Pédagogie</li>
                  <li>Innovation</li>
                  <li>Territoire</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-24 flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
            <div className="text-[10px] text-slate-600 font-mono">
              COORD: 44.6081° N, 2.0341° E • ALT: 214M
            </div>
            <div className="text-[10px] text-slate-600">
              © 2026 Lycée Champollion - Figeac. Vitrine promotionnelle à but pédagogique.
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-white/20 rounded-full" />
              <div className="w-2 h-2 bg-red-500/40 rounded-full" />
            </div>
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
