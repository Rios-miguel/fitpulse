import React from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Quote, 
  Share2,
  ExternalLink 
} from 'lucide-react';

function getStudyExternalUrl(article) {
  if (!article) return null;
  const doi = String(article.doi || '').trim();
  if (doi.startsWith('http://') || doi.startsWith('https://')) return doi;
  if (doi.toUpperCase().startsWith('PMID:')) {
    const pmid = doi.replace(/PMID:/i, '').trim();
    return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  }
  if (doi.startsWith('10.')) {
    return `https://doi.org/${doi}`;
  }
  if (article.title) {
    return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(article.title)}`;
  }
  return null;
}

function renderFormattedParagraph(text, key) {
  // Converte [Texto](URL) para tag <a> clicável
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-400 hover:text-emerald-300 underline font-semibold inline-flex items-center gap-0.5"
      >
        <span>{match[1]}</span>
        <ExternalLink className="w-3 h-3 inline" />
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <p key={key}>{parts.length > 0 ? parts : text}</p>;
}

export default function ArticleModal({
  article,
  isBookmarked,
  onToggleBookmark,
  onClose
}) {
  if (!article) return null;
  const studyExternalUrl = getStudyExternalUrl(article);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.keyTakeaway,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title}\n\n${article.keyTakeaway}`);
      alert('Resumo do estudo copiado para a área de transferência!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto modal-backdrop-anim">
      <div className="bg-[#16181f] border border-white/[0.08] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto modal-content-anim flex flex-col max-h-[90vh]">
        {/* Header da Notícia / Estudo */}
        <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between gap-3 bg-[#13151b]">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${article.categoryColor}`}>
              {article.categoryLabel}
            </span>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" /> {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-[#181a20] border-white/[0.07] text-zinc-400 hover:text-zinc-200'
              }`}
              title={isBookmarked ? 'Remover dos favoritos' : 'Salvar estudo'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-400" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-[#181a20] border border-white/[0.07] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title="Compartilhar resumo"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#181a20] border border-white/[0.07] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-zinc-200 scrollbar-thin-green">
          {/* Título & Subtítulo */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-100 leading-snug tracking-tight">
              {article.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              {article.subtitle}
            </p>
          </div>

          {/* Banner de Fonte Científica com Link Oficial */}
          <div className="bg-[#111317] border border-white/[0.05] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-zinc-300 block">{article.source}</span>
                <span className="text-[10px] text-zinc-500">
                  Publicado em {article.publishedDate} • DOI / Identificador: {article.doi || 'Revisado'}
                </span>
              </div>
            </div>

            {studyExternalUrl && (
              <a
                href={studyExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
                title="Abrir o artigo científico original em nova aba"
              >
                <span>Acessar Estudo Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Destaque Prático (Key Takeaway) */}
          <div className="bg-gradient-to-r from-emerald-950/30 to-[#14171d] border-l-4 border-emerald-500 p-4 rounded-r-xl space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conclusão Prática para sua Rotina</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
              {article.keyTakeaway}
            </p>
          </div>

          {/* Corpo Completo do Estudo */}
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/[0.05] pt-4">
            {String(article.fullContent || article.summary || '').split('\n\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-sm font-bold text-zinc-100 pt-2 tracking-tight">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }

              if (trimmed.startsWith('- ')) {
                const listItems = trimmed.split('\n').map((li) => li.replace(/^- /, ''));
                return (
                  <ul key={index} className="space-y-1.5 pl-4 list-disc text-zinc-300 text-xs">
                    {listItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              }

              return renderFormattedParagraph(trimmed, index);
            })}
          </div>

          {/* Dicas Práticas de Aplicação */}
          {Array.isArray(article.practicalTips) && article.practicalTips.length > 0 && (
            <div className="bg-[#121419] border border-white/[0.06] rounded-2xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Como aplicar hoje mesmo:</span>
              </h4>
              <div className="space-y-2">
                {article.practicalTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-snug">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer do Modal com Link Oficial */}
        <div className="p-4 border-t border-white/[0.06] bg-[#13151b] flex items-center justify-between gap-3">
          {studyExternalUrl ? (
            <a
              href={studyExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors truncate max-w-[200px] sm:max-w-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span className="truncate">Ver no PubMed / DOI</span>
            </a>
          ) : (
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
              <Quote className="w-3.5 h-3.5" />
              <span>Baseado em evidências científicas</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
          >
            Fechar Estudo
          </button>
        </div>
      </div>
    </div>
  );
}
