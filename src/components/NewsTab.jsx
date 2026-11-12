import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  Newspaper,
  Layers,
  FlaskConical,
  Dumbbell,
  Apple,
  HeartPulse,
  History,
  X,
  Target,
  SlidersHorizontal,
  Check,
  Globe,
  RefreshCw,
  Radio
} from 'lucide-react';
import { 
  FITNESS_NEWS_ARTICLES, 
  FITNESS_NEWS_CATEGORIES, 
  FITNESS_NEWS_SHORTCUTS,
  searchNewsArticles 
} from '../data/fitnessNewsDb.js';
import { 
  fetchUnifiedLiveScienceArticles, 
  getCachedLiveArticles 
} from '../services/liveScienceApi.js';

const RECENT_SEARCHES_KEY = 'fitpulse_recent_news_searches_v1';

export default function NewsTab({
  bookmarkedArticleIds = [],
  onToggleBookmark,
  onOpenArticle
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [onlySaved, setOnlySaved] = useState(false);
  const [focusMode, setFocusMode] = useState(false); // Modo Foco: Body Improvement, Dieta & Optimal Training
  const [liveArticles, setLiveArticles] = useState(() => getCachedLiveArticles());
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [liveSuccessMessage, setLiveSuccessMessage] = useState(null);

  // Histórico de buscas recentes do usuário
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searchHistory));
    } catch (e) {}
  }, [searchHistory]);

  const saveQueryToHistory = (term) => {
    const trimmed = term.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed);
      return [trimmed, ...filtered].slice(0, 8);
    });
  };

  const removeHistoryItem = (term, e) => {
    e.stopPropagation();
    setSearchHistory((prev) => prev.filter((item) => item !== term));
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
  };

  const handleExecuteSearch = (term) => {
    setSearchQuery(term);
    saveQueryToHistory(term);
  };

  // Busca estudos ao vivo na API pública do PubMed e OpenAlex
  const handleFetchLiveArticles = async () => {
    setIsLoadingLive(true);
    setLiveSuccessMessage(null);
    try {
      const term = searchQuery.trim() || 'hypertrophy';
      saveQueryToHistory(term);
      const fetched = await fetchUnifiedLiveScienceArticles(term, 6);
      if (fetched.length > 0) {
        setLiveArticles((prev) => {
          const map = new Map();
          for (const item of fetched) map.set(item.id, item);
          for (const item of prev) if (!map.has(item.id)) map.set(item.id, item);
          return Array.from(map.values());
        });
        setLiveSuccessMessage(`${fetched.length} novos estudos obtidos ao vivo e traduzidos para o português!`);
        setTimeout(() => setLiveSuccessMessage(null), 4500);
      } else {
        setLiveSuccessMessage('Nenhum artigo novo retornado para este termo no momento.');
        setTimeout(() => setLiveSuccessMessage(null), 4000);
      }
    } catch (e) {
      setLiveSuccessMessage('Erro ao conectar com as bases internacionais.');
      setTimeout(() => setLiveSuccessMessage(null), 4000);
    } finally {
      setIsLoadingLive(false);
    }
  };

  // Base combinada de artigos locais + artigos trazidos ao vivo da web
  const allArticlesCombined = useMemo(() => {
    const map = new Map();
    const safeLive = Array.isArray(liveArticles) ? liveArticles : [];
    for (const art of safeLive) {
      if (art && art.id) map.set(art.id, art);
    }
    for (const art of FITNESS_NEWS_ARTICLES) {
      if (art && art.id) map.set(art.id, art);
    }
    return Array.from(map.values());
  }, [liveArticles]);

  // Motor dinâmico de busca com ranqueamento ponderado e modo foco
  const filteredArticles = useMemo(() => {
    let list = searchNewsArticles(allArticlesCombined, {
      query: searchQuery,
      category: activeCategory,
      focusMode,
      userInterests: searchHistory
    });

    if (onlySaved) {
      list = list.filter((art) => bookmarkedArticleIds.includes(art.id));
    }
    return list;
  }, [searchQuery, activeCategory, focusMode, onlySaved, bookmarkedArticleIds, searchHistory, allArticlesCombined]);

  // Artigos Recomendados com Base no Histórico (quando o usuário tem pesquisas)
  const recommendedArticles = useMemo(() => {
    if (searchHistory.length === 0 || searchQuery.trim().length > 0) return [];
    return FITNESS_NEWS_ARTICLES.filter((art) => {
      const tags = (art.tags || []).map((t) => t.toLowerCase());
      const title = (art.title || '').toLowerCase();
      return searchHistory.some((h) => tags.some((t) => t.includes(h)) || title.includes(h));
    }).slice(0, 3);
  }, [searchHistory, searchQuery]);

  // Artigo em Destaque
  const featuredArticle = useMemo(() => {
    return FITNESS_NEWS_ARTICLES.find((a) => a.featured) || FITNESS_NEWS_ARTICLES[0];
  }, []);

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'suplementos': return FlaskConical;
      case 'treino': return Dumbbell;
      case 'nutricao': return Apple;
      case 'saude': return HeartPulse;
      default: return Layers;
    }
  };

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto">
      {/* 1. Header com Título e Ação de Salvos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Newspaper className="w-4 h-4 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Canal de Notícias & Ciência</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Mecanismo dinâmico de pesquisa com artigos revisados e métodos ótimos de treinamento.
          </p>
        </div>

        {/* Botão de Filtro de Salvos */}
        <button
          type="button"
          onClick={() => setOnlySaved(!onlySaved)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer ${
            onlySaved
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
              : 'bg-[#181a20] border-white/[0.07] text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>Salvos ({bookmarkedArticleIds.length})</span>
        </button>
      </div>

      {/* 2. CARD DO MODO FOCO DINÂMICO (Body Improvement, Dieta & Optimal Training) */}
      <section className={`border rounded-2xl p-3.5 transition-all duration-300 ${
        focusMode 
          ? 'bg-gradient-to-r from-purple-950/40 via-[#181a22] to-emerald-950/30 border-purple-500/40 shadow-sm' 
          : 'bg-[#15171d] border-white/[0.06]'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              focusMode ? 'bg-purple-500/20 text-purple-300' : 'bg-[#1c1f27] text-zinc-400'
            }`}>
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-100">Filtro Especializado:</span>
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  focusMode ? 'bg-purple-500/20 text-purple-300' : 'bg-white/[0.05] text-zinc-400'
                }`}>
                  {focusMode ? 'Foco Ativo' : 'Modo Geral'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {focusMode
                  ? 'Filtrando estritamente estudos de Body Improvement (Hipertrofia), Dieta Anabólica e Optimal Training.'
                  : 'Exibindo todo o universo de saúde, sono, longevidade e nutrição geral. Ative o modo foco para hipertrofia.'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => setFocusMode(!focusMode)}
            role="switch"
            aria-checked={focusMode}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
              focusMode ? 'bg-purple-500' : 'bg-zinc-700'
            }`}
            title="Alternar Modo Foco em Body Improvement & Optimal Training"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                focusMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* 3. Hero: Artigo em Destaque (quando não estiver pesquisando) */}
      {!searchQuery && activeCategory === 'all' && !onlySaved && featuredArticle && (
        <article 
          onClick={() => onOpenArticle(featuredArticle)}
          className="bg-gradient-to-br from-[#1b1c24] to-[#14151b] border border-white/[0.08] hover:border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Em Destaque
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${featuredArticle.categoryColor}`}>
                {featuredArticle.categoryLabel}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" /> {featuredArticle.readTime}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors leading-snug">
            {featuredArticle.title}
          </h3>

          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {featuredArticle.subtitle}
          </p>

          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 truncate max-w-[250px] sm:max-w-md">
              {featuredArticle.source}
            </span>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Ler Estudo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </article>
      )}

      {/* 4. Barra de Pesquisa Dinâmica com Busca ao Vivo no PubMed */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar por termo (ex: body improvement, optimal training, creatina, cabos, LLPs...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFetchLiveArticles();
              }}
              className="w-full bg-[#181a20] border border-white/[0.07] rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleFetchLiveArticles}
            disabled={isLoadingLive}
            className="px-3.5 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
            title="Consultar API pública do PubMed e OpenAlex em tempo real"
          >
            {isLoadingLive ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-300" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-purple-300" />
            )}
            <span className="hidden sm:inline">
              {isLoadingLive ? 'Buscando ao Vivo...' : 'Buscar no PubMed ao Vivo'}
            </span>
            <span className="sm:hidden">Ao Vivo</span>
          </button>
        </div>

        {/* Mensagem de Feedback ao Vivo */}
        {liveSuccessMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2 tab-content-enter">
            <Radio className="w-3.5 h-3.5 shrink-0 animate-pulse text-emerald-400" />
            <span>{liveSuccessMessage}</span>
          </div>
        )}

        {/* 5. Histórico Dinâmico de Buscas Recentes */}
        {searchHistory.length > 0 && !searchQuery && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] text-zinc-500 flex items-center gap-1 shrink-0 font-medium">
              <History className="w-3 h-3" /> Recentes:
            </span>
            {searchHistory.map((item) => (
              <span
                key={item}
                onClick={() => handleExecuteSearch(item)}
                className="px-2 py-0.5 rounded-md bg-[#161820] border border-white/[0.05] text-[11px] text-zinc-300 hover:text-white hover:border-white/20 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={(e) => removeHistoryItem(item, e)}
                  className="text-zinc-500 hover:text-rose-400"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAllHistory}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 underline shrink-0 cursor-pointer ml-1"
            >
              limpar
            </button>
          </div>
        )}

        {/* 6. Atalhos Rápidos de Estudos Nichados & Métodos Ótimos */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin-green">
          {FITNESS_NEWS_SHORTCUTS.map((sc) => {
            const isSelected = searchQuery.toLowerCase() === sc.query.toLowerCase();
            return (
              <button
                key={sc.label}
                type="button"
                onClick={() => {
                  const next = isSelected ? '' : sc.query;
                  setSearchQuery(next);
                  if (next) saveQueryToHistory(next);
                  setActiveCategory('all');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold shadow-xs'
                    : 'bg-[#15171e] text-zinc-400 border-white/[0.05] hover:text-zinc-200 hover:border-white/15'
                }`}
              >
                {sc.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Recomendações Personalizadas Baseadas nas Suas Pesquisas */}
      {recommendedArticles.length > 0 && (
        <section className="bg-[#15171d] border border-white/[0.06] rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Recomendados com Base nas Suas Pesquisas</span>
            </span>
            <span className="text-[10px] text-zinc-500">Personalizado</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {recommendedArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onOpenArticle(art)}
                className="p-2.5 rounded-xl bg-[#121419] border border-white/[0.04] hover:border-purple-500/30 cursor-pointer transition-colors"
              >
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${art.categoryColor}`}>
                  {art.categoryLabel}
                </span>
                <h5 className="text-[11px] font-bold text-zinc-200 mt-1 line-clamp-2 leading-tight">
                  {art.title}
                </h5>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-1.5 flex items-center gap-0.5">
                  Ver estudo <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Categorias Clássicas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin-green">
        {FITNESS_NEWS_CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/40 font-semibold shadow-sm'
                  : 'bg-[#181a20] text-zinc-400 border-white/[0.07] hover:border-white/15 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 9. Grid de Artigos */}
      {filteredArticles.length === 0 ? (
        <div className="bg-[#181a20] border border-white/[0.06] rounded-2xl p-8 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-zinc-500 mx-auto" />
          <p className="text-sm text-zinc-300 font-semibold">Nenhum estudo encontrado para os filtros atuais.</p>
          <p className="text-xs text-zinc-500">
            {focusMode ? 'O Modo Foco está ativo. Desative-o para visualizar outros tópicos ou tente buscar por outro termo.' : 'Tente pesquisar por outro termo ou desative o filtro de favoritos.'}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            {focusMode && (
              <button
                type="button"
                onClick={() => setFocusMode(false)}
                className="px-3 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Desativar Modo Foco
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setOnlySaved(false);
                setFocusMode(false);
              }}
              className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Ver todos os estudos
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredArticles.map((article) => {
            const isSaved = bookmarkedArticleIds.includes(article.id);

            return (
              <article
                key={article.id}
                className="bg-[#181a20] border border-white/[0.07] hover:border-white/15 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${article.categoryColor}`}>
                        {article.categoryLabel}
                      </span>
                      {article.isLiveOnline && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-cyan-400" /> Ao Vivo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.publishedDate}</span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => onOpenArticle(article)}
                    className="text-sm font-bold text-zinc-100 group-hover:text-purple-300 transition-colors leading-snug cursor-pointer"
                  >
                    {article.title}
                  </h3>

                  <p className="text-[11px] text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>

                  {/* Tags semânticas */}
                  {Array.isArray(article.tags) && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.2 rounded bg-[#121419] text-zinc-400 border border-white/[0.04]">
                          #{tag.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Conclusão prática */}
                  <div className="bg-[#131418] border border-white/[0.04] rounded-xl p-2.5 mt-3 text-[11px] text-zinc-300">
                    <strong className="text-emerald-400 font-bold block mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Conclusão Prática:
                    </strong>
                    <p className="line-clamp-2 text-zinc-400">{article.keyTakeaway}</p>
                  </div>
                </div>

                {/* Ações inferiores */}
                <div className="mt-4 pt-2.5 border-t border-white/[0.05] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenArticle(article)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Ler Estudo Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleBookmark(article.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        : 'bg-[#131418] border-white/[0.05] text-zinc-500 hover:text-zinc-300'
                    }`}
                    title={isSaved ? 'Remover dos favoritos' : 'Salvar estudo'}
                  >
                    {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 fill-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
