/**
 * Ludo Magic Savannah - Themed Quick Phrases and Chat Presets
 * Authentic African savannah banter, greetings, clan battle cries, and tactical reactions.
 */

export interface SavannahPhraseCategory {
  id: string;
  name: string;
  icon: string;
  badgeColor: string;
}

export interface SavannahQuickPhrase {
  id: string;
  category: string;
  text: string;
  tag?: string;
}

export const SAVANNAH_PHRASE_CATEGORIES: SavannahPhraseCategory[] = [
  { id: 'all', name: 'All Phrases', icon: '✨', badgeColor: 'border-[#d4af37]/60 text-[#f5df88]' },
  { id: 'greetings', name: 'Greetings', icon: '🦁', badgeColor: 'border-amber-500/60 text-amber-300' },
  { id: 'battle_cries', name: 'Battle Cries', icon: '⚡', badgeColor: 'border-orange-500/60 text-orange-300' },
  { id: 'blessings', name: 'Sanctuary & Luck', icon: '🌳', badgeColor: 'border-emerald-500/60 text-emerald-300' },
  { id: 'drama', name: 'Drought & Bad Luck', icon: '💀', badgeColor: 'border-red-500/60 text-red-300' },
  { id: 'camaraderie', name: 'Camaraderie', icon: '🤝', badgeColor: 'border-cyan-500/60 text-cyan-300' },
];

export const SAVANNAH_QUICK_PHRASES: SavannahQuickPhrase[] = [
  // 1. Greetings & Respect
  { id: 'p_greet_1', category: 'greetings', text: 'Jambo, fellow chieftain! 🦁', tag: 'Friendly' },
  { id: 'p_greet_2', category: 'greetings', text: 'May the ancestral spirits guide your dice! ✨', tag: 'Blessing' },
  { id: 'p_greet_3', category: 'greetings', text: 'Honor to your clan on this sacred ground! 🛡️', tag: 'Clan' },
  { id: 'p_greet_4', category: 'greetings', text: 'Welcome to the Serengeti waterhole! 🌿', tag: 'Welcome' },
  { id: 'p_greet_5', category: 'greetings', text: 'May the best predator prevail today! 👑', tag: 'Challenge' },

  // 2. Battle Cries & Predator Taunts
  { id: 'p_taunt_1', category: 'battle_cries', text: 'Hear the roar of the Lion! 🦁💥', tag: 'Roar' },
  { id: 'p_taunt_2', category: 'battle_cries', text: 'You tread too close to my territory! 🐾', tag: 'Territory' },
  { id: 'p_taunt_3', category: 'battle_cries', text: 'The cheetah cannot be outrun! ⚡', tag: 'Speed' },
  { id: 'p_taunt_4', category: 'battle_cries', text: 'Feel the thunder of the Elephant stomp! 🐘🌪️', tag: 'Stomp' },
  { id: 'p_taunt_5', category: 'battle_cries', text: 'Back to your clan yard, little gazelle! 🎯', tag: 'Ambush' },
  { id: 'p_taunt_6', category: 'battle_cries', text: 'My beast is hungry for captures! 🐆', tag: 'Hungry' },

  // 3. Sanctuary & Divine Luck
  { id: 'p_luck_1', category: 'blessings', text: 'The sacred Baobab shields my beasts! 🌳✨', tag: 'Safe' },
  { id: 'p_luck_2', category: 'blessings', text: 'By the Great Rift Valley, what a divine roll! 🎲🔥', tag: 'Lucky' },
  { id: 'p_luck_3', category: 'blessings', text: 'The oasis is within my grasp! 💧🏆', tag: 'Victory' },
  { id: 'p_luck_4', category: 'blessings', text: 'Ancestors, lend me your swift winds! 🌪️', tag: 'Magic' },
  { id: 'p_luck_5', category: 'blessings', text: 'Resting in the cool shade of the acacia! 🌿', tag: 'Calm' },

  // 4. Drought & Misfortune
  { id: 'p_drama_1', category: 'drama', text: 'A curse of the hyenas upon this roll! 💀', tag: 'Unlucky' },
  { id: 'p_drama_2', category: 'drama', text: 'The scorching drought took all my luck! ☀️', tag: 'Drought' },
  { id: 'p_drama_3', category: 'drama', text: 'Watch your step in the tall savannah grass! 🌾', tag: 'Warning' },
  { id: 'p_drama_4', category: 'drama', text: 'A treacherous ambush! Well played! 👏', tag: 'Ambushed' },
  { id: 'p_drama_5', category: 'drama', text: 'The sun will rise again for my clan! 🌅', tag: 'Hope' },

  // 5. Camaraderie & Sportsmanship
  { id: 'p_cam_1', category: 'camaraderie', text: 'A glorious tactical move, noble chieftain! 🤝', tag: 'Respect' },
  { id: 'p_cam_2', category: 'camaraderie', text: 'That was pure Savannah magic! 🪄', tag: 'Magic' },
  { id: 'p_cam_3', category: 'camaraderie', text: 'Good luck navigating the home stretch! 🏁', tag: 'Cheer' },
  { id: 'p_cam_4', category: 'camaraderie', text: 'Let us share the waterhole in peace! 💧', tag: 'Peace' },
];

export const SAVANNAH_EMOTE_PRESETS = [
  '🦁', '🐘', '🐆', '🦓', '🦒', '🦏', '🔥', '👑',
  '🌳', '⚡', '💧', '✨', '👏', '😱', '😂', '💀',
];
