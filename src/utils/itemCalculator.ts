import { Thread, ItemCount, GearPreset } from '../types';

export const calculateItemTotals = (thread: Thread): ItemCount => {
  const itemCounts: ItemCount = {};

  const addItems = (gear: GearPreset) => {
    Object.values(gear).forEach(item => {
      if (item && item.trim()) {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      }
    });
  };

  Object.values(thread.roles).forEach(players => {
    players.forEach(player => {
      addItems(player.selectedGear);
    });
  });

  return itemCounts;
};

export const getTierLimitedGear = (fullGear: GearPreset, tier: number): GearPreset => {
  if (tier === 0 || tier === 1) {
    return {
      weapon: fullGear.weapon,
      armor: fullGear.armor,
      headgear: '',
      boots: '',
      ...(fullGear.offhand && { offhand: fullGear.offhand })
    };
  }
  return fullGear;
};