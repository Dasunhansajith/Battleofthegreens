import React, { useState, useEffect } from 'react';
import jonLogo from './assests/Sir_john_logo_new1.png';
import royalLogo from './assests/royal.png';
import heroBg from './assests/photo1.jpg';

// Target: June 28, 2026 at 9:00 AM
const TARGET_DATE = new Date('2026-06-28T09:00:00');

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        done: false,
      };
    };

    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [target]);

  return timeLeft;
}

function CountdownBlock({ value, label }) {
  const display = String(value ?? 0).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Card glow */}
        <div className="absolute -inset-1 bg-gradient-to-br from-green-400/40 to-emerald-600/30 rounded-2xl blur-md" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 md:px-10 md:py-7 shadow-2xl">
          <span className="text-5xl md:text-7xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {display}
          </span>
        </div>
      </div>
      <span className="mt-3 text-xs md:text-sm uppercase tracking-[0.25em] text-white/70 font-semibold">
        {label}
      </span>
    </div>
  );
}

function App() {
  const time = useCountdown(TARGET_DATE);
  const [jonScore, setJonScore] = useState('0/0');
  const [royalScore, setRoyalScore] = useState('0/0');

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* ── Navigation ── */}
      <nav className="w-full px-6 py-1.5 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">

        {/* Left: Sir John Logo + Score */}
        <div className="flex items-center gap-3">
          <img
            src={jonLogo}
            alt="Sir John Logo"
            className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-none mb-0.5">Kothalawa</span>
            <span className="text-2xl md:text-3xl font-black text-slate-800 leading-none tabular-nums">
              {jonScore}
            </span>
          </div>
        </div>

        {/* Center Title */}
        <div className="flex flex-col items-center select-none">
          <h1 className="text-xl md:text-2xl font-black tracking-wider text-center leading-tight">
            <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 bg-clip-text text-transparent">
              Battle of the Greens
            </span>
            <span className="ml-2 text-yellow-500">2026</span>
          </h1>
        </div>

        {/* Right: Score + Royal Logo */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-none mb-0.5">Royal</span>
            <span className="text-2xl md:text-3xl font-black text-slate-800 leading-none tabular-nums">
              {royalScore}
            </span>
          </div>
          <img
            src={royalLogo}
            alt="Royal Logo"
            className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
      </nav>

      {/* ── Hero Countdown Section ── */}
      <main className="flex-1 relative flex items-center justify-center overflow-hidden">

        {/* Background Image */}
        <img
          src={heroBg}
          alt="Cricket Ground"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75" />

        {/* Green tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-900/40 via-transparent to-emerald-900/30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 py-20 gap-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-white/90 text-sm font-semibold tracking-widest uppercase shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            BATTLE OF THE GREENS
          </div>

          {/* Main heading */}
          <div className="space-y-3">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              The Match Begins In
            </h2>
            <p className="text-white/60 text-base md:text-lg tracking-widest uppercase">
              June 28, 2026 &nbsp;•&nbsp; 9:00 A.M.
            </p>
          </div>

          {/* Countdown Blocks */}
          {time.done ? (
            <div className="text-4xl md:text-6xl font-black text-green-400 animate-bounce drop-shadow-lg">
              🏏 The Match Has Started!
            </div>
          ) : (
            <div className="flex items-start gap-4 md:gap-6">
              <CountdownBlock value={time.days} label="Days" />
              <Colon />
              <CountdownBlock value={time.hours} label="Hours" />
              <Colon />
              <CountdownBlock value={time.minutes} label="Minutes" />
              <Colon />
              <CountdownBlock value={time.seconds} label="Seconds" />
            </div>
          )}

          {/* Venue / date strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm font-medium mt-2">
            <span>📅 &nbsp;Saturday, 28 June 2026</span>
            <span className="w-1 h-1 bg-white/30 rounded-full hidden md:block" />
            <span>🕘 &nbsp;9:00 AM</span>
            <span className="w-1 h-1 bg-white/30 rounded-full hidden md:block" />
            <span>🏟️ &nbsp;Welagedara Stadium</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex flex-col justify-center pb-10 text-white/50 text-4xl md:text-6xl font-black select-none leading-none">
      :
    </div>
  );
}

export default App;
