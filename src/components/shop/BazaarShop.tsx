/**
 * Ludo Magic Savannah - Cosmetics Bazaar & Shop
 */

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CosmeticItem } from '../../types/user';
import { ShoppingBag, Sparkles, Check, Gem, Coins, Lock } from 'lucide-react';

export const BazaarShop: React.FC = () => {
  const { userProfile, unlockCosmetic, equipCosmetic } = useGameStore();
  const [activeTab, setActiveTab] = useState<'piece_skin' | 'board_theme' | 'dice_skin' | 'trail'>('piece_skin');

  const ITEMS: CosmeticItem[] = [
    // 1. Piece Skins
    { id: 'lion', name: 'Golden Lion King', category: 'piece_skin', rarity: 'legendary', priceCoins: 0, unlocked: true, previewIcon: '🦁', description: 'The ancestral monarch of the savannah plains with golden crown.' },
    { id: 'elephant', name: 'Kilimanjaro Tusker', category: 'piece_skin', rarity: 'epic', priceCoins: 1200, unlocked: true, previewIcon: '🐘', description: 'Ancient elder tusker with runic ivory carvings.' },
    { id: 'cheetah', name: 'Serengeti Swiftblade', category: 'piece_skin', rarity: 'epic', priceCoins: 1200, unlocked: true, previewIcon: '🐆', description: 'Wind-infused cheetah with lightning speed marks.' },
    { id: 'zebra', name: 'Mystic Ghost Zebra', category: 'piece_skin', rarity: 'rare', priceCoins: 800, unlocked: true, previewIcon: '🦓', description: 'Shimmering astral zebra adorned in spiritual stripes.' },
    { id: 'rhino', name: 'Volcano Titan Rhino', category: 'piece_skin', rarity: 'legendary', priceGems: 180, unlocked: false, previewIcon: '🦏', description: 'Armored obsidian rhino forged in the great crater.' },
    { id: 'giraffe', name: 'Sunwatcher Giraffe', category: 'piece_skin', rarity: 'rare', priceCoins: 800, unlocked: false, previewIcon: '🦒', description: 'Tall guardian of the horizon that spots danger miles away.' },

    // 2. Board Themes
    { id: 'savannah_gold', name: 'Golden Sunset Plains', category: 'board_theme', rarity: 'common', priceCoins: 0, unlocked: true, previewIcon: '🌅', description: 'Warm amber dusk with dancing dust motes and ancient baobab silhouettes.', themeAmbiance: 'sunset' },
    { id: 'midnight_oasis', name: 'Midnight Oasis & Fireflies', category: 'board_theme', rarity: 'epic', priceCoins: 2500, unlocked: false, previewIcon: '🌌', description: 'Moonlit waters with glowing cyan waterholes and bioluminescent fireflies.', themeAmbiance: 'night' },
    { id: 'emerald_serengeti', name: 'Serengeti Dawn & Rain', category: 'board_theme', rarity: 'rare', priceCoins: 1500, unlocked: false, previewIcon: '🌿', description: 'Fresh green grasslands after the seasonal monsoon rains.', themeAmbiance: 'day' },

    // 3. Dice Skins
    { id: 'sunstone', name: 'Sunstone Gold', category: 'dice_skin', rarity: 'common', priceCoins: 0, unlocked: true, previewIcon: '🎲', description: 'Polished amber sunstone dice with obsidian pips.' },
    { id: 'ivory', name: 'Ancient Tribal Ivory', category: 'dice_skin', rarity: 'rare', priceCoins: 900, unlocked: false, previewIcon: '🪨', description: 'Hand-carved bone dice blessed by ancestral elders.' },
    { id: 'amethyst', name: 'Mystic Rift Amethyst', category: 'dice_skin', rarity: 'legendary', priceGems: 120, unlocked: false, previewIcon: '🔮', description: 'Crystalline purple dice that shimmers upon every roll.' },
  ];

  const filteredItems = ITEMS.filter((item) => item.category === activeTab);

  const isEquipped = (item: CosmeticItem) => {
    if (item.category === 'board_theme') return userProfile.equippedBoardTheme === item.id;
    if (item.category === 'dice_skin') return userProfile.equippedDiceSkin === item.id;
    if (item.category === 'piece_skin') return userProfile.equippedPieceSkin === item.id;
    return false;
  };

  const getRarityBadge = (rarity: CosmeticItem['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'bg-amber-500/20 text-yellow-400 border-yellow-400/50';
      case 'epic': return 'bg-purple-500/20 text-purple-300 border-purple-400/50';
      case 'rare': return 'bg-blue-500/20 text-blue-300 border-blue-400/50';
      default: return 'bg-stone-800 text-stone-400 border-stone-700';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-[#172617] via-[#101b10] to-[#1d160b] border-2 border-[#d4af37]/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            <span>Savannah Bazaar</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#e0dcc5] font-serif mt-1">
            Cosmetics & Tribal Relics
          </h2>
          <p className="text-xs text-[#e0dcc5]/80 mt-0.5">
            100% fair cosmetic customization. Express your unique pride without pay-to-win.
          </p>
        </div>

        {/* Currency balances */}
        <div className="flex items-center gap-3 bg-[#0a120a] p-2.5 rounded-2xl border border-[#d4af37]/35">
          <div className="flex items-center gap-1.5 text-[#d4af37] font-bold text-sm">
            <Coins className="w-4 h-4" />
            <span>{userProfile.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-sm border-l border-stone-800 pl-3">
            <Gem className="w-4 h-4" />
            <span>{userProfile.gems}</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-[#d4af37]/25 pb-2 overflow-x-auto">
        {[
          { id: 'piece_skin' as const, label: '🦁 Animal Pieces' },
          { id: 'board_theme' as const, label: '🌅 Board Themes' },
          { id: 'dice_skin' as const, label: '🎲 Dice Relics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#d4af37] text-[#0d1a0d] shadow-md'
                : 'bg-[#121f12] text-[#e0dcc5] hover:bg-[#1a2c1a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Item Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const equipped = isEquipped(item);
          const canAffordCoins = item.priceCoins !== undefined && userProfile.coins >= item.priceCoins;
          const canAffordGems = item.priceGems !== undefined && userProfile.gems >= item.priceGems;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-[#121f12]/90 border flex flex-col justify-between gap-3 shadow-lg transition ${
                equipped ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40' : 'border-[#d4af37]/25'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${getRarityBadge(item.rarity)}`}>
                    {item.rarity}
                  </span>
                  {equipped && (
                    <span className="text-[10px] font-bold text-[#f5df88] flex items-center gap-1 bg-[#d4af37]/20 px-2 py-0.5 rounded border border-[#d4af37]/40">
                      <Check className="w-3 h-3" />
                      <span>Equipped</span>
                    </span>
                  )}
                </div>

                <div className="w-16 h-16 mx-auto my-2 rounded-2xl bg-[#0a120a] border border-[#d4af37]/30 flex items-center justify-center text-3xl shadow-inner">
                  {item.previewIcon}
                </div>

                <h4 className="text-sm font-bold text-[#e0dcc5] text-center">{item.name}</h4>
                <p className="text-xs text-[#e0dcc5]/70 text-center mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#1e2f1e] flex items-center justify-between">
                {item.unlocked ? (
                  <button
                    disabled={equipped}
                    onClick={() => equipCosmetic(item)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      equipped
                        ? 'bg-[#182818] text-stone-500 cursor-default'
                        : 'bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] hover:brightness-110 shadow-md'
                    }`}
                  >
                    {equipped ? 'Equipped' : 'Equip Skin'}
                  </button>
                ) : (
                  <button
                    onClick={() => unlockCosmetic(item)}
                    disabled={!canAffordCoins && !canAffordGems}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      canAffordCoins || canAffordGems
                        ? 'bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] hover:brightness-110 shadow-md'
                        : 'bg-[#182818] text-stone-500 border border-stone-800 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      Unlock ({item.priceCoins ? `${item.priceCoins} 🪙` : `${item.priceGems} 💎`})
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
