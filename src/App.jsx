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
        <div className="absolute -inset-1 bg-gradient-to-br from-green-400/40 to-emerald-600/30 rounded-xl blur-md" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-3 sm:px-6 sm:py-5 md:px-8 md:py-6 shadow-2xl">
          <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {display}
          </span>
        </div>
      </div>
      <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 font-semibold">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex flex-col justify-center pb-6 sm:pb-8 text-white/40 text-2xl sm:text-4xl font-black select-none leading-none">
      :
    </div>
  );
}

function App() {
  const time = useCountdown(TARGET_DATE);

  // --- Live Scorecard State ---
  const [tournamentName, setTournamentName] = useState("BATTLE OF THE GREENS");
  const [matchTitle, setMatchTitle] = useState("Annual Cricket Encounter");
  const [venue, setVenue] = useState("Welagedara Stadium");
  const [matchStatus, setMatchStatus] = useState("LIVE"); // LIVE, INNINGS BREAK, COMPLETED, RAIN DELAY, UPCOMING
  const [tossResult, setTossResult] = useState("Royal won the toss & elected to bowl");

  const [battingTeam, setBattingTeam] = useState("Kothalawa"); // Kothalawa or Royal
  const [currentInnings, setCurrentInnings] = useState(1);
  const [targetScore, setTargetScore] = useState(165);
  const [partnership, setPartnership] = useState(42);

  // Scores
  const [kothalawaRuns, setKothalawaRuns] = useState(137);
  const [kothalawaWickets, setKothalawaWickets] = useState(3);
  const [kothalawaOvers, setKothalawaOvers] = useState(15);
  const [kothalawaBalls, setKothalawaBalls] = useState(4); // 15.4 overs

  const [royalRuns, setRoyalRuns] = useState(120);
  const [royalWickets, setRoyalWickets] = useState(6);
  const [royalOvers, setRoyalOvers] = useState(17);
  const [royalBalls, setRoyalBalls] = useState(5); // 17.5 overs

  // Batsmen
  const [batsman1, setBatsman1] = useState({
    name: "K. Bandara", runs: 54, balls: 38, fours: 4, sixes: 2, isStriker: true
  });
  const [batsman2, setBatsman2] = useState({
    name: "M. Senanayake", runs: 28, balls: 19, fours: 3, sixes: 0, isStriker: false
  });

  // Bowler
  const [bowler, setBowler] = useState({
    name: "R. Madushanka", overs: "3.4", runs: 32, wickets: 2
  });

  // Recent Balls
  const [recentBallsString, setRecentBallsString] = useState("1, 4, W, 0, 2, 6");
  const [lastEvent, setLastEvent] = useState("Boundary! Beautiful boundary through cover.");

  // Modal / Admin controls
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const formatScore = (runs, wickets) => {
    return `${runs}/${wickets}`;
  };

  const jonScore = formatScore(kothalawaRuns, kothalawaWickets);
  const royalScore = formatScore(royalRuns, royalWickets);

  const getActiveScoreDetails = () => {
    if (battingTeam === "Kothalawa") {
      return {
        runs: kothalawaRuns,
        wickets: kothalawaWickets,
        overs: kothalawaOvers,
        balls: kothalawaBalls,
        name: "Kothalawa",
        logo: jonLogo
      };
    } else {
      return {
        runs: royalRuns,
        wickets: royalWickets,
        overs: royalOvers,
        balls: royalBalls,
        name: "Royal",
        logo: royalLogo
      };
    }
  };

  const active = getActiveScoreDetails();
  const currentOversDecimal = parseFloat(`${active.overs}.${active.balls}`);
  const totalBallsBowled = (active.overs * 6) + active.balls;
  const currentRunRate = totalBallsBowled > 0 ? ((active.runs / totalBallsBowled) * 6).toFixed(2) : "0.00";

  // Target calculations (50 Overs match)
  const maxOvers = 50;
  const totalInningsBalls = maxOvers * 6;
  const ballsRemaining = Math.max(0, totalInningsBalls - totalBallsBowled);
  const runsNeeded = targetScore - active.runs;
  const requiredRunRate = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : "0.00";

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === "137331") {
      setShowAuthModal(false);
      setShowAdminPanel(true);
      setAuthError("");
      setPasswordInput("");
    } else {
      setAuthError("Wrong Password");
    }
  };

  const recentBallsList = recentBallsString.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">

      {/* ── Navigation ── */}
      <nav className="w-full px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">

        {/* Left: Logo + Score */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <img
            src={jonLogo}
            alt="Kothalawa Logo"
            className="h-9 sm:h-12 w-auto object-contain flex-shrink-0"
          />
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-none mb-0.5 truncate">
              Kothalawa
            </span>
            <span className="text-lg sm:text-2xl md:text-3xl font-black text-slate-800 leading-none tabular-nums">
              {jonScore}
            </span>
          </div>
        </div>

        {/* Center Title */}
        <div className="flex flex-col items-center select-none px-1 sm:px-4 text-center flex-shrink-0">
          <h1 className="text-xs sm:text-base md:text-xl lg:text-2xl font-black tracking-tight sm:tracking-wider leading-tight whitespace-nowrap">
            <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 bg-clip-text text-transparent">
              Battle of the Greens
            </span>
            <span className="ml-1 sm:ml-2 text-yellow-500">2026</span>
          </h1>
        </div>

        {/* Right: Score + Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <div className="flex flex-col items-end min-w-0">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-none mb-0.5 truncate">
              Royal
            </span>
            <span className="text-lg sm:text-2xl md:text-3xl font-black text-slate-800 leading-none tabular-nums">
              {royalScore}
            </span>
          </div>
          <img
            src={royalLogo}
            alt="Royal Logo"
            className="h-9 sm:h-12 w-auto object-contain flex-shrink-0"
          />
        </div>
      </nav>

      {/* ── Hero Countdown Section ── */}
      <main className="relative flex items-center justify-center overflow-hidden min-h-[calc(100vh-56px)]">

        {/* Background Image */}
        <img
          src={heroBg}
          alt="Cricket Ground"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75" />

        {/* Green tint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-900/40 via-transparent to-emerald-900/30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 py-12 sm:py-20 gap-6 sm:gap-10 w-full max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 text-white/90 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block flex-shrink-0" />
            BATTLE OF THE GREENS
          </div>

          {/* Main heading */}
          <div className="space-y-2 sm:space-y-3 px-2">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              The Match Begins In
            </h2>
            <p className="text-white/60 text-sm sm:text-base md:text-lg tracking-widest uppercase">
              June 28, 2026 &nbsp;•&nbsp; 9:00 A.M.
            </p>
          </div>

          {/* Countdown Blocks */}
          {time.done ? (
            <div className="text-2xl sm:text-4xl md:text-6xl font-black text-green-400 animate-bounce drop-shadow-lg">
              🏏 The Match Has Started!
            </div>
          ) : (
            <div className="flex items-start gap-2 sm:gap-4 md:gap-6">
              <CountdownBlock value={time.days} label="Days" />
              <Colon />
              <CountdownBlock value={time.hours} label="Hours" />
              <Colon />
              <CountdownBlock value={time.minutes} label="Minutes" />
              <Colon />
              <CountdownBlock value={time.seconds} label="Seconds" />
            </div>
          )}

          {/* Venue strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/70 text-xs sm:text-sm font-medium mt-1">
            <span>📅 &nbsp;Saturday, 28 June 2026</span>
            <span className="w-1 h-1 bg-white/30 rounded-full hidden sm:block" />
            <span>🕘 &nbsp;9:00 AM</span>
            <span className="w-1 h-1 bg-white/30 rounded-full hidden sm:block" />
            <span>🏟️ &nbsp;{venue}</span>
          </div>
        </div>
      </main>

      {/* ── Live Match Center Section (White Theme) ── */}
      <section className="bg-slate-50 py-12 px-4 sm:px-6 md:px-8 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-emerald-600 rounded-full inline-block animate-pulse" />
                {matchStatus}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 mt-2">
                Live Match Center
              </h2>
            </div>

            <div className="text-sm font-semibold text-slate-500 text-left sm:text-right">
              <div>Venue: <span className="text-slate-800 font-bold">{venue}</span></div>
              <div>Toss: <span className="text-slate-800 font-bold">{tossResult}</span></div>
            </div>
          </div>

          {/* White Theme Scorecard Display */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
            {/* Top Bar info */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>{tournamentName} - {matchTitle}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Innings {currentInnings}
              </span>
            </div>

            {/* Core Score Grid */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-200">

              {/* Left Column: Team Score & Run Rate */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={active.logo}
                    alt={active.name}
                    className="h-14 w-auto object-contain bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-sm"
                  />
                  <div>
                    <span className="text-[10px] text-emerald-700 uppercase font-black tracking-widest block">Batting</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-850">{active.name}</h3>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-slate-800 tabular-nums">{active.runs}</span>
                  <span className="text-3xl text-slate-300 font-bold">/</span>
                  <span className="text-3xl text-red-650 font-bold tabular-nums">{active.wickets}</span>
                  <span className="text-slate-500 text-sm ml-2 font-semibold">({currentOversDecimal} / {maxOvers} Ov)</span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-inner">
                  <div>Run Rate: <span className="text-slate-800 font-bold">{currentRunRate}</span></div>
                  <div>Partnership: <span className="text-slate-800 font-bold">{partnership} runs</span></div>
                  {currentInnings === 2 && (
                    <div>Target: <span className="text-amber-600 font-bold">{targetScore}</span></div>
                  )}
                </div>
              </div>

              {/* Right Column: Required Details (Only visible in 2nd Innings) */}
              <div className="flex flex-col justify-center">
                {currentInnings === 2 ? (
                  <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 flex flex-col justify-center space-y-4 shadow-sm">
                    <div className="text-center space-y-1">
                      <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-800 block">Chase Summary</span>
                      <p className="text-lg sm:text-xl font-bold text-slate-700">
                        Need <span className="text-emerald-700 font-black px-0.5">{runsNeeded}</span> runs from <span className="text-emerald-700 font-black px-0.5">{ballsRemaining}</span> balls
                      </p>
                    </div>

                    <div className="flex justify-around items-center border-t border-emerald-100 pt-3 text-xs text-slate-500 font-bold">
                      <div>Balls Left: <span className="text-slate-800 font-bold">{ballsRemaining}</span></div>
                      <div className="w-px h-4 bg-emerald-200" />
                      <div>Req. Rate: <span className="text-amber-600 font-extrabold">{requiredRunRate}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center border border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                    <p className="text-xs text-slate-400 text-center font-medium">
                      First Innings in progress.<br />Target & chase requirements will show during the 2nd Innings.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Grid: Batting, Bowling & Recent balls */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs">

              {/* Batters (Name, Runs, Balls Only) */}
              <div className="p-6 space-y-4 bg-white">
                <span className="font-extrabold uppercase tracking-widest text-slate-450">Batting</span>

                <div className="space-y-3">
                  {[batsman1, batsman2].map((b, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${b.isStriker
                          ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                          : 'bg-transparent border-transparent text-slate-550'
                        }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <span>{b.name}</span>
                        {b.isStriker && <span className="text-[8px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black tracking-wide">STR</span>}
                      </div>
                      <div className="font-bold tabular-nums text-sm">
                        <span className="text-slate-800">{b.runs}</span>
                        <span className="text-slate-400 font-semibold ml-1">runs</span>
                        <span className="text-slate-300 mx-2">|</span>
                        <span className="text-slate-650">{b.balls}</span>
                        <span className="text-slate-400 font-semibold ml-1">balls</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bowler & Recent Balls */}
              <div className="p-6 space-y-5 flex flex-col justify-between bg-slate-50/50">
                <div className="space-y-3">
                  <span className="font-extrabold uppercase tracking-widest text-slate-450 block">Bowling</span>
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <span className="font-bold text-slate-700">{bowler.name}</span>
                    <div className="font-bold text-slate-500 tabular-nums">
                      O: <span className="text-slate-800">{bowler.overs}</span> &nbsp;•&nbsp; R: <span className="text-slate-800">{bowler.runs}</span> &nbsp;•&nbsp; W: <span className="text-red-650">{bowler.wickets}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-extrabold uppercase tracking-widest text-slate-450 block">Recent Balls</span>
                  <div className="flex items-center gap-1.5">
                    {recentBallsList.map((ball, idx) => {
                      let bgClass = 'bg-slate-200 text-slate-700';
                      if (ball === 'W') bgClass = 'bg-red-600 text-white font-black animate-pulse';
                      if (ball === '4' || ball === '6') bgClass = 'bg-emerald-600 text-white font-black';
                      if (ball.includes('Wd') || ball.includes('Nb')) bgClass = 'bg-amber-500 text-slate-900 font-black';
                      return (
                        <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${bgClass} shadow-sm border border-black/5`}>
                          {ball}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Commentary event bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 text-xs text-slate-650">
              <span className="font-black bg-slate-200 text-slate-550 px-2.5 py-0.5 rounded tracking-wide uppercase">Commentary</span>
              <p className="truncate font-medium flex-1 text-slate-700">{lastEvent}</p>
            </div>
          </div>

          {/* Action button to trigger password modal */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                setShowAuthModal(true);
                setAuthError("");
                setPasswordInput("");
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-650 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white text-xs font-black rounded-full shadow-md uppercase tracking-wider transition-all hover:scale-[1.02]"
            >
              ⚙️ Update Scoreboard
            </button>
          </div>

        </div>
      </section>

      {/* ── PASSWORD AUTH MODAL ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-slate-800"
          >
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black uppercase tracking-wider text-slate-800">Admin Login</h3>
              <p className="text-xs text-slate-500">Enter pin to update score</p>
            </div>

            <div className="space-y-1.5">
              <input
                type="password"
                placeholder="Pin Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-center font-bold tracking-widest text-slate-800 focus:outline-none focus:border-green-500 transition-colors"
                autoFocus
              />
              {authError && (
                <p className="text-red-650 text-xs font-bold text-center">
                  {authError}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError("");
                  setPasswordInput("");
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── ADMIN CONTROLLER PANEL MODAL ── */}
      {showAdminPanel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-6 my-8 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider">Scorecard Controller</h3>
                <p className="text-xs text-slate-500">Update match statistics and records live</p>
              </div>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="text-slate-400 hover:text-slate-800 font-extrabold text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">

              {/* Settings column */}
              <div className="space-y-4">
                <h4 className="font-bold text-emerald-700 uppercase tracking-widest border-b border-slate-100 pb-1">
                  1. Match Configurations
                </h4>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-500">Batting Team</label>
                      <select
                        value={battingTeam}
                        onChange={(e) => setBattingTeam(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                      >
                        <option value="Kothalawa">Kothalawa</option>
                        <option value="Royal">Royal</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Innings</label>
                      <select
                        value={currentInnings}
                        onChange={(e) => setCurrentInnings(parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                      >
                        <option value={1}>1st Innings</option>
                        <option value={2}>2nd Innings</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-500">Target Score</label>
                      <input
                        type="number"
                        value={targetScore}
                        onChange={(e) => setTargetScore(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Partnership</label>
                      <input
                        type="number"
                        value={partnership}
                        onChange={(e) => setPartnership(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Match Status</label>
                    <select
                      value={matchStatus}
                      onChange={(e) => setMatchStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    >
                      <option value="LIVE">LIVE</option>
                      <option value="INNINGS BREAK">INNINGS BREAK</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="RAIN DELAY">RAIN DELAY</option>
                      <option value="UPCOMING">UPCOMING</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Toss Decision</label>
                    <input
                      type="text"
                      value={tossResult}
                      onChange={(e) => setTossResult(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Team scores column */}
              <div className="space-y-4">
                <h4 className="font-bold text-emerald-700 uppercase tracking-widest border-b border-slate-100 pb-1">
                  2. Team Scores
                </h4>

                <div className="space-y-4">
                  {/* Kothalawa */}
                  <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block">Kothalawa Score</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-slate-500">Runs</label>
                        <input
                          type="number"
                          value={kothalawaRuns}
                          onChange={(e) => setKothalawaRuns(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-slate-500">Wkts</label>
                        <input
                          type="number"
                          value={kothalawaWickets}
                          onChange={(e) => setKothalawaWickets(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-slate-500">Overs</label>
                        <input
                          type="number"
                          value={kothalawaOvers}
                          onChange={(e) => setKothalawaOvers(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-slate-500">Balls</label>
                        <input
                          type="number"
                          value={kothalawaBalls}
                          onChange={(e) => setKothalawaBalls(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Royal */}
                  <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block">Royal Score</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-slate-500">Runs</label>
                        <input
                          type="number"
                          value={royalRuns}
                          onChange={(e) => setRoyalRuns(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-slate-500">Wkts</label>
                        <input
                          type="number"
                          value={royalWickets}
                          onChange={(e) => setRoyalWickets(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-slate-500">Overs</label>
                        <input
                          type="number"
                          value={royalOvers}
                          onChange={(e) => setRoyalOvers(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-slate-500">Balls</label>
                        <input
                          type="number"
                          value={royalBalls}
                          onChange={(e) => setRoyalBalls(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batting Card Column */}
              <div className="space-y-4">
                <h4 className="font-bold text-emerald-700 uppercase tracking-widest border-b border-slate-100 pb-1">
                  3. Batting Statistics
                </h4>

                <div className="space-y-3">
                  {/* Batsman 1 */}
                  <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block">Batsman 1</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={batsman1.name}
                        onChange={(e) => setBatsman1({ ...batsman1, name: e.target.value })}
                        className="col-span-2 bg-white border border-slate-200 rounded px-2 py-1"
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        value={batsman1.runs}
                        onChange={(e) => setBatsman1({ ...batsman1, runs: parseInt(e.target.value) || 0 })}
                        className="bg-white border border-slate-200 rounded px-2 py-1 text-center"
                        placeholder="Runs"
                      />
                      <input
                        type="number"
                        value={batsman1.balls}
                        onChange={(e) => setBatsman1({ ...batsman1, balls: parseInt(e.target.value) || 0 })}
                        className="bg-white border border-slate-200 rounded px-2 py-1 text-center"
                        placeholder="Balls"
                      />
                      <label className="col-span-2 flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          checked={batsman1.isStriker}
                          onChange={(e) => {
                            setBatsman1({ ...batsman1, isStriker: e.target.checked });
                            if (e.target.checked) setBatsman2({ ...batsman2, isStriker: false });
                          }}
                          className="rounded border-slate-200"
                        />
                        <span>Is Striker?</span>
                      </label>
                    </div>
                  </div>

                  {/* Batsman 2 */}
                  <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block">Batsman 2</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={batsman2.name}
                        onChange={(e) => setBatsman2({ ...batsman2, name: e.target.value })}
                        className="col-span-2 bg-white border border-slate-200 rounded px-2 py-1"
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        value={batsman2.runs}
                        onChange={(e) => setBatsman2({ ...batsman2, runs: parseInt(e.target.value) || 0 })}
                        className="bg-white border border-slate-200 rounded px-2 py-1 text-center"
                        placeholder="Runs"
                      />
                      <input
                        type="number"
                        value={batsman2.balls}
                        onChange={(e) => setBatsman2({ ...batsman2, balls: parseInt(e.target.value) || 0 })}
                        className="bg-white border border-slate-200 rounded px-2 py-1 text-center"
                        placeholder="Balls"
                      />
                      <label className="col-span-2 flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          checked={batsman2.isStriker}
                          onChange={(e) => {
                            setBatsman2({ ...batsman2, isStriker: e.target.checked });
                            if (e.target.checked) setBatsman1({ ...batsman1, isStriker: false });
                          }}
                          className="rounded border-slate-200"
                        />
                        <span>Is Striker?</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bowler Details Section */}
              <div className="space-y-4">
                <h4 className="font-bold text-emerald-700 uppercase tracking-widest border-b border-slate-100 pb-1">
                  4. Bowler & Ball Feed
                </h4>

                <div className="space-y-3">
                  <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block">Bowler</span>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={bowler.name}
                        onChange={(e) => setBowler({ ...bowler, name: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5"
                        placeholder="Bowler Name"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={bowler.overs}
                          onChange={(e) => setBowler({ ...bowler, overs: e.target.value })}
                          className="bg-white border border-slate-200 rounded px-2 py-1.5 text-center"
                          placeholder="Overs"
                        />
                        <input
                          type="number"
                          value={bowler.runs}
                          onChange={(e) => setBowler({ ...bowler, runs: parseInt(e.target.value) || 0 })}
                          className="bg-white border border-slate-200 rounded px-2 py-1.5 text-center"
                          placeholder="Runs"
                        />
                        <input
                          type="number"
                          value={bowler.wickets}
                          onChange={(e) => setBowler({ ...bowler, wickets: parseInt(e.target.value) || 0 })}
                          className="bg-white border border-slate-200 rounded px-2 py-1.5 text-center"
                          placeholder="Wickets"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Recent Balls (comma separated)</label>
                    <input
                      type="text"
                      value={recentBallsString}
                      onChange={(e) => setRecentBallsString(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Last Ball Commentary Event</label>
                    <input
                      type="text"
                      value={lastEvent}
                      onChange={(e) => setLastEvent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <button
                onClick={() => setShowAdminPanel(false)}
                className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all duration-150"
              >
                APPLY ALL CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
