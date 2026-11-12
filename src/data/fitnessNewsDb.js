/**
 * Banco de Notícias e Estudos Científicos sobre Fitness, Nutrição, Suplementação e Métodos Ótimos de Treino
 * Fontes: JISSN (Journal of the International Society of Sports Nutrition),
 * PubMed / Medline, ACSM (American College of Sports Medicine), BJSM (British Journal of Sports Medicine),
 * European Journal of Applied Physiology, JSCR (Journal of Strength and Conditioning Research).
 */

export const FITNESS_NEWS_CATEGORIES = [
  { id: 'all', label: 'Todas as Notícias' },
  { id: 'suplementos', label: 'Suplementos' },
  { id: 'treino', label: 'Treino Ótimo & Biomecânica' },
  { id: 'nutricao', label: 'Nutrição & Dieta' },
  { id: 'saude', label: 'Saúde & Fisiologia' }
];

export const FITNESS_NEWS_SHORTCUTS = [
  { label: 'Long-Length Partials (LLP)', query: 'long-length partials' },
  { label: 'Creatina + Carboidrato', query: 'creatina carbo' },
  { label: 'Cafeína Time-Release', query: 'time-release' },
  { label: 'Magnésio & Sono REM', query: 'magnésio sono' },
  { label: 'Ashwagandha KSM-66', query: 'ashwagandha' },
  { label: 'Volume Semanal Ótimo', query: 'volume semanal' },
  { label: 'RIR vs Falha Total', query: 'falha' },
  { label: 'Citrulina Malato', query: 'citrulina' },
  { label: 'Myo-Reps & Eficiência', query: 'myo-reps' },
  { label: 'Tart Cherry (Cereja Azeda)', query: 'tart cherry' },
  { label: 'Colágeno para Tendões', query: 'colágeno' },
  { label: 'Junk Volume (Volume Lixo)', query: 'junk volume' },
  { label: 'Suco de Beterraba (VO2)', query: 'beterraba' }
];

export const FITNESS_NEWS_ARTICLES = [
  // 1. Long-Length Partials
  {
    id: 'art_long_length_partials_hipertrofia',
    title: 'Repetições Parciais na Posição Alongada (LLPs): O Método que Superou a Amplitude Completa',
    subtitle: 'Meta-análise recente comprova que treinar apenas a metade inferior (esticada) do movimento gera ganhos hipertróficos superiores à repetição completa tradicional.',
    category: 'treino',
    categoryLabel: 'Treino Ótimo',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    readTime: '5 min',
    publishedDate: 'Nov 2024',
    source: 'Sports Medicine & Dr. Milo Wolf Meta-Analysis 2024',
    doi: '10.1007/s40279-023-01962-6',
    featured: true,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'hipertrofia', 'long-length partials', 'biomecânica', 'titina', 'tensão mecânica', 'alongamento'],
    summary: 'Pesquisadores compararam repetições completas com repetições parciais executadas exclusivamente na posição de máximo estiramento muscular. O grupo que enfatizou a porção alongada obteve maior espessura muscular e sarcômeros em série.',
    keyTakeaway: 'Quando você atingir a falha na amplitude completa (ex: puxada alta, rosca scott, cadeira extensora ou elevação lateral), continue fazendo mais 3 a 5 repetições parciais apenas na metade mais esticada. Isso extrai o estímulo de tensão mecânica máxima sem fadiga concêntrica prematura.',
    fullContent: `
Durante décadas, o ensinamento padrão da musculação foi: *"sempre utilize amplitude máxima de movimento (ROM completa)"*. No entanto, a recente linha de pesquisa liderada pelo Dr. Milo Wolf, Dr. Brad Schoenfeld e colegas trouxe uma nuance revolucionária baseada na hipertrofia mediada por estiramento.

### 1. A Comparação Científica
O estudo compilou dezenas de ensaios comparando três condições de treino:
- **Grupo 1:** Amplitude completa tradicional (ROM completa).
- **Grupo 2:** Repetições parciais na posição encurtada (ex: apenas a metade de cima da rosca bíceps).
- **Grupo 3:** Repetições parciais no comprimento alongado (LLPs - apenas a metade de baixo, onde o músculo está sob maior estiramento).

### 2. Os Resultados
- As parciais no comprimento alongado geraram hipertrofia **igual ou até 10-15% superior** à amplitude completa em músculos como quadríceps, bíceps, panturrilhas e posteriores.
- As parciais na posição encurtada foram notavelmente inferiores a todas as outras.

### 3. Por que isso acontece fisiologicamente?
Na porção esticada do sarcômero, a proteína molecular gigante **titina** é tracionada passivamente. Essa deformação mecânica combinada com pontes cruzadas ativas dispara a fosforilação da p70S6K e ativação direta da via anabólica mTORC1, estimulando a adição de sarcômeros em série (alongamento longitudinal das fibras).

### 4. Como aplicar nos treinos:
Você não precisa abandonar as repetições completas. A forma mais eficaz (o método *Integrated LLPs*) é realizar repetições completas normais até atingir a falha concêntrica. No momento em que não conseguir mais completar o movimento, execute mais 3 a 5 repetições parciais na parte baixa (esticada).
    `,
    practicalTips: [
      'Faça repetições completas até falhar na subida.',
      'Imediatamente faça 3 a 5 repetições parciais na porção mais alongada (fundo do movimento).',
      'Exercícios ideais para LLPs: Cadeira Extensora, Mesa Flexora, Puxada Aberta, Rosca no Banco Inclinado e Elevação Lateral no Cabo.'
    ]
  },

  // 2. Ashwagandha KSM-66
  {
    id: 'art_ashwagandha_cortisol_forca',
    title: 'Ashwagandha KSM-66: Redução de 28% no Cortisol e Ganho Comprovado de Força em Homens Treinados',
    subtitle: 'Ensaios clínicos randomizados duplo-cegos com extrato padronizado de Withania somnifera demonstram menor dano muscular pós-treino (CK) e recuperação acelerada.',
    category: 'suplementos',
    categoryLabel: 'Suplementos',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    readTime: '4 min',
    publishedDate: 'Nov 2024',
    source: 'Journal of the International Society of Sports Nutrition (JISSN)',
    doi: '10.1186/s12970-015-0104-9',
    featured: false,
    isCoreFocus: true,
    tags: ['body improvement', 'suplementos', 'ashwagandha', 'força', 'cortisol', 'testosterona', 'recuperação', 'sono'],
    summary: 'A Ashwagandha (especialmente o extrato patenteado KSM-66, padronizado em withanolídeos) atua no eixo HPA (hipotálamo-hipófise-adrenal), reduzindo o estresse crônico catabólico e promovendo ganhos de força superiores ao placebo.',
    keyTakeaway: 'Doses de 300mg a 600mg diários de KSM-66 auxiliam atletas com rotinas intensas de trabalho e treinos pesados, reduzindo o cortisol matinal e acelerando a recuperação de força no supino e leg press.',
    fullContent: `
A Ashwagandha (*Withania somnifera*) é uma raiz adaptógena amplamente utilizada na medicina ayurvédica que ganhou enorme respaldo na medicina esportiva contemporânea.

### 1. O Ensaio Clínico de Wankhede et al.
Em um estudo com 57 jovens submetidos a 8 semanas de musculação supervisionada:
- **Grupo Ashwagandha (300mg KSM-66 2x/dia):** Aumento médio de 46,0 kg no supino (1RM) vs 26,4 kg no grupo placebo.
- **Dano Muscular:** Aumento significativamente menor na creatina quinase sérica (CK), indicando menor quebra proteica destrutiva.
- **Níveis de Cortisol:** Queda de 28% nos níveis de cortisol sérico, com leve elevação na relação testosterona/cortisol (ambiente hormonal mais anabólico).

### 2. Efeito no Sono e Fadiga
Como o estresse psicológico e a insônia ativam o sistema nervoso simpático e sabotam a recuperação das miofibrilas, a modulação dos receptores GABAérgica promovida pelos withanolídeos facilita um sono profundo de maior qualidade.
    `,
    practicalTips: [
      'Utilize extrato padronizado (KSM-66 ou Sensoril) com 5% de withanolídeos.',
      'Dose recomendada: 300mg após o almoço e 300mg cerca de 1 hora antes de dormir (total 600mg/dia).',
      'Faça ciclos de 8 a 12 semanas de uso com 2 a 3 semanas de pausa para manter a sensibilidade dos receptores.'
    ]
  },

  // 3. Biomecânica de Cabos vs Halteres
  {
    id: 'art_biomecanica_cabos_curva_forca',
    title: 'Biomecânica do Deltoide: Por que a Elevação Lateral no Cabo com Altura no Quadril Supera os Halteres',
    subtitle: 'Análise vetorial de braço de momento: com halteres a tensão mecânica é zero no ponto esticado; no cabo ajustado na altura certa, a tensão é contínua e perfeita.',
    category: 'treino',
    categoryLabel: 'Treino Ótimo',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    readTime: '5 min',
    publishedDate: 'Out 2024',
    source: 'Journal of Biomechanics & Sports Science Applied Review',
    doi: '10.1016/j.jbiomech.2024.111894',
    featured: false,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'biomecânica', 'cabos', 'deltoide', 'ombro', 'curva de força', 'braço de momento', 'hipertrofia'],
    summary: 'A gravidade só puxa halteres estritamente para baixo (vetor vertical). Em contrapartida, cabos permitem alinhar a linha de resistência exatamente a 90 graus com o braço de momento do músculo na porção onde ele produz mais força e está alongado.',
    keyTakeaway: 'Posicione a polia do cross na altura do seu quadril ou joelho para elevações laterais. Dessa forma, você terá resistência máxima já no primeiro terço da subida, dobrando o estímulo hipertrófico do deltoide lateral.',
    fullContent: `
A hipertrofia ideal depende não apenas da carga que você levanta, mas de **onde na amplitude do movimento a carga é mais pesada** (o perfil de resistência) e como isso casa com a capacidade de geração de força do músculo (a curva de força).

### 1. A Falha dos Halteres na Elevação Lateral
- **No início do movimento (braço colado ao corpo):** O braço de momento perpendicular à linha da gravidade é praticamente ZERO. O deltoide lateral não sofre quase nenhuma tensão mecânica no ponto mais esticado.
- **A 90 graus de abdução (braço paralelo ao chão):** O braço de momento é máximo, exigindo o maior esforço exatamente quando o músculo está entrando em insuficiência ativa e encurtamento.

### 2. A Vantagem do Cabo Regulável
Ao usar um cabo:
- Se você posicionar a polia na **altura do quadril ou joelho**, a linha do cabo cruza o seu antebraço formando um ângulo reto (90°) logo no início e meio da elevação.
- Isso coloca a tensão máxima no meio do caminho e no ponto de estiramento relativo do deltoide lateral, gerando estímulo contínuo e sem pontos mortos.
    `,
    practicalTips: [
      'Ajuste o carrinho da polia na altura do joelho ou quadril.',
      'Passe o cabo por trás do corpo ou cruze pela frente segurando na bola de borracha (sem manopla) para maior alinhamento articular.',
      'Mantenha o braço ligeiramente inclinado 15° para frente (no plano escapular) para poupar o manguito rotador.'
    ]
  },

  // 4. Citrulina Malato
  {
    id: 'art_citrulina_malato_reps_finais',
    title: 'Citrulina Malato (6g a 8g): Aumento de até 53% em Repetições nas Séries Tardias',
    subtitle: 'Mito da L-Arginina superado: a citrulina eleva a arginina sérica com 2x mais eficiência, acelerando a eliminação de amônia e lactato.',
    category: 'suplementos',
    categoryLabel: 'Suplementos',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    readTime: '3 min',
    publishedDate: 'Nov 2024',
    source: 'The Journal of Strength and Conditioning Research (JSCR)',
    doi: '10.1519/JSC.0b013e3181cb28d0',
    featured: false,
    isCoreFocus: true,
    tags: ['suplementos', 'body improvement', 'citrulina', 'pump', 'fadiga', 'resistência', 'força'],
    summary: 'A suplementação com 8g de Citrulina Malato (proporção 2:1) não serve apenas para congestão sanguínea ("pump"). Sua verdadeira função ergogênica é amortecer a acidose muscular e acelerar a reciclagem no ciclo da ureia durante séries consecutivas.',
    keyTakeaway: 'Ingerir 6g a 8g de citrulina malato cerca de 45 a 60 minutos antes do treino previne a queda brusca de repetições entre a 2ª, 3ª e 4ª séries de exercícios pesados.',
    fullContent: `
A citrulina é um aminoácido não essencial que contorna o metabolismo de primeira passagem hepático que destrói a maior parte da L-arginina comum.

### 1. O Estudo Clássico de Pérez-Guisado
Praticantes experientes realizaram 8 séries de supino com 80% de 1RM até a falha:
- Os atletas que tomaram 8g de citrulina malato conseguiram realizar **52,9% mais repetições acumuladas** na última série em comparação ao placebo.
- Registraram também uma redução de 40% nas dores musculares tardias (DOMS) 24 e 48 horas após a sessão.

### 2. O Papel do Malato
O malato (ácido málico) é um intermediário do ciclo de Krebs. Ele estimula a produção de piruvato e reduz o acúmulo de lactato e amônia tóxica, poupando glicogênio muscular.
    `,
    practicalTips: [
      'Tome 6g a 8g de Citrulina Malato (proporção 2:1) misturada em água 45 a 60 minutos antes do treino.',
      'Certifique-se de que o produto seja Citrulina Malato 2:1 e não L-Arginina barata (que sofre destruição hepática de até 70%).',
      'Não há necessidade de tomar em dias em que você não treina.'
    ]
  },

  // 5. Myo-Reps
  {
    id: 'art_myo_reps_eficiencia_tempo',
    title: 'Myo-Reps: Hipertrofia Idêntica em 1/3 do Tempo com o Conceito de Repetições Efetivas',
    subtitle: 'Como o protocolo desenvolvido pelo treinador norueguês Borge Fagerli economiza até 70% do tempo de treino mantendo o recrutamento de fibras tipo II.',
    category: 'treino',
    categoryLabel: 'Treino Ótimo',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    readTime: '4 min',
    publishedDate: 'Out 2024',
    source: 'Scandinavian Journal of Medicine & Science in Sports & Fagerli Method',
    doi: '10.1111/sms.13620',
    featured: false,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'myo-reps', 'hipertrofia', 'eficiência', 'repetições efetivas', 'fibras rápidas'],
    summary: 'Em uma série tradicional de 12 repetições, as primeiras 7 a 8 repetições servem quase unicamente para gerar fadiga preparatória. As repetições que realmente geram hipertrofia são as 4 a 5 últimas ("repetições efetivas"). O Myo-Reps mantém você nessa zona.',
    keyTakeaway: 'Faça uma série de ativação de 12-15 repetições até RIR 1. Descanse apenas 5 respirações profundas (15 segundos) e faça mini-séries de 3 a 4 repetições. Em 3 minutos você obtém o equivalente a 4 séries longas.',
    fullContent: `
Se você não tem 90 minutos para passar na academia, a ciência moderna do tempo de treino comprova que a técnica de rest-pause denominada **Myo-Reps** é uma das ferramentas mais eficientes já criadas.

### 1. O Conceito de Repetições Efetivas
Quando você pega uma carga de 12RM, nas primeiras repetições o esforço é baixo e o cérebro recruta principalmente fibras lentas tipo I. Somente quando essas se cansam é que o sistema nervoso convoca as fibras rápidas tipo IIx (responsáveis por 90% da hipertrofia).
Em vez de descansar 3 minutos, perder a ativação neural e ter que refazer todo o caminho de repetições "fáceis", o Myo-Reps mantém as fibras rápidas ativas por meio de pausas breves.

### 2. O Protocolo Myo-Reps Passo a Passo:
1. **Série de Ativação:** Escolha uma carga para 12 a 15 repetições. Execute até 1 repetição antes da falha (RIR 1).
2. **Micro-Pausa:** Guarde a carga ou solte a pegada por **5 respirações lentas e profundas** (cerca de 15 segundos).
3. **Mini-Série 1:** Faça de 3 a 4 repetições (todas elas serão "efetivas").
4. **Repita a micro-pausa** e faça outra mini-série.
5. **Critério de Parada:** Quando você não conseguir mais bater 3 repetições na mini-série, o exercício para aquele músculo está concluído.
    `,
    practicalTips: [
      'Ideal para máquinas, cabos e exercícios isoladores (ex: Cadeira Extensora, Rosca Bíceps, Tríceps Corda, Elevação Lateral).',
      'NUNCA use Myo-Reps em agachamento livre pesado ou levantamento terra, pelo risco de colapso postural na fadiga.',
      'Economiza até 20 minutos por treino com ganhos de massa magra equivalentes ao treino de alto volume tradicional.'
    ]
  },

  // 6. Tart Cherry
  {
    id: 'art_tart_cherry_recuperacao_muscular',
    title: 'Tart Cherry (Cereja Azeda Montmorency): O Suplemento Natural que Acelera a Força Isométrica em 48h',
    subtitle: 'Rica em antocianinas bioativas, reduz marcadores inflamatórios e dor tardia (DOMS) sem bloquear a síntese proteica como os anti-inflamatórios comuns.',
    category: 'suplementos',
    categoryLabel: 'Suplementos',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    readTime: '3 min',
    publishedDate: 'Nov 2024',
    source: 'British Journal of Sports Medicine (BJSM)',
    doi: '10.1136/bjsports-2023-107212',
    featured: false,
    isCoreFocus: false,
    tags: ['suplementos', 'recuperação', 'dor muscular', 'tart cherry', 'anti-inflamatório', 'saúde'],
    summary: 'Diferente de medicamentos como ibuprofeno ou diclofenaco (que inibem a enzima COX-2 e prejudicam a hipertrofia muscular), o extrato de cereja azeda atenua a peroxidação lipídica e acelera a volta da força máxima após treinos brutais.',
    keyTakeaway: 'Consumir 30ml de concentrado de cereja azeda ou 500mg de extrato em pó 2 vezes ao dia reduz a dor muscular severa pós-treino de perna e acelera a capacidade de treinar pesado novamente.',
    fullContent: `
A dor muscular de início tardio (DOMS) e o dano mecânico excêntrico costumam limitar a frequência com que um músculo pode ser treinado na semana.

### 1. O Problema dos Anti-inflamatórios Sintéticos (AINEs)
Muitos praticantes cometem o erro grave de tomar anti-inflamatórios após treinos extenuantes. Estudos comprovaram que AINEs suprimem a atividade das células satélite e cortam a síntese proteica pela metade.

### 2. A Solução com Fitoquímicos da Montmorency Cherry
A cereja Montmorency possui concentrações altíssimas de cianidina-3-glicosídeo e melatonina fitoterápica.
- Ensaios clínicos demonstraram retorno da força de pico **24 a 48 horas mais rápido** em maratonistas e praticantes de musculação pesada.
- Além do efeito muscular, melhora a eficiência do sono ao aumentar a melatonina urinária total em 15%.
    `,
    practicalTips: [
      'Ingira 30ml de concentrado de Tart Cherry puro ou 480mg de extrato em cápsula de manhã e antes de dormir.',
      'Excelente estratégia para semanas de pico de carga (overreaching planejado) ou competições esportivas.',
      'Substitui o uso perigoso de remédios anti-inflamatórios no alívio de dores musculares.'
    ]
  },

  // 7. Colágeno + Vitamina C para Tendões
  {
    id: 'art_colageno_vitamina_c_tendoes',
    title: 'Protocolo de Keith Baar: 15g de Colágeno + Vitamina C para Prevenção e Cura de Tendinopatias',
    subtitle: 'Pesquisas da UC Davis desmistificam o uso de colágeno: o segredo está no timing de ingestão combinado a 5 minutos de isometria prévia.',
    category: 'suplementos',
    categoryLabel: 'Suplementos',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    readTime: '4 min',
    publishedDate: 'Out 2024',
    source: 'The American Journal of Clinical Nutrition (AJCN) & Keith Baar Molecular Biology Lab',
    doi: '10.3945/ajcn.116.138594',
    featured: false,
    isCoreFocus: true,
    tags: ['suplementos', 'tendões', 'colágeno', 'prevenção de lesão', 'saúde articular', 'isometria'],
    summary: 'Colágeno tomado de forma genérica tem pouco efeito estético, mas tomado 45 a 60 minutos antes de um estímulo isométrico leve com Vitamina C dobra a síntese de procolágeno tipo I no tendão patelar e tendão de Aquiles.',
    keyTakeaway: 'Se você sente dores no joelho (tendão patelar), ombro (manguito) ou cotovelo (epicondilite), tome 15g de colágeno hidrolisado com 50mg de Vitamina C exatamente 1 hora antes de fazer 5 minutos de contrações isométricas leves.',
    fullContent: `
Tendões e ligamentos são tecidos avasculares (quase não recebem fluxo sanguíneo direto). Durante o repouso, aminoácidos não entram na matriz de colágeno tendínea.

### 1. A Descoberta Molecular de Keith Baar
O Dr. Keith Baar descobriu que o movimento articular e contrações isométricas funcionam como uma esponja mecânica:
- A compressão expulsa o fluido sinovial velho.
- O relaxamento pós-contração puxa o líquido rico em aminoácidos da corrente sanguínea para o núcleo do tendão.

### 2. A Janela de 45 a 60 Minutos
O pico de aminoácidos prolina, glicina e hidroxiprolina no plasma sanguíneo ocorre exatamente 60 minutos após a ingestão de colágeno hidrolisado ou gelatina enriquecida com ácido ascórbico (Vitamina C, cofator obrigatório da enzima prolil-hidroxilase).
    `,
    practicalTips: [
      'Dissolva 15g de peptídeos de colágeno hidrolisado (ou gelatina pura) com suco cítrico ou 50mg de Vitamina C.',
      'Tome 45 a 60 minutos antes de treinar ou de fazer sua rotina de fisioterapia/isometria.',
      'Faça contrações isométricas lentas de 30 a 45 segundos (ex: agachamento na parede para joelhos, ou sustentação isométrica de punho).'
    ]
  },

  // 8. Junk Volume
  {
    id: 'art_junk_volume_limite_series',
    title: 'Volume Lixo (Junk Volume): Por que Passar de 6 a 8 Séries por Treino Não Constrói Mais Músculo',
    subtitle: 'A curva de rendimentos decrescentes: distribuir 14 séries semanais em 2 treinos gera 30% mais hipertrofia do que 14 séries no mesmo dia.',
    category: 'treino',
    categoryLabel: 'Treino Ótimo',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    readTime: '4 min',
    publishedDate: 'Nov 2024',
    source: 'Sports Medicine Review & National Strength and Conditioning Association (NSCA)',
    doi: '10.1007/s40279-022-01654-7',
    featured: false,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'junk volume', 'volume semanal', 'hipertrofia', 'frequência', 'músculo'],
    summary: 'A síntese de proteínas musculares (MPS) satura após cerca de 6 a 8 séries intensas por grupo muscular na mesma sessão. Séries adicionais geram apenas fadiga central e dano que leva dias extras para ser reparado.',
    keyTakeaway: 'Em vez de fazer 16 séries de peito na segunda-feira, faça 8 séries na segunda e 8 séries na quinta. Dividir a frequência semanal mantém a qualidade mecânica das séries e previne o acúmulo de volume lixo.',
    fullContent: `
Muitos praticantes ainda acreditam que *"quanto mais séries eu fizer em um treino, mais o músculo vai crescer"*. No entanto, a fisiologia do estímulo-recuperação-adaptação segue uma curva em U invertido.

### 1. O Teto Anabólico por Sessão
Estudos com biópsias musculares mostram que:
- Da 1ª à 5ª série de um grupo muscular, o sinal anabólico cresce exponencialmente.
- Da 6ª à 8ª série, o ganho adicional é marginal.
- Da 9ª série em diante, o sinal de crescimento atinge platô, mas o dano estrutural às miofibrilas e a fadiga do sistema nervoso central continuam subindo vertiginosamente.

### 2. A Solução: Frequência Inteligente (Frequência 2x)
Ao dividir o volume semanal de um grupo muscular em duas sessões espaçadas por 72 horas:
- Você ativa a síntese proteica duas vezes na semana em vez de uma só.
- Você treina a segunda metade do volume com o músculo descansado, conseguindo usar 15% a 20% mais carga por repetição.
    `,
    practicalTips: [
      'Limite o volume por grupo muscular a 6-8 séries válidas (levadas próximo à falha) por sessão de treino.',
      'Treine cada músculo 2 vezes na semana (ex: rotinas Upper/Lower ou Push/Pull/Legs).',
      'Se o seu treino de pernas tem 18 séries, corte para 10 séries bem executadas e sinta a diferença na recuperação.'
    ]
  },

  // 9. Alongamento Inter-Séries
  {
    id: 'art_alongamento_inter_series_panturrilhas_peito',
    title: 'Alongamento Inter-Séries: O Estímulo que Acelerou o Ganho de Peitoral e Panturrilhas em 16%',
    subtitle: 'Manter o músculo sob alongamento passivo com carga durante 30 segundos no intervalo das séries recruta vias mecanossensíveis adicionais.',
    category: 'treino',
    categoryLabel: 'Treino Ótimo',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    readTime: '4 min',
    publishedDate: 'Out 2024',
    source: 'Journal of Strength and Conditioning Research (JSCR) & Brad Schoenfeld',
    doi: '10.1519/JSC.0000000000004123',
    featured: false,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'alongamento inter-séries', 'peitoral', 'panturrilha', 'hipertrofia', 'tensão'],
    summary: 'Pesquisadores aplicaram um alongamento moderado com carga nos primeiros 30 segundos do intervalo entre as séries de panturrilha e supino máquina. O grupo obteve ganhos de espessura muscular significativamente maiores do que o grupo com descanso passivo tradicional.',
    keyTakeaway: 'Após terminar uma série no leg press ou panturrilha em pé, não suba o peso: permaneça no ponto mais baixo (com calcanhar esticado) por 20 a 30 segundos antes de descansar o restante do minuto.',
    fullContent: `
O alongamento sob tensão mecânica (*inter-set loaded stretching*) é uma das técnicas mais avançadas para quebrar platôs em músculos notoriamente resistentes a crescer, como panturrilhas e peitorais.

### 1. Fisiologia do Estímulo
Quando uma carga é sustentada passivamente na posição esticada:
- Aumenta a permeabilidade da membrana das células musculares ao cálcio intracelular.
- Induz o alongamento dos filamentos de titina, que sinalizam a adição de novos sarcômeros em série.
- Provoca oclusão vascular temporária, elevando o estresse metabólico celular logo após a série.

### 2. Onde Funciona Melhor:
- **Panturrilhas:** No gêmeos sentado ou gêmeos em pé, termine a série e desça os calcanhares no degrau, sustentando o peso por 30 segundos.
- **Peitoral:** No crucifixo com halteres leves ou cabos, segure na abertura máxima por 20 segundos na última série.
- **Dorsais:** Na puxada frente, sustente o alongamento com os braços esticados para o alto no intervalo.
    `,
    practicalTips: [
      'Use apenas em 1 a 2 séries finais do exercício para não acumular fadiga excessiva no início.',
      'A carga do alongamento deve ser moderada (não force a articulação além do limite fisiológico seguro).',
      'Mantenha a sustentação entre 20 e 30 segundos, seguido de 60 a 90 segundos de repouso antes da próxima série.'
    ]
  },

  // 10. Beta-Alanina
  {
    id: 'art_beta_alanina_carnosina_formigamento',
    title: 'Beta-Alanina: O Mecanismo da Carnosina Muscular e Como Eliminar o Formigamento',
    subtitle: 'Aumento de 40% a 80% nos estoques de tampão de íons H+ para séries pesadas de 60 a 240 segundos sem o incômodo da parestesia.',
    category: 'suplementos',
    categoryLabel: 'Suplementos',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    readTime: '3 min',
    publishedDate: 'Nov 2024',
    source: 'Journal of the International Society of Sports Nutrition (JISSN)',
    doi: '10.1186/s12970-018-0224-7',
    featured: false,
    isCoreFocus: true,
    tags: ['suplementos', 'body improvement', 'beta-alanina', 'carnosina', 'fadiga', 'queimação', 'séries'],
    summary: 'A queimação muscular durante séries de altas repetições ou sprints decorre do acúmulo de íons hidrogênio (H+), que derrubam o pH intramuscular. A beta-alanina é o precursor limitante da carnosina, que neutraliza essa acidez.',
    keyTakeaway: 'Assim como a creatina, a beta-alanina funciona por saturação crônica (não é estimulante imediato). Fracionar a dose em 2 tomadas de 1,6g a 2g ao dia elimina o formigamento nos lábios e mãos garantindo 100% da saturação de carnosina.',
    fullContent: `
Muitos praticantes acreditam erroneamente que a sensação de formigamento (parestesia) provocada pela beta-alanina é o efeito pré-treino "batendo". Na realidade, o formigamento é apenas um efeito colateral inofensivo decorrente da ativação dos receptores sensitivos MrgprD na pele.

### 1. O Papel do Tampão de Carnosina
A carnosina é um dipeptídeo formado por L-histidina e beta-alanina concentrado nas fibras de contração rápida tipo II.
- Durante séries de 10 a 20 repetições ou treinos intervalados intensos, a quebra de ATP gera uma enxurrada de íons H+ que bloqueia a ligação do cálcio à troponina, causando a fadiga contrátil.
- Ao saturar a carnosina em 60%, a capacidade de suportar a queimação e realizar mais 2 a 3 repetições no final da série aumenta drasticamente.

### 2. Protocolo de Saturação sem Parestesia:
- Em vez de tomar 4g de uma vez em um pré-treino comercial (o que causa formigamento intenso):
- Tome **1,6g no café da manhã e 1,6g no almoço ou jantar** (total 3,2g/dia).
- Após 4 semanas, os níveis de carnosina intramuscular estarão saturados no valor máximo.
    `,
    practicalTips: [
      'Dose ideal: 3,2g a 4,8g por dia divididos em 2 doses de 1,6g.',
      'O efeito é cumulativo: deve ser tomada todos os dias, não apenas antes do treino.',
      'Excelente para modalidades de Crossfit, artes marciais, séries de altas repetições na musculação (12-20 reps) e corrida de média distância.'
    ]
  },

  // 11. Creatina
  {
    id: 'art_creatina_cognicao_forca',
    title: 'Creatina: Além dos Músculos, Novos Estudos Comprovam Benefícios Cognitivos e Neurais',
    subtitle: 'Revisão sistemática analisa dosagem ideal (3-5g/dia) e efeitos na memória de trabalho e fadiga mental sob privação de sono.',
    category: 'suplementos',
    categoryLabel: 'Suplementos',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    readTime: '4 min',
    publishedDate: 'Nov 2024',
    source: 'Journal of the International Society of Sports Nutrition (JISSN)',
    doi: '10.1080/15502783.2024.2319876',
    featured: false,
    isCoreFocus: true,
    tags: ['body improvement', 'suplementos', 'creatina', 'força', 'cognição', 'massa magra', 'ATP'],
    summary: 'A creatina monoidratada é o suplemento mais estudado do mundo esportivo, mas novas pesquisas demonstram que sua capacidade de repor ATP beneficia diretamente neurônios durante privação de sono e esforço mental.',
    keyTakeaway: 'O uso diário contínuo de 3 a 5g de creatina monoidratada dispensa fase de saturação e traz benefícios tanto para a potência muscular quanto para o foco mental em dias de estresse.',
    fullContent: `
A creatina monoidratada continua sendo o padrão ouro em suplementação ergogênica. No entanto, pesquisas recentes expandiram seu foco para além das fibras musculares esqueléticas.

### 1. Mecanismo Fisiológico
A fosfocreatina funciona como um doador imediato de grupos fosfato para ressintetizar trifosfato de adenosina (ATP) a partir de ADP. Embora 95% dos estoques corporais estejam nos músculos esqueléticos, os 5% restantes encontram-se no cérebro, rins e fígado.

### 2. Descobertas Recentes sobre o Cérebro
Ensaios clínicos randomizados duplo-cegos demonstraram que indivíduos sob estresse agudo, privação de sono ou vegetarianos (que consomem menos creatina pela dieta) apresentaram melhora de até 15% em testes de raciocínio lógico, memória operacional e menor fadiga subjetiva após 4 semanas de suplementação regular.

### 3. Saturação vs. Dose Diária
A metanálise confirmou que a tradicional fase de saturação (20g por dia divididos em 4 doses por 5 a 7 dias) é opcional:
- **Dose Diária Constante:** Tomar 3 a 5 gramas por dia todos os dias atinge a saturação muscular máxima em cerca de 21 a 28 dias, evitando possíveis desconfortos gastrointestinais.
- **Momento de Ingestão:** Tomar perto de uma refeição contendo carboidratos ou proteínas melhora ligeiramente a captação via liberação de insulina mediada pelo transportador SLC6A8.
    `,
    practicalTips: [
      'Ingira de 3 a 5g diariamente sem pausas (inclusive em dias de descanso).',
      'Consuma com água e uma fonte de carboidrato (ex: banana, arroz ou whey) para facilitar o transporte.',
      'Não há necessidade de ciclar ou pausar o uso.'
    ]
  },

  // 12. Hipertrofia Alongamento
  {
    id: 'art_hipertrofia_alongamento_tensao',
    title: 'Treinar em Posição Alongada Gera Até 2x Mais Hipertrofia do que na Posição Encurtada',
    subtitle: 'Estudos de biomecânica muscular provam que a tensão mecânica na fase mais esticada é o principal estímulo para síntese proteica.',
    category: 'treino',
    categoryLabel: 'Treino Ótimo',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    readTime: '5 min',
    publishedDate: 'Out 2024',
    source: 'European Journal of Sport Science & Sports Medicine',
    doi: '10.1007/s40279-024-02058-1',
    featured: false,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'hipertrofia', 'tensão mecânica', 'alongamento', 'biomecânica', 'músculo'],
    summary: 'A chamada "hipertrofia mediada por estiramento" comprova que controlar a fase excêntrica e enfatizar o ponto mais alongado de exercícios como tríceps, posteriores e peitoral acelera o ganho de massa magra.',
    keyTakeaway: 'Não encurte a amplitude no ponto mais difícil. Segurar 1 segundo na porção de máximo estiramento do músculo maximiza a tensão mecânica sarcoplasmática.',
    fullContent: `
Durante décadas discutiu-se se o "pump" ou a "tensão mecânica" eram os principais motores do crescimento muscular. A ciência atual aponta a tensão mecânica — especificamente quando o músculo está alongado — como o fator dominante.

### 1. O Papel da Proteína Titina
A titina atua como uma mola molecular. Quando o músculo se contrai na posição alongada, a titina se ativa e suporta cargas mecânicas passivas que ativam a via mTORC1 com muito maior intensidade.

### 2. Evidências em Exercícios Comuns
- **Tríceps:** O tríceps francês ou tríceps na polia alta com braço elevado gerou 40% mais hipertrofia na cabeça longa do que o tríceps pulley tradicional.
- **Panturrilhas:** Manter o calcanhar no ponto mais baixo do degrau por 1 a 2 segundos gerou ganhos superiores em comparação a repetições rápidas.
    `,
    practicalTips: [
      'Faça a descida (excêntrica) controlada em 2 a 3 segundos.',
      'Mantenha uma micro-pausa (1 segundo) na posição de maior alongamento.',
      'Priorize amplitude completa em vez de excesso de carga que force a encurtar o movimento.'
    ]
  },

  // 13. Beterraba & Nitrato
  {
    id: 'art_beterraba_nitrato_vo2',
    title: 'Suco de Beterraba e Nitrato Dietético: Aumento Real de 4% a 8% na Eficiência do Treino Aeróbico',
    subtitle: 'Nitrato natural é convertido em óxido nítrico, reduzindo o custo de oxigênio e postergando a exaustão.',
    category: 'nutricao',
    categoryLabel: 'Nutrição & Dieta',
    categoryColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    readTime: '3 min',
    publishedDate: 'Nov 2024',
    source: 'Medicine & Science in Sports & Exercise (ACSM)',
    doi: '10.1249/MSS.0000000000003290',
    featured: false,
    isCoreFocus: true,
    tags: ['dieta', 'nutrição', 'beterraba', 'nitrato', 'óxido nítrico', 'aeróbico', 'VO2'],
    summary: 'O nitrato inorgânico presente na beterraba, espinafre e rúcula atua na via nitrato-nitrito-óxido nítrico, melhorando a respiração mitocondrial e aumentando a tolerância ao esforço físico intenso.',
    keyTakeaway: 'Consumir 300ml de suco de beterraba 2 horas antes de uma corrida ou treino aeróbico intenso reduz o consumo de oxigênio submáximo e eleva a resistência.',
    fullContent: `
O nitrato dietético (NO3-) é um dos recursos ergogênicos naturais com mais alto nível de evidência (Grau A segundo o Comitê Olímpico Internacional).

### Como Funciona o Mecanismo:
1. Ao ingerir alimentos ricos em nitratos, bactérias anaeróbicas na língua reduzem o nitrato a nitrito (NO2-).
2. No estômago e corrente sanguínea, especialmente durante o exercício, o nitrito converte-se em óxido nítrico (NO).
3. O óxido nítrico promove vasodilatação endotelial e melhora a eficiência das mitocôndrias.
    `,
    practicalTips: [
      'Beba 250 a 300ml de suco de beterraba fresca cerca de 2 horas antes de atividades aeróbicas.',
      'Vegetais verde-escuros como rúcula e espinafre também são fontes excelentes de nitrato dietético.',
      'Evite enxaguantes bucais antibacterianos logo após consumir alimentos ricos em nitrato.'
    ]
  },

  // 14. Falha vs RIR
  {
    id: 'art_treino_ate_a_falha_vs_rir',
    title: 'Falha Total vs. 1-2 Repetições na Reserva (RIR): Qual Constrói Mais Músculo?',
    subtitle: 'Meta-análise com mais de 1.200 praticantes desmistifica o dogma do "no pain, no gain" sem comprometer a recuperação.',
    category: 'treino',
    categoryLabel: 'Treino Ótimo',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    readTime: '4 min',
    publishedDate: 'Out 2024',
    source: 'Sports Medicine Open & Brad Schoenfeld et al.',
    doi: '10.1186/s40798-024-00681-3',
    featured: false,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'rir', 'falha muscular', 'hipertrofia', 'fadiga central'],
    summary: 'Treinar com 1 a 2 repetições de reserva (RIR 1-2) proporciona hipertrofia praticamente idêntica à falha concêntrica absoluta, porém com redução de 40% na fadiga do sistema nervoso central e risco de lesão.',
    keyTakeaway: 'Reserve a falha concêntrica absoluta apenas para a última série de exercícios isoladores seguros. Em compostos pesados (como agachamento e supino), mantenha 1 a 2 reps na reserva.',
    fullContent: `
As fibras musculares tipo II são recrutadas quando a velocidade do movimento desacelera involuntariamente devido ao cansaço, o que acontece cerca de 3 a 5 repetições antes da falha.

### Conclusões do Estudo:
- Séries realizadas com RIR 1 ou 2 induzem a mesma sinalização de síntese proteica que a falha muscular completa.
- Ir até a falha verdadeira em todas as séries de agachamento gera fadiga neuromuscular desproporcional.
    `,
    practicalTips: [
      'Familiarize-se com a sensação real de estar a 1 ou 2 repetições da falha.',
      'Nos exercícios compostos livres (Supino, Agachamento, Levantamento Terra), deixe 1 a 2 reps na reserva.',
      'Sinta-se livre para buscar a falha apenas na última série de exercícios em máquinas ou isoladores.'
    ]
  },

  // 15. Cafeína
  {
    id: 'art_cafeina_timing_tolerancia',
    title: 'Cafeína Pré-Treino: Otimização de Timing, Dosagem (3 a 6mg/kg) e Como Evitar Tolerância',
    subtitle: 'Diretrizes oficiais da Sociedade Internacional de Nutrição Esportiva sobre pico plasmático e receptores de adenosina.',
    category: 'suplementos',
    categoryLabel: 'Suplementos',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    readTime: '3 min',
    publishedDate: 'Nov 2024',
    source: 'International Society of Sports Nutrition Position Stand',
    doi: '10.1186/s12970-020-00383-4',
    featured: false,
    isCoreFocus: true,
    tags: ['suplementos', 'cafeína', 'pré-treino', 'energia', 'foco', 'rendimento'],
    summary: 'A cafeína atua como antagonista competitivo dos receptores de adenosina no cérebro, reduzindo a percepção de esforço e aumentando a taxa de disparo neuronal e força submáxima.',
    keyTakeaway: 'A dosagem comprovada varia entre 3mg e 6mg por kg de peso corporal, ingerida 45 a 60 minutos antes do treino. Evite o consumo após as 16h para proteger o sono profundo.',
    fullContent: `
A cafeína é um dos poucos suplementos classificados pela WADA e ISSN com respaldo inequívoco para desempenho de força, potência e endurance aeróbica.
- O pico de concentração no sangue ocorre entre 45 e 60 minutos após a ingestão de cafeína anidra.
- Fazer pausas periódicas de 3 a 5 dias a cada 6-8 semanas restaura a sensibilidade aos receptores de adenosina.
    `,
    practicalTips: [
      'Calcule sua dose entre 3mg/kg e 5mg/kg de peso corporal.',
      'Tome entre 45 e 60 minutos antes de iniciar o aquecimento.',
      'Se treinar à noite, prefira treinar sem estimulantes para proteger o sono profundo.'
    ]
  },

  // 16. Sono e Cortisol
  {
    id: 'art_sono_cortisol_massa_magra',
    title: 'Privação de Sono Converte Perda de Gordura em Queima de Massa Muscular',
    subtitle: 'Estudo clínico de Chicago mostra que dormir 5h vs 8.5h reduziu a perda de gordura em 55% e aumentou o catabolismo muscular.',
    category: 'saude',
    categoryLabel: 'Saúde & Fisiologia',
    categoryColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    readTime: '4 min',
    publishedDate: 'Out 2024',
    source: 'Annals of Internal Medicine & Harvard Health',
    doi: '10.7326/0003-4819-153-7-201010050-00006',
    featured: false,
    isCoreFocus: true,
    tags: ['saúde', 'sono', 'cortisol', 'emagrecimento', 'gordura', 'catabolismo', 'body improvement'],
    summary: 'Mesmo mantendo o mesmo déficit calórico exato, participantes que dormiram menos perderam 55% menos gordura corporal e 60% mais massa livre de gordura (músculos).',
    keyTakeaway: 'Dormir entre 7 e 9 horas por noite é o principal ambiente metabólico para liberação de GH, síntese proteica e controle dos hormônios grelina e leptina.',
    fullContent: `
Durante as fases profundas do sono não-REM, ocorre a maior descarga de hormônio do crescimento (GH) e queda drástica de cortisol. Sem essa janela, o corpo entra em estado de estresse catabólico crônico.
    `,
    practicalTips: [
      'Priorize 7 a 9 horas de sono em um quarto escuro, silencioso e fresco.',
      'Desligue telas de luz azul pelo menos 45 minutos antes de deitar.',
      'Evite cafeína nas 6 horas que antecedem o horário de dormir.'
    ]
  },

  // 17. Ovos Inteiros
  {
    id: 'art_ovo_inteiro_vs_clara_sintese',
    title: 'Ovo Inteiro Supera a Clara Isolada em 42% na Síntese Proteica Pós-Treino',
    subtitle: 'Lipídios e micronutrientes da gema (colina, ferro, zinco) potencializam a absorção celular e sinalização anabólica.',
    category: 'nutricao',
    categoryLabel: 'Nutrição & Dieta',
    categoryColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    readTime: '3 min',
    publishedDate: 'Nov 2024',
    source: 'The American Journal of Clinical Nutrition (AJCN)',
    doi: '10.3945/ajcn.117.159855',
    featured: false,
    isCoreFocus: true,
    tags: ['dieta', 'nutrição', 'ovos', 'síntese proteica', 'body improvement', 'hipertrofia', 'proteína'],
    summary: 'Consumir 18 gramas de proteína de ovos inteiros pós-treino resultou em uma taxa de síntese proteica miofibrilar 42% maior do que consumir 18 gramas de proteína apenas de claras.',
    keyTakeaway: 'Não jogue as gemas fora: os fosfolipídios, a colina e os microelementos da gema aumentam a retenção de nitrogênio e a eficiência anabólica do ovo.',
    fullContent: `
A taxa fracionária de síntese de proteína miofibrilar foi 42% maior no grupo que consumiu ovos inteiros graças à matriz alimentar completa com fosfatidilcolina e micronutrientes lipossolúveis.
    `,
    practicalTips: [
      'Em dietas para hipertrofia ou manutenção, priorize ovos inteiros para aproveitar o valor biológico 100 da proteína.',
      'Caso precise controlar calorias em cutting profundo, combine 2 ovos inteiros com claras.',
      'O colesterol dietético do ovo tem impacto mínimo no perfil lipídico de praticantes de musculação.'
    ]
  },

  // 18. Cardio Concorrente
  {
    id: 'art_cardio_concorrente_massa_magra',
    title: 'Cardio Concorrente: Como Fazer Aeróbico Sem Prejudicar Seus Ganhos de Massa Magra',
    subtitle: 'Revisão da via molecular AMPK vs mTORC1 indica o espaçamento correto entre musculação e cardio.',
    category: 'treino',
    categoryLabel: 'Treino Ótimo',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    readTime: '4 min',
    publishedDate: 'Out 2024',
    source: 'Sports Medicine Review',
    doi: '10.1007/s40279-021-01587-8',
    featured: false,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'cardio', 'concorrente', 'massa magra', 'mTOR', 'aeróbico'],
    summary: 'Para evitar o efeito de interferência entre AMPK (cardio) e mTOR (hipertrofia), separe o aeróbico da musculação por pelo menos 6 horas ou execute o cardio com intensidade moderada (Zona 2) após o treino de força.',
    keyTakeaway: 'Ciclismo e caminhada inclinada em intensidade de Zona 2 geram baixo dano muscular excêntrico e aceleram a recuperação entre séries sem cansar o sistema neuromuscular.',
    fullContent: `
Sempre dê prioridade ao treino de musculação primeiro quando o objetivo principal for hipertrofia. Se puder, separe as sessões intensas de cardio por pelo menos 6 horas da sessão de força.
    `,
    practicalTips: [
      'Sempre dê prioridade ao treino de força no início da sessão.',
      'Prefira cardio de intensidade moderada (Zona 2) se for treinar na mesma sessão.',
      'Ciclismo ou esteira inclinada têm menor impacto excêntrico do que corrida em asfalto.'
    ]
  },

  // 19. Creatina com Carboidrato e Sódio
  {
    id: 'art_creatina_carbo_transporte_insulina',
    title: 'Creatina + Carboidrato: Como a Insulina Aumenta em até 15% a Retenção Intramuscular de Fosfocreatina',
    subtitle: 'Estudos da JISSN revelam que o co-transporte mediado por sódio e insulina (SLC6A8) acelera a saturação muscular e reduz a perda de creatina pela urina.',
    category: 'suplementos',
    categoryLabel: 'Suplementos',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    readTime: '4 min',
    publishedDate: '2024',
    source: 'Journal of the International Society of Sports Nutrition (JISSN)',
    doi: '10.1186/s12970-017-0173-z',
    featured: true,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'creatina', 'carboidrato', 'insulina', 'suplementos', 'força'],
    summary: 'A ingestão de creatina monoidratada acompanhada de 30g a 50g de carboidratos de absorção rápida (ou carboidrato + proteína) ativa o transportador CreaT via cascata de insulina, maximizando o acúmulo de fosfocreatina nas fibras tipo II.',
    keyTakeaway: 'Tome sua dose diária de creatina (3g a 5g) junto de uma refeição contendo carboidratos (ex: almoço com arroz/feijão ou shake pós-treino com banana e whey), em vez de tomar em jejum com água.',
    fullContent: `
A creatina monoidratada é o suplemento ergogênico mais estudado da história. No entanto, muitos atletas ainda a consomem em jejum apenas com água.

### 1. O Transportador CreaT (SLC6A8)
A captação de creatina pelas células do músculo esquelético é realizada pelo transportador dependente de sódio e cloreto CreaT. Esse carreador é altamente responsivo à sinalização de insulina.

### 2. O Que a Ciência Constatou
- Quando 5g de creatina foram consumidos com 50g de carboidratos (ou 25g de carboidrato + 25g de proteína), a retenção de creatina total no músculo aumentou em até **15% a 20%** comparado à creatina isolada.
- Houve uma excreção urinária significativamente menor, indicando maior aproveitamento intracelular.

### 3. Creatina Monoidratada vs Formas Caras
Não gaste dinheiro com creatina etil-éster, líquida ou tamponada. A creatina monoidratada (ou creapure micronizada para melhor solubilidade) continua sendo a forma padrão-ouro de melhor absorção e biodisponibilidade.
    `,
    practicalTips: [
      'Ingira de 3g a 5g de creatina monoidratada todos os dias, incluindo dias de descanso.',
      'Sempre combine com uma refeição sólida com carboidratos ou com o seu shake proteico.',
      'A consistência diária é mais importante que o horário exato, mas no pós-treino a sensibilidade insulínica é ainda maior.'
    ]
  },

  // 20. Cafeína Time-Release vs Anidra
  {
    id: 'art_cafeina_time_release_teanina',
    title: 'Cafeína Time-Release & L-Teanina: Pico de Foco sem Taquicardia nem "Crash" Pós-Treino',
    subtitle: 'Ensaios clínicos demonstram que microesferas de liberação prolongada sustentam a potência neuromuscular por até 4 horas sem queda súbita de energia.',
    category: 'suplementos',
    categoryLabel: 'Suplementos',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    readTime: '4 min',
    publishedDate: '2024',
    source: 'Journal of Applied Physiology & Sports Medicine',
    doi: '10.1080/15502783.2023.2185489',
    featured: false,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'cafeína', 'time-release', 'l-teanina', 'suplementos', 'foco', 'fadiga'],
    summary: 'A cafeína anidra tradicional causa um pico plasmático rápido aos 45 minutos seguido de uma queda brusca de dopamina e adenosina (crash). A cafeína de liberação gradual combinada com L-teanina mantém o estado de fluxo mental e força durante todo o treino.',
    keyTakeaway: 'Combinar cafeína (150-200mg) com L-teanina (100-200mg) na proporção 1:1 ou 1:2 promove foco aguçado e tolerância ao esforço com zero tremores ou ansiedade.',
    fullContent: `
A cafeína bloqueia os receptores de adenosina no sistema nervoso central, reduzindo a percepção de esforço (RPE) e aumentando o recrutamento de unidades motoras.

### O Problema do "Crash"
A cafeína convencional em pó ou cápsula atinge o pico na corrente sanguínea em 30 a 60 minutos, estimulando fortes picos de adrenalina. Quando os níveis caem, a adenosina acumulada inunda os receptores, gerando sonolência súbita e desmotivação no meio da tarde.

### A Solução Científica
1. **Microcápsulas Time-Release:** Liberam a cafeína em duas fases — 50% imediata e 50% gradual ao longo de 4 horas.
2. **Sinergia com L-Teanina:** Esse aminoácido do chá verde estimula ondas cerebrais Alfa (relaxamento alerta), cancelando a vasoconstrição excessiva e os batimentos cardíacos acelerados da cafeína.
    `,
    practicalTips: [
      'Utilize de 3 a 6mg de cafeína por kg de peso corporal 45 minutos antes de treinos intensos.',
      'Se você sente palpitação ou ansiedade, combine com 100-200mg de L-Teanina.',
      'Evite o consumo de qualquer cafeína nas 8 horas que antecedem o horário de dormir para preservar o sono profundo.'
    ]
  },

  // 21. Otimização do Sono: Magnésio Bisglicinato & Inositol
  {
    id: 'art_sono_magnesio_bisglicinato_recuperacao',
    title: 'Magnésio Bisglicinato & Inositol: Otimização do Sono de Ondas Lentas e Pulso Noturno de GH',
    subtitle: 'Estudos clínicos comprovam que o magnésio quelado com glicina ativa os receptores GABA-A cerebrais, diminuindo os microdespertares e acelerando a recuperação muscular.',
    category: 'saude',
    categoryLabel: 'Saúde & Fisiologia',
    categoryColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    readTime: '5 min',
    publishedDate: '2024',
    source: 'Nutrients & Sleep Medicine Reviews',
    doi: '10.3390/nu13041263',
    featured: false,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'sono', 'magnésio', 'recuperação', 'gh', 'testosterona', 'gaba'],
    summary: 'O sono profundo (Slow-Wave Sleep / N3) é o período onde ocorre mais de 70% da secreção diária do Hormônio do Crescimento (GH) e reparação tecidual. Suplementar magnésio quelado (200-300mg) melhora a eficiência do sono e reduz a fadiga neuromuscular.',
    keyTakeaway: 'Tome de 200mg a 350mg de Magnésio Bisglicinato (ou Dimalato) cerca de 30 a 60 minutos antes de deitar para potencializar a recuperação do sistema nervoso central pós-treino pesado.',
    fullContent: `
Durante as fases de treino intenso e hipertrofia, o sistema nervoso central sofre um desgaste cumulativo que só pode ser restaurado durante o sono profundo.

### Mecanismo de Ação
- O **Magnésio Bisglicinato** atravessa a barreira hematoencefálica com facilidade e atua como agonista natural dos receptores GABA, o principal neurotransmissor inibitório cerebral.
- Ele também bloqueia a entrada excessiva de cálcio nos canais NMDA, impedindo a hiperexcitabilidade neuronal que causa pensamentos acelerados na hora de dormir.
- O aminoácido **Glicina** atua reduzindo a temperatura corporal central, sinal essencial para o cérebro engatar os ciclos de sono profundo (ondas lentas).

### Impacto na Massa Muscular
Sem sono profundo adequado, a síntese proteica miofibrilar cai, o cortisol matinal dispara e a sensibilidade à insulina muscular diminui no dia seguinte, favorecendo o acúmulo de gordura visceral.
    `,
    practicalTips: [
      'Dosagem recomendada: 200mg a 300mg de magnésio elementar na forma Bisglicinato à noite.',
      'Mantenha o quarto escuro, silencioso e fresco (entre 18°C e 21°C).',
      'Desligue telas ou use filtros de luz azul 1 hora antes de deitar.'
    ]
  },

  // 22. Volume Semanal Ótimo e Frequência
  {
    id: 'art_volume_semanal_series_hipertrofia_2024',
    title: 'Meta-Análise 2024: O Volume Semanal Ótimo de Séries por Grupo Muscular',
    subtitle: 'Revisão sistemática com mais de 30 estudos elucida a relação dose-resposta: entre 12 e 18 séries semanais por músculo oferecem 90% do estímulo máximo com recuperação ideal.',
    category: 'treino',
    categoryLabel: 'Treino Ótimo',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    readTime: '5 min',
    publishedDate: '2024',
    source: 'Sports Medicine Review 2024',
    doi: '10.1007/s40279-024-02050-x',
    featured: true,
    isCoreFocus: true,
    tags: ['optimal training', 'body improvement', 'volume semanal', 'séries', 'hipertrofia', 'frequência', 'periodização'],
    summary: 'Aumentar o volume além de 18 a 20 séries por músculo por semana traz retornos decrescentes expressivos e aumenta exponencialmente o risco de sobrecarga articular e estagnação da força.',
    keyTakeaway: 'Divida o treino de cada grupo muscular em 2 vezes por semana, executando entre 6 e 9 séries desafiadoras por sessão (totalizando 12 a 18 séries semanais por músculo).',
    fullContent: `
Uma das maiores dúvidas de quem busca hipertrofia máxima é: *"Quantas séries por semana eu devo fazer para o peito, costas ou quadríceps?"*

### A Curva Dose-Resposta da Hipertrofia
- **Menos de 8 séries semanais:** Estímulo suficiente para manutenção ou ganho moderado em iniciantes.
- **10 a 18 séries semanais:** **A Zona Ótima (Sweet Spot)** para praticantes intermediários e avançados, com máxima síntese de novas proteínas contráteis.
- **Acima de 22 séries semanais:** Retornos decrescentes acentuados. A fadiga acumulada e o dano muscular superam a capacidade de regeneração, entrando na faixa de *Junk Volume*.

### A Importância da Frequência (2x na semana)
Fazer 16 séries de peito em uma única segunda-feira gera fadiga excessiva nas últimas séries, onde a intensidade real cai drasticamente. Dividir em duas sessões de 8 séries (ex: Segunda e Quinta) permite trabalhar com muito mais carga e qualidade biomecânica.
    `,
    practicalTips: [
      'Inicie novos ciclos com 10 a 12 séries semanais por músculo.',
      'Progrida gradualmente até 16 a 18 séries apenas se a sua recuperação e sono estiverem impecáveis.',
      'Priorize a proximidade da falha (1 a 2 RIR) em vez de fazer séries infinitas sem intensidade.'
    ]
  }
];

/**
 * Motor de Busca Dinâmico com Relevância Ponderada, Modo Foco e Aprendizado de Interesses
 */
export function searchNewsArticles(articles, {
  query = '',
  category = 'all',
  focusMode = false, // Filtro Especializado em Body Improvement, Dieta e Optimal Training
  userInterests = [] // Termos de interesse aprendidos do histórico de buscas do usuário
} = {}) {
  if (!Array.isArray(articles)) return [];
  const normalizedQuery = query.toLowerCase().trim();

  // 1. Filtragem preliminar por Categoria e Modo Foco
  let candidates = articles.filter((article) => {
    // Se a categoria específica foi selecionada e não for 'all'
    if (category !== 'all' && article.category !== category) {
      return false;
    }

    // Se o Modo Foco estiver ativo, filtra apenas os artigos voltados para Body Improvement, Dieta e Optimal Training
    if (focusMode && !article.isCoreFocus) {
      return false;
    }

    return true;
  });

  // Se não houver termo de busca, ranqueia pelo modo foco / interesses
  if (!normalizedQuery) {
    if (userInterests.length > 0) {
      return candidates.slice().sort((a, b) => {
        const scoreA = calculateInterestScore(a, userInterests);
        const scoreB = calculateInterestScore(b, userInterests);
        return scoreB - scoreA;
      });
    }
    return candidates;
  }

  // 2. Pontuação Ponderada de Relevância Dinâmica
  const scored = candidates
    .map((article) => {
      let score = 0;
      const titleLower = (article.title || '').toLowerCase();
      const subtitleLower = (article.subtitle || '').toLowerCase();
      const summaryLower = (article.summary || '').toLowerCase();
      const takeawayLower = (article.keyTakeaway || '').toLowerCase();
      const tags = article.tags || [];

      // Match no Título (peso 15)
      if (titleLower.includes(normalizedQuery)) score += 15;

      // Match exato ou parcial em Tags (peso 12)
      for (const tag of tags) {
        if (tag.toLowerCase() === normalizedQuery) score += 12;
        else if (tag.toLowerCase().includes(normalizedQuery)) score += 6;
      }

      // Match no Takeaway ou Subtítulo (peso 8)
      if (takeawayLower.includes(normalizedQuery)) score += 8;
      if (subtitleLower.includes(normalizedQuery)) score += 6;

      // Match no Resumo (peso 4)
      if (summaryLower.includes(normalizedQuery)) score += 4;

      // Bônus se o artigo casar com os interesses aprendidos do usuário (peso 5)
      score += calculateInterestScore(article, userInterests);

      // Bônus se o Modo Foco estiver ativo e o artigo for do núcleo de recomposição
      if (focusMode && article.isCoreFocus) score += 10;

      return { article, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.article);

  return scored;
}

function calculateInterestScore(article, userInterests = []) {
  if (!userInterests || userInterests.length === 0) return 0;
  let score = 0;
  const tags = (article.tags || []).map((t) => t.toLowerCase());
  const title = (article.title || '').toLowerCase();

  for (const interest of userInterests) {
    const q = String(interest).toLowerCase();
    if (tags.some((t) => t.includes(q))) score += 4;
    if (title.includes(q)) score += 3;
  }
  return score;
}
