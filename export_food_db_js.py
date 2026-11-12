import json

with open("taco_database.json", "r", encoding="utf-8") as f:
    foods = json.load(f)

js_content = f"""// ============================================================================
// BANCO OFICIAL DE ALIMENTOS - TACO (UNICAMP 4ª EDIÇÃO) & ANVISA
// Fonte: Tabela Brasileira de Composição de Alimentos - NEPA/UNICAMP
// Total de itens oficiais: {len(foods)}
// ============================================================================

export const TACO_OFFICIAL_DATABASE = {json.dumps(foods, ensure_ascii=False, indent=2)};

/**
 * Remove acentuação e converte para minúsculas para busca sem atrito
 * @param {{string}} str 
 * @returns {{string}}
 */
export function normalizeText(str) {{
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .trim();
}}

/**
 * Realiza busca inteligente e filtragem no banco de alimentos
 * @param {{Array}} db - Lista de alimentos
 * @param {{string}} query - Texto digitado
 * @param {{string}} category - Categoria selecionada ou 'all'
 * @param {{string}} portionType - Tipo de porção ou 'all'
 * @returns {{Array}}
 */
export function searchFoodDatabase(db, query = '', category = 'all', portionType = 'all') {{
  const normQuery = normalizeText(query);
  const words = normQuery.split(/\\s+/).filter(Boolean);

  return db.filter(food => {{
    const normName = normalizeText(food.name);
    const normCat = normalizeText(food.category);

    // Deve conter todas as palavras da busca (busca AND)
    const matchesQuery = words.length === 0 || words.every(w => normName.includes(w) || normCat.includes(w));
    const matchesCat = category === 'all' || food.category === category;
    const matchesPortion = portionType === 'all' || food.portionType === portionType || (portionType === 'unidade' && food.hasUnitOption);

    return matchesQuery && matchesCat && matchesPortion;
  }});
}}

/**
 * Calcula os valores nutricionais de acordo com a porção consumida
 * @param {{Object}} food - Alimento selecionado
 * @param {{number}} quantity - Quantidade consumida
 * @param {{string}} unitMode - 'g', 'ml', ou 'unidade'
 * @returns {{Object}} {{ calories, protein, carbs, fat, fiber }}
 */
export function calculateNutritionalValues(food, quantity, unitMode = null) {{
  if (!food || isNaN(quantity) || quantity <= 0) {{
    return {{ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }};
  }}

  let factor = 1;
  const mode = unitMode || (food.portionType === '100ml' ? 'ml' : (food.portionType === 'unidade' ? 'unidade' : 'g'));

  if (mode === 'unidade') {{
    if (food.portionType === 'unidade') {{
      factor = quantity;
    }} else if (food.portionWeight) {{
      // Ex: Ovo cozido é 100g no TACO, mas tem peso unitário de 50g
      factor = (quantity * food.portionWeight) / 100;
    }} else {{
      factor = quantity;
    }}
  }} else if (mode === 'g' || mode === 'ml') {{
    factor = quantity / 100;
  }}

  return {{
    calories: Math.round(food.calories * factor),
    protein: Number((food.protein * factor).toFixed(1)),
    carbs: Number((food.carbs * factor).toFixed(1)),
    fat: Number((food.fat * factor).toFixed(1)),
    fiber: Number(((food.fiber || 0) * factor).toFixed(1))
  }};
}}
"""

with open("food-db.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated food-db.js ({len(js_content)} chars)")
