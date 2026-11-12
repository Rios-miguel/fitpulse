import urllib.request
import json
import re
import unicodedata

def normalize_text(text):
    return ''.join(
        c for c in unicodedata.normalize('NFD', text)
        if unicodedata.category(c) != 'Mn'
    ).lower()

url = "https://raw.githubusercontent.com/marcelosanto/tabela_taco/master/TACO.json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

with urllib.request.urlopen(req) as resp:
    raw_content = resp.read().decode('utf-8-sig')
    taco_data = json.loads(raw_content)

print(f"Loaded {len(taco_data)} items from TACO.")

def parse_num(val):
    if val in ('NA', 'Tr', '', None):
        return 0.0
    try:
        f = float(val)
        return 0.0 if f < 0 else f
    except:
        return 0.0

# Dicionário de pesos médios para alimentos que frequentemente são consumidos por unidade
UNIT_WEIGHTS = {
    # Ovos
    r'ovo.*galinha.*inteiro': 50,
    r'ovo.*galinha.*clara': 30,
    r'ovo.*galinha.*gema': 20,
    r'ovo.*codorna': 10,
    
    # Frutas
    r'banana.*prata': 70,
    r'banana.*nanica': 85,
    r'banana.*maca': 65,
    r'maca.*fuji': 130,
    r'maca.*gala': 130,
    r'laranja.*pera': 130,
    r'laranja.*baia': 150,
    r'limao.*taiti': 80,
    r'tangerina': 100,
    r'pera.*williams': 140,
    r'pera.*portuguesa': 140,
    r'pessego': 110,
    r'ameixa': 45,
    r'kiwi': 75,
    
    # Pães
    r'pao.*frances': 50,
    r'pao.*forma.*integral': 25,
    r'pao.*forma.*tradicional': 25,
    r'pao.*queijo': 30,
    
    # Castanhas
    r'castanha-do-brasil': 4,
    r'castanha.*caju': 2.5,
    r'noz.*crua': 4,
}

LIQUID_CATEGORIES = [
    'Bebidas (alcoólicas e não alcoólicas)'
]

processed_foods = []

for item in taco_data:
    taco_id = item.get('id')
    desc = item.get('description', '').strip()
    category = item.get('category', '').strip()

    energy_kcal = round(parse_num(item.get('energy_kcal')), 1)
    protein = round(parse_num(item.get('protein_g')), 1)
    carbs = round(parse_num(item.get('carbohydrate_g')), 1)
    fat = round(parse_num(item.get('lipid_g')), 1)
    fiber = round(parse_num(item.get('fiber_g')), 1)

    # Determinar tipo de porção
    norm_desc = normalize_text(desc)
    norm_cat = normalize_text(category)

    # Checar se é líquido
    is_liquid = (category in LIQUID_CATEGORIES) or ('leite' in norm_desc and 'po' not in norm_desc) or ('suco' in norm_desc) or ('azeite' in norm_desc) or ('oleo' in norm_desc)

    portion_type = '100ml' if is_liquid else '100g'
    portion_weight = None

    # Checar se tem unidade conhecida
    for pattern, weight in UNIT_WEIGHTS.items():
        if re.search(pattern, norm_desc):
            portion_weight = weight
            break

    # Categorias simplificadas para o usuário
    clean_cat = "Outros"
    if "carne" in norm_cat:
        clean_cat = "Carnes e Aves"
    elif "pescado" in norm_cat:
        clean_cat = "Peixes e Frutos do Mar"
    elif "cereal" in norm_cat or "farinha" in norm_desc or "arroz" in norm_desc or "macarrao" in norm_desc:
        clean_cat = "Cereais e Pães"
    elif "leguminosa" in norm_cat or "feijao" in norm_desc or "soja" in norm_desc or "lentilha" in norm_desc:
        clean_cat = "Feijões e Leguminosas"
    elif "fruta" in norm_cat:
        clean_cat = "Frutas"
    elif "verdura" in norm_cat or "hortalica" in norm_cat:
        clean_cat = "Verduras e Legumes"
    elif "ovo" in norm_cat or "ovo" in norm_desc:
        clean_cat = "Ovos"
    elif "leite" in norm_cat or "queijo" in norm_desc or "iogurte" in norm_desc:
        clean_cat = "Laticínios"
    elif "bebida" in norm_cat:
        clean_cat = "Bebidas"
    elif "gordura" in norm_cat or "oleo" in norm_cat:
        clean_cat = "Óleos e Gorduras"
    elif "noz" in norm_cat or "semente" in norm_cat or "castanha" in norm_desc:
        clean_cat = "Castanhas e Sementes"
    elif "preparado" in norm_cat:
        clean_cat = "Pratos Preparados"

    food_entry = {
        "id": f"taco_{taco_id}",
        "name": desc,
        "category": clean_cat,
        "portionType": portion_type,
        "calories": energy_kcal,
        "protein": protein,
        "carbs": carbs,
        "fat": fat,
        "fiber": fiber,
        "source": "TACO / UNICAMP (4ª Edição)",
        "tacoId": taco_id
    }

    if portion_weight:
        food_entry["portionWeight"] = portion_weight
        food_entry["hasUnitOption"] = True

    processed_foods.append(food_entry)

# Adicionar suplementos fitness populares com base em rótulos nutricionais certificados pela ANVISA
fitness_staples = [
    {
        "id": "supp_whey_concentrado_80",
        "name": "Whey Protein Concentrado 80%",
        "category": "Suplementos",
        "portionType": "100g",
        "calories": 400.0,
        "protein": 80.0,
        "carbs": 8.0,
        "fat": 6.0,
        "fiber": 0.0,
        "source": "Rótulo Padrão ANVISA (Concentrado 80%)",
        "notes": "1 scoop médio de 30g contém 24g de proteína e 120 kcal"
    },
    {
        "id": "supp_whey_isolado_90",
        "name": "Whey Protein Isolado 90%",
        "category": "Suplementos",
        "portionType": "100g",
        "calories": 365.0,
        "protein": 90.0,
        "carbs": 1.5,
        "fat": 0.5,
        "fiber": 0.0,
        "source": "Rótulo Padrão ANVISA (Isolado 90%)",
        "notes": "Zero ou baixíssimo carboidrato e lactose"
    },
    {
        "id": "supp_creatina_monohidratada",
        "name": "Creatina Monohidratada 100% Pura",
        "category": "Suplementos",
        "portionType": "100g",
        "calories": 0.0,
        "protein": 0.0,
        "carbs": 0.0,
        "fat": 0.0,
        "fiber": 0.0,
        "source": "Rótulo Padrão ANVISA",
        "notes": "Dose diária usual: 3g a 5g"
    },
    {
        "id": "supp_pasta_amendoim_integral",
        "name": "Pasta de Amendoim 100% Integral",
        "category": "Castanhas e Sementes",
        "portionType": "100g",
        "calories": 588.0,
        "protein": 25.0,
        "carbs": 20.0,
        "fat": 50.0,
        "fiber": 8.0,
        "source": "Rótulo Padrão ANVISA (Sem açúcar)",
        "notes": "1 colher de sopa (~15g) contém ~88 kcal"
    }
]

processed_foods.extend(fitness_staples)

print(f"Total processed foods: {len(processed_foods)}")

with open("taco_database.json", "w", encoding="utf-8") as f:
    json.dump(processed_foods, f, ensure_ascii=False, indent=2)

print("Saved taco_database.json successfully.")
