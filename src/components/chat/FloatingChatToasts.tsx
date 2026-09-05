import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const FloatingChatToasts: React.FC = () => {
  const { chatMessages, isChatPanelOpen, openChatPanel, unreadChatCount, userProfile } = useGameStore();

  const [activeToast, setActiveToast] = useState<{
    id: string;
    senderName: string;
    senderAvatar: string;
    senderColor?: string;
    text: string;
    isEmote?: boolean;
  } | null>(null);

  // When a new chat message arrives and the panel is closed, show a temporary toast
  useEffect(() => {
    if (chatMessages.length === 0 || isChatPanelOpen) {
      setActiveToast(null);
      return;
    }

    const latest = chatMessages[chatMessages.length - 1];
    // Don't show toast for old messages
    if (!latest || latest.senderId === 'sys') return;

    setActiveToast({
      id: latest.id,
      senderName: latest.senderId === userProfile.id ? 'You' : latest.senderName,
      senderAvatar: latest.senderAvatar,
      senderColor: latest.senderColor,
      text: latest.text,
      isEmote: latest.isEmote,
    });

    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 4200);

    return () => clearTimeout(timer);
  }, [chatMessages, isChatPanelOpen, userProfile.id]);

  return (
    <>
      {/* Floating Chat Toast Notification (when drawer is closed) */}
      <AnimatePresence>
        {activeToast && !isChatPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={openChatPanel}
            className="fixed top-18 right-3 sm:right-6 z-40 max-w-[290px] sm:max-w-[340px] bg-[#0e1c0e]/95 backdrop-blur-md border border-[#d4af37]/60 rounded-2xl p-2.5 shadow-2xl cursor-pointer hover:border-[#d4af37] transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#142914] border border-[#d4af37]/40 flex items-center justify-center text-base shrink-0 shadow-inner">
                {activeToast.senderAvatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-bold text-[#f5df88] truncate">
                    {activeToast.senderName}
                  </span>
                  <span className="text-[9px] text-[#e0dcc5]/50 group-hover:text-[#d4af37] transition flex items-center gap-0.5">
                    <MessageSquare className="w-2.5 h-2.5" /> Tap to reply
                  </span>
                </div>
                <p className={`text-xs text-[#e0dcc5] truncate mt-0.5 ${activeToast.isEmote ? 'text-lg' : ''}`}>
                  {activeToast.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Side Tab Toggle Button on right edge */}
      {!isChatPanelOpen && (
        <button
          id="btn-floating-chat-trigger"
          onClick={openChatPanel}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-[#122312]/95 border-l border-y border-[#d4af37]/50 hover:border-[#d4af37] text-[#f5df88] py-2 px-1.5 sm:px-2 rounded-l-2xl shadow-xl hover:bg-[#1a301a] active:scale-95 transition cursor-pointer flex flex-col items-center gap-1 group"
          title="Open Savannah Chat"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 shadow-sm animate-bounce">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#d4af37]/80 [writing-mode:vertical-rl] rotate-180 hidden sm:inline-block">
            Chat
          </span>
        </button>
      )}
    </>
  );
};
