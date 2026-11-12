/**
 * Serviço de Integração ao Vivo com Bases Científicas Internacionais (100% Gratuitas)
 * Fontes:
 * - NCBI PubMed API (E-utilities) - Pública e Gratuita mantida pelo governo dos EUA (NIH).
 * - OpenAlex API - Catálogo aberto e gratuito de literatura científica mundial.
 * Tradução:
 * - Motor de tradução instantânea em tempo real para o português (Gratuito e sem custos).
 */

const CACHE_KEY = 'fitpulse_live_science_cache_v1';

/**
 * Traduz um texto do inglês para o português de forma gratuita
 */
export async function translateTextToPortuguese(text) {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim();
  if (trimmed.length === 0) return '';

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha na resposta do serviço de tradução');
    const data = await response.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((item) => item[0]).join('');
    }
    return trimmed;
  } catch (error) {
    console.warn('Fallback de tradução:', error.message);
    return trimmed; // Se offline ou bloqueado, retorna o texto original
  }
}

/**
 * Busca artigos ao vivo no PubMed (NCBI E-utilities)
 */
export async function fetchLivePubMedArticles(searchTerm = 'hypertrophy resistance training', limit = 4) {
  try {
    // 1. Busca IDs no PubMed
    const esearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(
      searchTerm + ' AND (diet OR supplement OR exercise OR hypertrophy OR training)'
    )}&retmode=json&retmax=${limit}&sort=pub_date`;

    const searchRes = await fetch(esearchUrl);
    if (!searchRes.ok) throw new Error('Erro ao conectar ao PubMed');
    const searchData = await searchRes.json();
    const idList = searchData?.esearchresult?.idlist || [];

    if (idList.length === 0) return [];

    // 2. Busca os resumos (Summaries) desses IDs
    const esummaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(
      ','
    )}&retmode=json`;
    const sumRes = await fetch(esummaryUrl);
    if (!sumRes.ok) throw new Error('Erro ao buscar detalhes no PubMed');
    const sumData = await sumRes.json();
    const resultObj = sumData?.result || {};

    const articles = [];

    for (const pmid of idList) {
      const doc = resultObj[pmid];
      if (!doc || !doc.title) continue;

      const rawTitle = doc.title.replace(/\[|\]/g, ''); // Remove colchetes de títulos traduzidos
      const rawSource = doc.source || 'PubMed / Medline';
      const pubDate = doc.pubdate ? String(doc.pubdate).split(' ')[0] : '2024';

      // Traduz o título para português
      const titlePt = await translateTextToPortuguese(rawTitle);

      // Infere a categoria com base nos termos
      const lowerTitle = rawTitle.toLowerCase();
      let category = 'treino';
      let categoryLabel = 'Treino Ótimo';
      let categoryColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';

      if (lowerTitle.includes('supplement') || lowerTitle.includes('creatine') || lowerTitle.includes('caffeine') || lowerTitle.includes('protein')) {
        category = 'suplementos';
        categoryLabel = 'Suplementos';
        categoryColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      } else if (lowerTitle.includes('diet') || lowerTitle.includes('calori') || lowerTitle.includes('nutrition') || lowerTitle.includes('fat loss')) {
        category = 'nutricao';
        categoryLabel = 'Nutrição & Dieta';
        categoryColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      }

      articles.push({
        id: `live_pubmed_${pmid}`,
        title: titlePt,
        subtitle: `Artigo científico internacional indexado sob PMID ${pmid}.`,
        category,
        categoryLabel,
        categoryColor,
        readTime: '3 min',
        publishedDate: pubDate,
        source: `${rawSource} • PubMed Oficial (NIH)`,
        doi: `PMID: ${pmid}`,
        featured: false,
        isCoreFocus: true,
        isLiveOnline: true,
        tags: ['live', 'pubmed', 'body improvement', 'optimal training', category],
        summary: `Estudo publicado em periódico internacional indexado pelo National Center for Biotechnology Information (NCBI). Título original: "${rawTitle}".`,
        keyTakeaway: 'Estudo em revisão de pares. Os achados reforçam a importância de calibrar volume, nutrição e descanso com base em dados laboratoriais controlados.',
        fullContent: `
Este artigo foi obtido em tempo real através da API pública oficial do **NCBI / PubMed**.

### Informações do Estudo
- **Identificador PubMed (PMID):** ${pmid}
- **Revista Científica / Fonte:** ${rawSource}
- **Data de Publicação:** ${pubDate}
- **Título Original em Inglês:** ${rawTitle}

### Título Traduzido:
${titlePt}

### Acesso Completo ao Paper Oficial:
Você pode ler o artigo completo diretamente no portal do PubMed pelo link oficial:
[https://pubmed.ncbi.nlm.nih.gov/${pmid}/](https://pubmed.ncbi.nlm.nih.gov/${pmid}/)
        `,
        practicalTips: [
          'Acompanhe as atualizações metodológicas deste artigo no portal PubMed.',
          'Consulte a seção de métodos para verificar o tamanho da amostra e o grupo de participantes.',
          'Cruze estes achados com os estudos consolidados de nutrição e treinamento do app.'
        ]
      });
    }

    return articles;
  } catch (error) {
    console.error('Erro no fetchLivePubMedArticles:', error);
    return [];
  }
}

/**
 * Busca artigos ao vivo no OpenAlex API
 */
export async function fetchLiveOpenAlexArticles(searchTerm = 'hypertrophy', limit = 3) {
  try {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(
      searchTerm + ' muscle hypertrophy training'
    )}&filter=has_abstract:true&per-page=${limit}&sort=publication_date:desc`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'FitPulseScience/1.0 (mailto:fitpulse@example.com)'
      }
    });

    if (!res.ok) throw new Error('Erro na conexão com OpenAlex');
    const data = await res.json();
    const results = data?.results || [];

    const articles = [];

    for (const paper of results) {
      if (!paper.title) continue;

      const titlePt = await translateTextToPortuguese(paper.title);
      const sourceName = paper.primary_location?.source?.display_name || 'OpenAlex Scientific Repository';
      const pubYear = paper.publication_year || '2024';
      const cleanDoi = paper.doi ? paper.doi.replace('https://doi.org/', '') : 'OpenAlex';

      articles.push({
        id: `live_openalex_${paper.id ? paper.id.split('/').pop() : Date.now()}`,
        title: titlePt,
        subtitle: `Publicação científica de acesso aberto (Open Access) indexada em ${pubYear}.`,
        category: 'treino',
        categoryLabel: 'Treino Ótimo',
        categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        readTime: '4 min',
        publishedDate: String(pubYear),
        source: `${sourceName} • OpenAlex Open Access`,
        doi: cleanDoi,
        featured: false,
        isCoreFocus: true,
        isLiveOnline: true,
        tags: ['live', 'openalex', 'body improvement', 'optimal training'],
        summary: `Artigo científico livre e revisado por pares. Título original: "${paper.title}".`,
        keyTakeaway: 'Pesquisa recente sobre treinamento resistido e adaptações estruturais do tecido muscular.',
        fullContent: `
Este artigo foi obtido em tempo real através da rede aberta de literatura científica **OpenAlex**.

### Detalhes da Obra
- **Periódico:** ${sourceName}
- **Ano de Publicação:** ${pubYear}
- **Citações Registradas:** ${paper.cited_by_count || 0} citações
- **Título Original:** ${paper.title}

### Tradução:
${titlePt}

### Link do DOI Oficial:
${paper.doi ? `Acesse o trabalho completo em: [${paper.doi}](${paper.doi})` : 'Disponível no catálogo do OpenAlex.'}
        `,
        practicalTips: [
          'Verifique as conclusões do autor no link oficial do DOI.',
          'Analise se o estudo foi realizado com indivíduos destreinados ou atletas avançados.',
          'Aplique a progressão de cargas gradual recomendada pelo protocolo.'
        ]
      });
    }

    return articles;
  } catch (error) {
    console.error('Erro no fetchLiveOpenAlexArticles:', error);
    return [];
  }
}

/**
 * Hub Unificado de Busca ao Vivo (PubMed + OpenAlex) com cache local no navegador
 */
export async function fetchUnifiedLiveScienceArticles(searchTerm = 'hypertrophy', maxTotal = 6) {
  // 1. Consulta PubMed e OpenAlex em paralelo
  const [pubmedResults, openalexResults] = await Promise.allSettled([
    fetchLivePubMedArticles(searchTerm, Math.ceil(maxTotal / 2)),
    fetchLiveOpenAlexArticles(searchTerm, Math.floor(maxTotal / 2))
  ]);

  const liveArticles = [];

  if (pubmedResults.status === 'fulfilled' && Array.isArray(pubmedResults.value)) {
    liveArticles.push(...pubmedResults.value);
  }

  if (openalexResults.status === 'fulfilled' && Array.isArray(openalexResults.value)) {
    liveArticles.push(...openalexResults.value);
  }

  // 2. Salva no cache do navegador (Indexed/LocalStorage) para persistência offline
  try {
    const existingCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
    const map = new Map();
    // Prioriza novos
    for (const art of liveArticles) map.set(art.id, art);
    for (const art of existingCache) if (!map.has(art.id)) map.set(art.id, art);

    const merged = Array.from(map.values()).slice(0, 50); // Mantém até 50 artigos ao vivo em cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('Erro ao salvar cache de artigos ao vivo:', e);
  }

  return liveArticles;
}

export function getCachedLiveArticles() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const parsed = cached ? JSON.parse(cached) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}
