// ============================================================================
// BANCO OFICIAL DE EXERCÍCIOS & COMPÊNDIO DE ATIVIDADES FÍSICAS (2024)
// Fonte: 2024 Adult Compendium of Physical Activities (Ainsworth et al.)
// Journal of Sport and Health Science / Stanford University & University of South Carolina
// Fórmula: Calorias = MET * Peso (kg) * (Duração em minutos / 60)
// ============================================================================

export const COMPENDIUM_EXERCISES = [
  // --- CONDICIONAMENTO & MUSCULAÇÃO (CÓDIGO COMPÊNDIO 02xxx) ---
  {
    id: "ex_musculacao_vigorosa",
    code: "02054",
    name: "Musculação Intensa / Hipertrofia Pesada",
    category: "Musculação & Força",
    met: 6.0,
    intensity: "Vigorosa",
    notes: "Treino com pesos livres/máquinas, séries pesadas com esforço intenso",
    isStrength: true,
    defaultDuration: 50
  },
  {
    id: "ex_musculacao_moderada",
    code: "02052",
    name: "Musculação Geral / Esforço Moderado",
    category: "Musculação & Força",
    met: 3.5,
    intensity: "Moderada",
    notes: "Treino de força tradicional com intervalos regulares",
    isStrength: true,
    defaultDuration: 45
  },
  {
    id: "ex_circuito_hiit",
    code: "02055",
    name: "Treino em Circuito / Funcional / HIIT",
    category: "Funcional & HIIT",
    met: 8.0,
    intensity: "Vigorosa",
    notes: "Exercícios contínuos com peso corporal e pesos com pouco descanso",
    isStrength: true,
    defaultDuration: 30
  },
  {
    id: "ex_calistenia_vigorosa",
    code: "02022",
    name: "Calistenia Intensa (Flexões, Barras, Paralelas)",
    category: "Musculação & Força",
    met: 8.0,
    intensity: "Vigorosa",
    notes: "Exercícios com peso corporal em ritmo puxado",
    isStrength: true,
    defaultDuration: 40
  },
  {
    id: "ex_calistenia_moderada",
    code: "02020",
    name: "Calistenia Leve / Moderada (Abdominais, Polichinelos)",
    category: "Funcional & HIIT",
    met: 3.8,
    intensity: "Moderada",
    notes: "Esforço moderado de ginástica localizada",
    isStrength: true,
    defaultDuration: 30
  },
  {
    id: "ex_powerlifting",
    code: "02056",
    name: "Powerlifting / Levantamento de Peso Olímpico",
    category: "Musculação & Força",
    met: 6.0,
    intensity: "Vigorosa",
    notes: "Squat, Bench Press, Deadlift com cargas elevadas",
    isStrength: true,
    defaultDuration: 60
  },

  // --- CORRIDA (CÓDIGO COMPÊNDIO 12xxx) ---
  {
    id: "ex_corrida_trote_8km",
    code: "12030",
    name: "Corrida Leve / Trote (8 km/h)",
    category: "Corrida & Pista",
    met: 8.3,
    intensity: "Vigorosa",
    notes: "Pace aproximado de 7:30 min/km",
    isStrength: false,
    defaultDuration: 30
  },
  {
    id: "ex_corrida_moderada_10km",
    code: "12050",
    name: "Corrida Moderada (10 km/h)",
    category: "Corrida & Pista",
    met: 9.8,
    intensity: "Vigorosa",
    notes: "Pace aproximado de 6:00 min/km",
    isStrength: false,
    defaultDuration: 30
  },
  {
    id: "ex_corrida_rapida_12km",
    code: "12070",
    name: "Corrida Rápida (12 km/h)",
    category: "Corrida & Pista",
    met: 11.5,
    intensity: "Vigorosa",
    notes: "Pace aproximado de 5:00 min/km",
    isStrength: false,
    defaultDuration: 30
  },
  {
    id: "ex_tiros_sprint",
    code: "12130",
    name: "Tiros de Velocidade / Sprint Intervalado",
    category: "Corrida & Pista",
    met: 14.5,
    intensity: "Muito Vigorosa",
    notes: "Sprints em velocidade máxima com recuperação",
    isStrength: false,
    defaultDuration: 20
  },
  {
    id: "ex_esteira_inclinada",
    code: "12140",
    name: "Corrida em Esteira com Inclinação",
    category: "Corrida & Pista",
    met: 10.5,
    intensity: "Vigorosa",
    notes: "Inclinação de 5% a 10%",
    isStrength: false,
    defaultDuration: 30
  },

  // --- CAMINHADA (CÓDIGO COMPÊNDIO 17xxx) ---
  {
    id: "ex_caminhada_moderada_5km",
    code: "17190",
    name: "Caminhada em Ritmo Firme (5 km/h)",
    category: "Caminhada & Esteira",
    met: 3.5,
    intensity: "Moderada",
    notes: "Caminhada contínua em superfície plana",
    isStrength: false,
    defaultDuration: 45
  },
  {
    id: "ex_caminhada_rapida_6km",
    code: "17200",
    name: "Caminhada Rápida / Esteira Inclinada (6 km/h)",
    category: "Caminhada & Esteira",
    met: 5.0,
    intensity: "Moderada",
    notes: "Passo acelerado ou caminhada com inclinação",
    isStrength: false,
    defaultDuration: 40
  },
  {
    id: "ex_escada_ergometrica",
    code: "17130",
    name: "Simulador de Escada (StairMaster / Stepper)",
    category: "Caminhada & Esteira",
    met: 9.0,
    intensity: "Vigorosa",
    notes: "Subir degraus de forma contínua",
    isStrength: false,
    defaultDuration: 20
  },
  {
    id: "ex_eliptico",
    code: "02065",
    name: "Elíptico / Transport (Esforço Moderado)",
    category: "Caminhada & Esteira",
    met: 5.0,
    intensity: "Moderada",
    notes: "Exercício aeróbico de baixo impacto",
    isStrength: false,
    defaultDuration: 30
  },

  // --- CICLISMO (CÓDIGO COMPÊNDIO 01xxx) ---
  {
    id: "ex_bike_ergometrica_moderada",
    code: "01015",
    name: "Bicicleta Ergométrica (Ritmo Moderado, 100W)",
    category: "Ciclismo",
    met: 6.8,
    intensity: "Moderada a Vigorosa",
    notes: "Resistência média na academia ou em casa",
    isStrength: false,
    defaultDuration: 30
  },
  {
    id: "ex_spinning_vigoroso",
    code: "01040",
    name: "Spinning / Ciclismo Indoor Intenso",
    category: "Ciclismo",
    met: 8.5,
    intensity: "Vigorosa",
    notes: "Aula de spinning com variações de carga e giros rápidos",
    isStrength: false,
    defaultDuration: 45
  },
  {
    id: "ex_ciclismo_rua_moderado",
    code: "01020",
    name: "Ciclismo ao Ar Livre (15 a 20 km/h)",
    category: "Ciclismo",
    met: 6.0,
    intensity: "Moderada",
    notes: "Passeio em ritmo moderado",
    isStrength: false,
    defaultDuration: 60
  },
  {
    id: "ex_ciclismo_rua_rapido",
    code: "01030",
    name: "Ciclismo de Estrada Rápido (22 a 25 km/h)",
    category: "Ciclismo",
    met: 10.0,
    intensity: "Vigorosa",
    notes: "Treino de velocidade em estrada",
    isStrength: false,
    defaultDuration: 60
  },

  // --- NATAÇÃO & ÁGUA (CÓDIGO COMPÊNDIO 18xxx) ---
  {
    id: "ex_natacao_crawl_moderado",
    code: "18310",
    name: "Natação Crawl / Livre (Esforço Moderado)",
    category: "Natação & Água",
    met: 7.0,
    intensity: "Vigorosa",
    notes: "Natação contínua de média intensidade",
    isStrength: false,
    defaultDuration: 45
  },
  {
    id: "ex_natacao_crawl_vigoroso",
    code: "18320",
    name: "Natação Rápida / Treino Vigoroso",
    category: "Natação & Água",
    met: 9.8,
    intensity: "Vigorosa",
    notes: "Séries rápidas de crawl, borboleta ou costas",
    isStrength: false,
    defaultDuration: 45
  },
  {
    id: "ex_hidroginastica",
    code: "18355",
    name: "Hidroginástica",
    category: "Natação & Água",
    met: 5.3,
    intensity: "Moderada",
    notes: "Exercícios calistênicos na água",
    isStrength: false,
    defaultDuration: 50
  },

  // --- ARTES MARCIAIS & LUTAS (CÓDIGO COMPÊNDIO 15xxx) ---
  {
    id: "ex_jiujitsu",
    code: "15430",
    name: "Jiu-Jitsu / Judô / Wrestling (Treino e Luta)",
    category: "Lutas & Artes Marciais",
    met: 10.2,
    intensity: "Muito Vigorosa",
    notes: "Combate no solo com pegadas e transições contínuas",
    isStrength: true,
    defaultDuration: 60
  },
  {
    id: "ex_muay_thai_boxe",
    code: "15420",
    name: "Muay Thai / Kickboxing / Boxe (Treino Completo)",
    category: "Lutas & Artes Marciais",
    met: 10.0,
    intensity: "Muito Vigorosa",
    notes: "Aquecimento, combinações na manopla e chutes",
    isStrength: true,
    defaultDuration: 60
  },
  {
    id: "ex_boxe_saco",
    code: "15425",
    name: "Boxe no Saco de Pancadas (Heavy Bag)",
    category: "Lutas & Artes Marciais",
    met: 6.0,
    intensity: "Moderada a Vigorosa",
    notes: "Rounds de socos contínuos no saco de boxe",
    isStrength: true,
    defaultDuration: 30
  },

  // --- ESPORTES COLETIVOS & RAQUETE (CÓDIGO COMPÊNDIO 15xxx) ---
  {
    id: "ex_futebol_campo",
    code: "15300",
    name: "Futebol de Campo / Society",
    category: "Esportes & Raquete",
    met: 7.5,
    intensity: "Vigorosa",
    notes: "Partida com trotes e sprints intermitentes",
    isStrength: false,
    defaultDuration: 60
  },
  {
    id: "ex_futsal",
    code: "15310",
    name: "Futsal / Futebol de Salão",
    category: "Esportes & Raquete",
    met: 8.5,
    intensity: "Vigorosa",
    notes: "Jogo rápido em quadra com alta frequência de corrida",
    isStrength: false,
    defaultDuration: 50
  },
  {
    id: "ex_basquete",
    code: "15050",
    name: "Basquete (Jogo Completo)",
    category: "Esportes & Raquete",
    met: 8.0,
    intensity: "Vigorosa",
    notes: "Saltos, sprints e movimentação lateral constante",
    isStrength: false,
    defaultDuration: 60
  },
  {
    id: "ex_volei",
    code: "15710",
    name: "Vôlei de Quadra / Areia",
    category: "Esportes & Raquete",
    met: 6.0,
    intensity: "Moderada a Vigorosa",
    notes: "Saltos e bloqueios",
    isStrength: false,
    defaultDuration: 60
  },
  {
    id: "ex_beach_tennis",
    code: "15675",
    name: "Beach Tennis / Tênis de Praia",
    category: "Esportes & Raquete",
    met: 7.3,
    intensity: "Vigorosa",
    notes: "Movimentação rápida na areia fofa",
    isStrength: false,
    defaultDuration: 60
  },
  {
    id: "ex_pular_corda",
    code: "02080",
    name: "Pular Corda (Ritmo Moderado a Rápido)",
    category: "Funcional & HIIT",
    met: 11.0,
    intensity: "Vigorosa",
    notes: "100 a 120 saltos por minuto",
    isStrength: false,
    defaultDuration: 15
  },

  // --- MENTE-CORPO & ALONGAMENTO (CÓDIGO COMPÊNDIO 02xxx) ---
  {
    id: "ex_pilates",
    code: "02105",
    name: "Pilates (Solo / Mat ou Aparelhos)",
    category: "Mente & Alongamento",
    met: 3.5,
    intensity: "Moderada",
    notes: "Trabalho de core, estabilização e respiração",
    isStrength: true,
    defaultDuration: 50
  },
  {
    id: "ex_yoga_hatha",
    code: "02150",
    name: "Yoga Tradicional (Hatha / Vinyasa)",
    category: "Mente & Alongamento",
    met: 3.0,
    intensity: "Moderada",
    notes: "Posturas, equilíbrio e controle motor",
    isStrength: false,
    defaultDuration: 60
  },
  {
    id: "ex_yoga_power",
    code: "02152",
    name: "Power Yoga / Ashtanga Intenso",
    category: "Mente & Alongamento",
    met: 4.0,
    intensity: "Moderada",
    notes: "Transições vigorosas com esforço muscular",
    isStrength: true,
    defaultDuration: 50
  },
  {
    id: "ex_alongamento_estatico",
    code: "02110",
    name: "Alongamento Estático & Flexibilidade",
    category: "Mente & Alongamento",
    met: 2.5,
    intensity: "Leve",
    notes: "Exercícios suaves de mobilidade articular",
    isStrength: false,
    defaultDuration: 20
  }
];

/**
 * Normaliza texto para busca rápida e sem acentuação
 */
export function normalizeExerciseText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Busca no compêndio oficial de exercícios por palavra-chave e categoria
 */
export function searchExercises(query = '', category = 'all') {
  const normQuery = normalizeExerciseText(query);
  const words = normQuery.split(/\s+/).filter(Boolean);

  return COMPENDIUM_EXERCISES.filter(ex => {
    const normName = normalizeExerciseText(ex.name);
    const normCat = normalizeExerciseText(ex.category);
    const normNotes = normalizeExerciseText(ex.notes);

    const matchesQuery = words.length === 0 || words.every(w => 
      normName.includes(w) || normCat.includes(w) || normNotes.includes(w)
    );
    const matchesCat = category === 'all' || ex.category === category;

    return matchesQuery && matchesCat;
  });
}

/**
 * Calcula as calorias gastas com base no MET do Compêndio Oficial e no peso do usuário
 * @param {number} met - Equivalente Metabólico da Tarefa (ex: 6.0 para musculação pesada, 9.8 para corrida 10km/h)
 * @param {number} userWeightKg - Peso do usuário em kg (padrão: 75kg se não informado)
 * @param {number} durationMinutes - Duração do exercício em minutos
 * @returns {number} Calorias gastas (kcal)
 */
export function calculateExerciseCalories(met, userWeightKg = 75, durationMinutes = 30) {
  if (!met || isNaN(met) || isNaN(userWeightKg) || isNaN(durationMinutes)) {
    return 0;
  }
  const weight = Math.max(30, Math.min(250, userWeightKg));
  const duration = Math.max(1, durationMinutes);

  // Fórmula oficial: MET * kg * (minutos / 60)
  const calories = met * weight * (duration / 60);
  return Math.round(calories);
}
