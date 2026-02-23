import { writable } from "svelte/store";

// Store the currently active card's ID
export const activeCardId = writable(null);

// Store the selected rarity override for the active card
export const rarityOverride = writable("");
