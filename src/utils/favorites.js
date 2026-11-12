const FAVORITES_STORAGE_KEY = 'fitpulse_favorite_food_ids_v1';

// Alimentos populares pré-favoritados para primeira experiência agradável
const DEFAULT_INITIAL_FAVORITES = [
  'taco_frango_peito_grelhado',
  'taco_arroz_tipo1_cozido',
  'taco_feijao_carioca_cozido',
  'taco_ovo_galinha_cozido',
  'taco_banana_prata_crua',
  'rec_shake_whey_banana_pasta',
  'rec_pao_com_ovo_1'
];

export function getFavoriteFoodIds() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_FAVORITES));
      return DEFAULT_INITIAL_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_INITIAL_FAVORITES;
  } catch (e) {
    return DEFAULT_INITIAL_FAVORITES;
  }
}

export function toggleFavoriteFoodId(foodId) {
  if (!foodId) return getFavoriteFoodIds();
  try {
    const current = getFavoriteFoodIds();
    let updated;
    if (current.includes(foodId)) {
      updated = current.filter((id) => id !== foodId);
    } else {
      updated = [foodId, ...current];
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    // Dispara evento customizado para sincronizar componentes na mesma tela
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fitpulse_favorites_changed', { detail: updated }));
    }
    return updated;
  } catch (e) {
    return [];
  }
}

export function isFoodFavorite(foodId) {
  return getFavoriteFoodIds().includes(foodId);
}
