/**
 * Ludo Magic Savannah - Guided Onboarding Overlay Component
 * Highlights key game elements (Board, Dice, Abilities, Turn HUD) for new players
 * entering their first match, with an interactive spotlight cutout, rich tactical guides,
 * and responsive controls.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { soundEngine } from '../../utils/soundEngine';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Dices,
  Shield,
  Zap,
  Clock,
  Compass,
  Trophy,
  Trees,
  CheckCircle2,
  Flame,
  HelpCircle,
} from 'lucide-react';

interface TutorialStep {
  id: string;
  targetId: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  accentColor: string;
  points: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
  proTip: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'board',
    targetId: 'onboarding-board-target',
    title: 'The Sacred Savannah Board',
    tagline: 'Step 1 of 4 • Battlefield Mastery',
    icon: <Compass className="w-5 h-5 text-[#d4af37]" />,
    accentColor: '#d4af37',
    points: [
      {
        icon: <Compass className="w-4 h-4 text-amber-400" />,
        title: '4 Animal Yards',
        description:
          'Pawns rest in their clan sanctuary (Lion, Elephant, Giraffe, Zebra). Roll a 6 to summon a beast onto the starting track!',
      },
      {
        icon: <Trees className="w-4 h-4 text-emerald-400" />,
        title: 'Baobab Safe Havens',
        description:
          'Tiles marked with sacred Baobab trees 🌳 and golden star crests are sanctuaries. Pieces cannot be captured or eliminated here!',
      },
      {
        icon: <Flame className="w-4 h-4 text-red-400" />,
        title: 'Predator Ambush & Captures',
        description:
          "Land directly on an enemy pawn to capture it, banishing it back to their yard and granting you an instant free bonus roll!",
      },
      {
        icon: <Trophy className="w-4 h-4 text-yellow-400" />,
        title: 'Center Waterhole (Victory)',
        description:
          'Navigate the perimeter, turn into your clan home stretch, and lead all 4 pawns into the central oasis to win the match!',
      },
    ],
    proTip: 'Keep at least one pawn camped on a Baobab sanctuary near an opponent\'s start tile to ambush them as soon as they leave their yard!',
  },
  {
    id: 'dice',
    targetId: 'onboarding-dice-target',
    title: 'The Sunstone 3D Dice',
    tagline: 'Step 2 of 4 • Rolls & Movement',
    icon: <Dices className="w-5 h-5 text-amber-400" />,
    accentColor: '#f59e0b',
    points: [
      {
        icon: <Dices className="w-4 h-4 text-amber-300" />,
        title: 'Tap When It\'s Your Turn',
        description:
          'When the golden aura pulses around the dice, tap to roll a value between 1 and 6.',
      },
      {
        icon: <Zap className="w-4 h-4 text-yellow-400" />,
        title: 'The Power of 6',
        description:
          'Rolling a 6 summons a pawn from your yard OR advances an active pawn by 6, plus grants an immediate extra roll!',
      },
      {
        icon: <Flame className="w-4 h-4 text-red-400" />,
        title: 'Three 6s Foul Penalty',
        description:
          'Rolling three consecutive 6s triggers a tribal penalty: the roll is canceled and your turn passes to the next player.',
      },
      {
        icon: <Clock className="w-4 h-4 text-cyan-400" />,
        title: 'Turn Urgency Alert',
        description:
          'When turn time drops below 5 seconds, the dice pulses with crimson energy to alert you before timeout occurs.',
      },
    ],
    proTip: 'If multiple moves are available after rolling, the board highlights all valid pieces with golden halos. Tap your chosen piece to move it!',
  },
  {
    id: 'abilities',
    targetId: 'onboarding-abilities-target',
    title: 'Ancestral Beast Magic',
    tagline: 'Step 3 of 4 • Spells & Mana',
    icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
    accentColor: '#06b6d4',
    points: [
      {
        icon: <Zap className="w-4 h-4 text-cyan-300" />,
        title: 'Mana (MP) Accumulation',
        description:
          'Your beast gathers ancestral mana each turn (+1 MP) and earns bonus mana surges whenever you capture an opponent\'s pawn.',
      },
      {
        icon: <Shield className="w-4 h-4 text-emerald-400" />,
        title: 'Unique Guardian Powers',
        description:
          '🦁 Lion\'s Roar shields pawns from captures. 🐘 Elephant Stomp knocks enemies back. 🐆 Cheetah grants +2 speed. 🦒 Giraffe leaps past blockades!',
      },
      {
        icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        title: 'Activate Before Rolling',
        description:
          'Whenever you have enough MP, tap CAST before rolling your dice to unleash game-changing magical effects!',
      },
    ],
    proTip: 'Save your Lion Shield or Elephant Stomp for critical moments when an opponent is stalking within striking distance of your lead pawn.',
  },
  {
    id: 'hud',
    targetId: 'onboarding-hud-target',
    title: 'Turn HUD & Pressure Timer',
    tagline: 'Step 4 of 4 • Clan Status & Timing',
    icon: <Clock className="w-5 h-5 text-emerald-400" />,
    accentColor: '#10b981',
    points: [
      {
        icon: <Trophy className="w-4 h-4 text-amber-300" />,
        title: 'Live Clan Scorecards',
        description:
          'Track each clan\'s home progress (0/4 up to 4/4 pawns finished) and see whose turn is currently active.',
      },
      {
        icon: <Clock className="w-4 h-4 text-red-400" />,
        title: '20-Second Pressure Clock',
        description:
          'Competitive turns have a 20-second countdown. If time expires, the Savannah spirits will auto-roll or auto-advance your best piece.',
      },
      {
        icon: <HelpCircle className="w-4 h-4 text-yellow-300" />,
        title: 'Revisit Guide Anytime',
        description:
          'Tap the (?) Help button on the top bar anytime during a match to reopen this guided tutorial.',
      },
    ],
    proTip: 'Use quick animal emotes during intense moments to celebrate clutch captures or rally your clan spirits!',
  },
];

export const OnboardingOverlay: React.FC = () => {
  const { isOnboardingActive, dismissOnboarding, soundEnabled } = useGameStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [neverShowAgain, setNeverShowAgain] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const cardRef = useRef<HTMLDivElement>(null);

  const step = TUTORIAL_STEPS[currentStepIndex];

  // Measure target element position
  const updateTargetRect = useCallback(() => {
    if (!step) return;
    const el = document.getElementById(step.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      // Smoothly scroll target into view if outside comfortable bounds
      const isInView =
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth;
      if (!isInView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!isOnboardingActive) return;

    updateTargetRect();
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      updateTargetRect();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateTargetRect, true);

    const timer = setTimeout(updateTargetRect, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateTargetRect, true);
      clearTimeout(timer);
    };
  }, [isOnboardingActive, currentStepIndex, updateTargetRect]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOnboardingActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissOnboarding(neverShowAgain);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOnboardingActive, currentStepIndex, neverShowAgain]);

  if (!isOnboardingActive) return null;

  const handleNext = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      if (soundEnabled) soundEngine.playTutorialStep();
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      dismissOnboarding(neverShowAgain);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      if (soundEnabled) soundEngine.playTutorialStep();
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    dismissOnboarding(neverShowAgain);
  };

  // Calculate smart placement for the tutorial card
  const getCardPlacementStyle = () => {
    if (!targetRect) {
      // Centered fallback
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 16;
    const cardMaxWidth = 520;
    const isMobile = windowSize.width < 640;

    // Check if target is in bottom half or top half
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const isBottomHalf = targetCenterY > windowSize.height * 0.55;

    if (isMobile) {
      // On mobile screens, anchor at top if target is bottom, or anchor at bottom if target is top
      if (isBottomHalf) {
        return {
          top: `${Math.max(12, targetRect.top - 360)}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 24px)',
          maxWidth: `${cardMaxWidth}px`,
        };
      } else {
        return {
          top: `${Math.min(windowSize.height - 380, targetRect.bottom + 12)}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 24px)',
          maxWidth: `${cardMaxWidth}px`,
        };
      }
    }

    // Desktop placement
    if (step.id === 'hud') {
      return {
        top: `${targetRect.bottom + 16}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${cardMaxWidth}px`,
      };
    } else if (step.id === 'dice' || step.id === 'abilities') {
      return {
        bottom: `${Math.max(20, windowSize.height - targetRect.top + 16)}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${cardMaxWidth}px`,
      };
    } else {
      // Board: place centered or neatly in upper third
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${cardMaxWidth}px`,
      };
    }
  };

  // Highlight Box padding around target
  const pad = 6;
  const highlightBox = targetRect
    ? {
        x: Math.max(0, targetRect.left - pad),
        y: Math.max(0, targetRect.top - pad),
        width: targetRect.width + pad * 2,
        height: targetRect.height + pad * 2,
      }
    : null;

  return (
    <div
      id="onboarding-guided-overlay"
      className="fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none"
    >
      {/* 1. Backdrop with SVG Cutout Mask */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <defs>
          <mask id="spotlight-mask">
            {/* White covers entire screen */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout reveals target */}
            {highlightBox && (
              <rect
                x={highlightBox.x}
                y={highlightBox.y}
                width={highlightBox.width}
                height={highlightBox.height}
                rx="20"
                ry="20"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Semi-transparent dark overlay through the mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(5, 10, 5, 0.82)"
          mask="url(#spotlight-mask)"
          className="backdrop-blur-[2px]"
          onClick={handleNext}
        />
      </svg>

      {/* 2. Target Spotlight Border & Pulsing Focus Ring */}
      {highlightBox && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: `${highlightBox.y}px`,
            left: `${highlightBox.x}px`,
            width: `${highlightBox.width}px`,
            height: `${highlightBox.height}px`,
          }}
          className="pointer-events-none rounded-2xl border-2 sm:border-3 border-[#d4af37] shadow-[0_0_35px_rgba(212,175,55,0.7)] ring-2 ring-[#e8c858]/60"
        >
          {/* Target in Focus Badge */}
          <div className="absolute -top-3.5 left-4 px-2.5 py-0.5 rounded-full bg-[#182818] border border-[#d4af37] text-[10px] font-bold text-[#f5df88] uppercase tracking-wider flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>FOCUS: {step.id.toUpperCase()}</span>
          </div>
        </motion.div>
      )}

      {/* 3. Interactive Guided Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        style={getCardPlacementStyle()}
        className="absolute z-50 bg-[#0d1a0d]/95 backdrop-blur-xl border-2 border-[#d4af37]/60 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl shadow-black text-[#e0dcc5] max-h-[85vh] flex flex-col gap-3 overflow-y-auto no-scrollbar"
      >
        {/* Top Header: Tagline, Step Count, and Skip button */}
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#142314] border border-[#d4af37]/40 shadow-inner">
              {step.icon}
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#d4af37] uppercase">
                {step.tagline}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {step.title}
              </h3>
            </div>
          </div>

          <button
            id="btn-skip-onboarding"
            onClick={handleSkip}
            className="p-1.5 rounded-xl bg-[#142314] text-[#d4af37] hover:text-white border border-[#d4af37]/30 hover:bg-[#1f361f] transition active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Skip Guide"
          >
            <span className="hidden sm:inline">Skip</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-[#081208]/90 p-1 rounded-xl border border-[#d4af37]/25">
          {TUTORIAL_STEPS.map((s, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <button
                key={s.id}
                id={`btn-onboarding-step-${s.id}`}
                onClick={() => {
                  if (soundEnabled) soundEngine.playTutorialStep();
                  setCurrentStepIndex(idx);
                }}
                className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8218] text-[#0d1a0d] shadow-md shadow-[#d4af37]/30 scale-[1.02]'
                    : isCompleted
                    ? 'bg-[#142314] text-[#e0dcc5] hover:bg-[#1a301a]'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span>{idx + 1}.</span>
                )}
                <span className="truncate">
                  {s.id === 'board' ? 'Board' : s.id === 'dice' ? 'Dice' : s.id === 'abilities' ? 'Magic' : 'HUD'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feature Highlights Grid */}
        <div className="space-y-2">
          {step.points.map((pt, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#142314]/70 border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition"
            >
              <div className="p-1.5 rounded-lg bg-[#0d180d] border border-[#d4af37]/30 mt-0.5 shrink-0">
                {pt.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {pt.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#e0dcc5]/80 leading-relaxed mt-0.5">
                  {pt.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Pro-Tip Box */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#1a2b1a]/40 to-amber-950/40 border border-[#d4af37]/30 text-[11px] text-[#f5df88] flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <span className="font-bold text-[#d4af37] mr-1">CHIEFTAIN PRO TIP:</span>
            <span>{step.proTip}</span>
          </div>
        </div>

        {/* Bottom Actions Row: Remember Checkbox & Prev/Next Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#d4af37]/20">
          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 text-xs text-[#e0dcc5]/70 cursor-pointer hover:text-white select-none self-start sm:self-auto">
            <input
              id="chk-onboarding-remember"
              type="checkbox"
              checked={neverShowAgain}
              onChange={(e) => setNeverShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-[#d4af37]/50 text-[#d4af37] accent-[#d4af37] cursor-pointer"
            />
            <span>Don't show automatically next time</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {currentStepIndex > 0 && (
              <button
                id="btn-onboarding-prev"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl bg-[#142314] text-[#e0dcc5] border border-[#d4af37]/30 hover:bg-[#1e341e] transition active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              id="btn-onboarding-next"
              onClick={handleNext}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 shadow-lg shadow-[#d4af37]/30 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>
                {currentStepIndex === TUTORIAL_STEPS.length - 1
                  ? 'Enter Savannah Battle!'
                  : 'Next Step'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
