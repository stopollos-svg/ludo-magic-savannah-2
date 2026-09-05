import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Sparkles,
  Flame,
  Trees,
  Skull,
  HeartHandshake,
  Smile,
  Check,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import {
  SAVANNAH_PHRASE_CATEGORIES,
  SAVANNAH_QUICK_PHRASES,
  SAVANNAH_EMOTE_PRESETS,
  SavannahQuickPhrase,
} from '../../data/savannahPhrases';

export const SavannahChatDrawer: React.FC = () => {
  const {
    isChatPanelOpen,
    closeChatPanel,
    chatMessages,
    sendChatMessage,
    userProfile,
    gameState,
  } = useGameStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inputText, setInputText] = useState<string>('');
  const [showEmoteRow, setShowEmoteRow] = useState<boolean>(true);
  const [justSentId, setJustSentId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (isChatPanelOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatPanelOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatPanelOpen) {
        closeChatPanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatPanelOpen, closeChatPanel]);

  const handleSendPhrase = (phrase: SavannahQuickPhrase) => {
    sendChatMessage(phrase.text, false);
    setJustSentId(phrase.id);
    setTimeout(() => setJustSentId(null), 1200);
  };

  const handleSendEmote = (emote: string) => {
    sendChatMessage(emote, true);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    sendChatMessage(trimmed, false);
    setInputText('');
  };

  const filteredPhrases =
    selectedCategory === 'all'
      ? SAVANNAH_QUICK_PHRASES
      : SAVANNAH_QUICK_PHRASES.filter((p) => p.category === selectedCategory);

  const categoryIcons: Record<string, React.ReactNode> = {
    all: <Sparkles className="w-3 h-3 text-[#d4af37]" />,
    greetings: <span className="text-xs">🦁</span>,
    battle_cries: <Flame className="w-3 h-3 text-orange-400" />,
    blessings: <Trees className="w-3 h-3 text-emerald-400" />,
    drama: <Skull className="w-3 h-3 text-red-400" />,
    camaraderie: <HeartHandshake className="w-3 h-3 text-cyan-400" />,
  };

  return (
    <AnimatePresence>
      {isChatPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeChatPanel}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-full sm:w-[410px] md:w-[440px] h-full bg-gradient-to-b from-[#0f1d0f] via-[#091409] to-[#0d1a0d] border-l border-[#d4af37]/40 shadow-2xl flex flex-col z-10 text-[#e0dcc5]"
          >
            {/* 1. DRAWER HEADER */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#d4af37]/25 bg-[#122312]/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1d351d] border border-[#d4af37]/40 flex items-center justify-center text-base shadow-inner">
                  💬
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#f5df88] font-serif tracking-wide flex items-center gap-1.5">
                    Savannah Campfire Chat
                  </h3>
                  <p className="text-[11px] text-[#e0dcc5]/70 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      {gameState?.players ? `${gameState.players.length} Chieftains in arena` : 'Live arena'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="btn-close-chat-drawer"
                  onClick={closeChatPanel}
                  className="min-w-[36px] min-h-[36px] p-2 rounded-xl bg-[#192b19] border border-stone-700/60 text-[#e0dcc5] hover:bg-[#233a23] hover:text-white active:scale-95 transition cursor-pointer flex items-center justify-center"
                  title="Close Chat (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. CHAT STREAM (Scrollable Message History) */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-0 select-text">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                  <span className="text-3xl mb-2 opacity-60">🦁</span>
                  <p className="text-xs font-medium text-[#e0dcc5]/70">The plains are quiet.</p>
                  <p className="text-[11px] text-[#e0dcc5]/50 mt-1">Send a greeting or battle cry below!</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.senderId === userProfile.id;
                  const isSystem = msg.senderId === 'sys';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-1.5">
                        <div className="max-w-[85%] px-3 py-1.5 rounded-full bg-[#182918]/80 border border-[#d4af37]/30 text-[11px] text-[#f5df88] text-center font-medium shadow-xs">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  const colorBorder: Record<string, string> = {
                    red: 'border-red-500/70',
                    green: 'border-emerald-500/70',
                    yellow: 'border-[#d4af37]/80',
                    blue: 'border-blue-400/70',
                  };
                  const borderCls = msg.senderColor ? colorBorder[msg.senderColor] || 'border-[#d4af37]/40' : 'border-[#d4af37]/40';

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.18 }}
                      className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm shrink-0 bg-[#122312] border ${borderCls} shadow-xs mt-0.5`}
                      >
                        {msg.senderAvatar}
                      </div>

                      {/* Content Bubble */}
                      <div className={`flex flex-col max-w-[78%] ${isMe ? 'items-end' : 'items-start'}`}>
                        {/* Name & Time Header */}
                        <div className="flex items-center gap-1.5 px-1 mb-0.5 text-[10px] text-[#e0dcc5]/65">
                          <span className="font-bold text-[#e0dcc5]">
                            {isMe ? 'You' : msg.senderName}
                          </span>
                          {msg.clanName && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-[#d4af37] font-mono">
                              {msg.clanName}
                            </span>
                          )}
                          <span>{msg.timestamp}</span>
                        </div>

                        {/* Speech Bubble */}
                        <div
                          className={`rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-md ${
                            msg.isEmote
                              ? 'bg-transparent text-2xl py-1 px-1 border-none shadow-none'
                              : isMe
                              ? 'bg-[#1e381e] border border-[#d4af37]/45 text-[#f5df88] rounded-tr-xs'
                              : 'bg-[#111e11] border border-stone-700/80 text-[#e0dcc5] rounded-tl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 3. PRE-DEFINED SAVANNAH QUICK PHRASES DRAWER (THE CORE FEATURE) */}
            <div className="border-t border-[#d4af37]/25 bg-[#0e1b0e]/95 backdrop-blur-md p-3 flex flex-col gap-2 shrink-0">
              {/* Category Filter Tabs */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  {SAVANNAH_PHRASE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer border ${
                          isSelected
                            ? 'bg-[#233d23] border-[#d4af37] text-[#f5df88] shadow-xs'
                            : 'bg-[#132213] border-stone-800 text-[#e0dcc5]/70 hover:bg-[#1a2d1a] hover:text-[#e0dcc5]'
                        }`}
                      >
                        {categoryIcons[cat.id]}
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Emote toggle button */}
                <button
                  onClick={() => setShowEmoteRow(!showEmoteRow)}
                  className={`min-w-[30px] min-h-[30px] p-1 rounded-xl border text-xs flex items-center justify-center transition cursor-pointer ${
                    showEmoteRow
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5df88]'
                      : 'bg-[#132213] border-stone-800 text-stone-400 hover:text-[#e0dcc5]'
                  }`}
                  title="Toggle Quick Emotes"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Emote Reactions Bar */}
              {showEmoteRow && (
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-0.5 bg-[#091209] rounded-xl border border-stone-800/80">
                  {SAVANNAH_EMOTE_PRESETS.map((em) => (
                    <button
                      key={em}
                      onClick={() => handleSendEmote(em)}
                      className="min-w-[34px] h-8 flex items-center justify-center text-lg hover:scale-125 active:scale-95 transition cursor-pointer hover:bg-[#1a2e1a] rounded-lg"
                      title={`Send ${em}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}

              {/* 1-Tap Savannah Quick Phrases Grid */}
              <div className="max-h-[145px] overflow-y-auto no-scrollbar space-y-1.5 pr-0.5">
                <p className="text-[10px] text-[#d4af37]/80 uppercase tracking-wider font-bold px-1 flex items-center justify-between">
                  <span>Tap to send instantly</span>
                  <span className="text-[9px] text-[#e0dcc5]/50 lowercase">
                    {filteredPhrases.length} phrases
                  </span>
                </p>

                <div className="grid grid-cols-1 gap-1.5">
                  {filteredPhrases.map((phrase) => {
                    const isJustSent = justSentId === phrase.id;
                    return (
                      <button
                        key={phrase.id}
                        id={`btn-phrase-${phrase.id}`}
                        onClick={() => handleSendPhrase(phrase)}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs font-medium border transition cursor-pointer group ${
                          isJustSent
                            ? 'bg-[#2a4e2a] border-emerald-400 text-emerald-200 shadow-md scale-[0.99]'
                            : 'bg-[#142614] border-[#d4af37]/20 hover:border-[#d4af37]/60 text-[#e0dcc5] hover:bg-[#1b321b] active:scale-[0.98]'
                        }`}
                      >
                        <span className="truncate leading-tight text-[11.5px] group-hover:text-[#f5df88]">
                          {phrase.text}
                        </span>

                        <span className="shrink-0 flex items-center gap-1">
                          {isJustSent ? (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-300">
                              <Check className="w-3 h-3" /> Sent
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-black/50 text-[#d4af37] font-mono group-hover:bg-[#d4af37]/20">
                              {phrase.tag || 'Send'}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. CUSTOM MESSAGE INPUT */}
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 mt-0.5 pt-1.5 border-t border-stone-800">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  maxLength={90}
                  placeholder="Whisper to the plains..."
                  className="flex-1 bg-[#091209] border border-stone-700/70 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 rounded-xl px-3 py-2 text-xs text-[#e0dcc5] placeholder:text-[#e0dcc5]/40 outline-hidden transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="min-w-[40px] min-h-[36px] px-3 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e8c858] text-stone-950 font-bold hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center shadow-md"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5 text-stone-950" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
