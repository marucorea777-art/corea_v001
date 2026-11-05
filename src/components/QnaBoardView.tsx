import { useState, useEffect, FormEvent, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquarePlus,
  Search,
  ThumbsUp,
  MessageCircle,
  CheckCircle2,
  Pin,
  Send,
  Trash2,
  Sparkles,
  Globe,
  HelpCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { QnaPost } from "../types";
import {
  getQnaPosts,
  addQnaPost,
  addQnaReply,
  toggleQnaLike,
  deleteQnaPost,
} from "../services/dataStorage";
import { Translate, useTranslation } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";

const CATEGORY_OPTIONS = [
  { id: "all", label: "전체 질문", badgeClass: "bg-stone-900 text-white" },
  { id: "festival", label: "축제 & 대중교통", badgeClass: "bg-amber-100 text-amber-900 border-amber-300" },
  { id: "visa", label: "비자 & 입국절차", badgeClass: "bg-sky-100 text-sky-900 border-sky-300" },
  { id: "finance", label: "환전 & 결제카드", badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300" },
  { id: "places", label: "고궁 & 추천명소", badgeClass: "bg-purple-100 text-purple-900 border-purple-300" },
  { id: "general", label: "자유 질문", badgeClass: "bg-stone-100 text-stone-700 border-stone-300" },
] as const;

const FLAG_OPTIONS = ["🇰🇷", "🇺🇸", "🇯🇵", "🇨🇳", "🇹🇭", "🇫🇷", "🇲🇽", "🇧🇷", "🇬🇪", "🇷🇺", "🇺🇦", "🌍"];

export default function QnaBoardView() {
  const { t } = useTranslation();
  const { isAdmin, adminToken } = useAdmin();

  const [posts, setPosts] = useState<QnaPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>("qna_default_1");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  // New Question Form State
  const [newAuthor, setNewAuthor] = useState<string>("");
  const [newFlag, setNewFlag] = useState<string>("🇰🇷");
  const [newCategory, setNewCategory] = useState<QnaPost["category"]>("festival");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");

  // Reply Form State per Post
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyAuthorMap, setReplyAuthorMap] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    getQnaPosts().then(setPosts);
    try {
      const savedLikes = localStorage.getItem("corea_labs_qna_likes");
      if (savedLikes) setLikedPostIds(JSON.parse(savedLikes));
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created = await addQnaPost({
      author: newAuthor.trim() || (isAdmin ? "Corea Labs 공식 관리자" : "Traveler"),
      countryFlag: newFlag,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      isPinned: isAdmin,
    });

    const refreshed = await getQnaPosts();
    setPosts(refreshed);
    setExpandedPostId(created.id);
    setIsWriteModalOpen(false);
    setNewTitle("");
    setNewContent("");
    showToast(t("질문이 성공적으로 등록되었습니다!"));
  };

  const handleAddReply = async (postId: string) => {
    const content = (replyTextMap[postId] || "").trim();
    if (!content) return;

    const authorName =
      (replyAuthorMap[postId] || "").trim() ||
      (isAdmin ? "Corea Labs 공식 컨시어지" : "Traveler");

    await addQnaReply(postId, {
      author: authorName,
      countryFlag: isAdmin ? "🇰🇷" : "🌍",
      content,
      isOfficial: isAdmin,
    });

    const refreshed = await getQnaPosts();
    setPosts(refreshed);
    setReplyTextMap((prev) => ({ ...prev, [postId]: "" }));
    showToast(t("답변이 등록되었습니다!"));
  };

  const handleLikePost = async (postId: string, e: MouseEvent) => {
    e.stopPropagation();
    if (likedPostIds.includes(postId)) return;

    await toggleQnaLike(postId);
    const updatedLikes = [...likedPostIds, postId];
    setLikedPostIds(updatedLikes);
    try {
      localStorage.setItem("corea_labs_qna_likes", JSON.stringify(updatedLikes));
    } catch {}
    const refreshed = await getQnaPosts();
    setPosts(refreshed);
  };

  const handleDeletePost = async (postId: string, e: MouseEvent) => {
    e.stopPropagation();
    await deleteQnaPost(postId, adminToken);
    const refreshed = await getQnaPosts();
    setPosts(refreshed);
    showToast(t("게시글이 삭제되었습니다."));
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    if (!searchQuery.trim()) return matchesCategory;
    const q = searchQuery.toLowerCase();
    const inTitle = post.title.toLowerCase().includes(q) || t(post.title).toLowerCase().includes(q);
    const inContent = post.content.toLowerCase().includes(q) || t(post.content).toLowerCase().includes(q);
    const inReplies = (post.replies || []).some(
      (r) => r.content.toLowerCase().includes(q) || t(r.content).toLowerCase().includes(q)
    );
    return matchesCategory && (inTitle || inContent || inReplies);
  });

  const getCategoryLabel = (catId: string) => {
    const found = CATEGORY_OPTIONS.find((c) => c.id === catId);
    return found ? found.label : "자유 질문";
  };

  const getCategoryBadgeClass = (catId: string) => {
    const found = CATEGORY_OPTIONS.find((c) => c.id === catId);
    return found ? found.badgeClass : "bg-stone-100 text-stone-700 border-stone-300";
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-amber-400/40 flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 md:p-11 border border-stone-800 shadow-lg">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/30" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-mono font-bold border border-amber-400/30">
              <Globe className="w-3.5 h-3.5" />
              <Translate>GLOBAL TRAVELER Q&amp;A COMMUNITY</Translate>
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
              <Translate>한국 여행 질문 &amp; 답변 게시판</Translate>
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              <Translate>
                축제 대중교통 방문 방법, K-ETA 비자·입국 심사, 환전 및 선불카드, 고궁 관람 팁까지 궁금한 점을 자유롭게 물어보세요. 모든 질문과 답변은 11개 언어로 자동 번역됩니다.
              </Translate>
            </p>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span><Translate>새 질문 등록하기</Translate></span>
          </button>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  selectedCategory === cat.id
                    ? "bg-stone-900 text-amber-300 border-stone-900 shadow-2xs"
                    : "bg-stone-50 text-stone-600 border-stone-200/70 hover:bg-stone-100"
                }`}
              >
                <Translate>{cat.label}</Translate>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("질문 제목, 축제명, 키워드 검색...")}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Q&A Posts List */}
      <section className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-display font-bold text-base text-stone-800">
              <Translate>검색 조건에 맞는 질문이 없습니다</Translate>
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              <Translate>첫 번째로 궁금한 한국 여행 질문을 남겨보세요! 다른 여행자들과 공식 컨시어지가 빠르게 답변해 드립니다.</Translate>
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            const hasOfficialReply = (post.replies || []).some((r) => r.isOfficial);
            const isLiked = likedPostIds.includes(post.id);

            return (
              <div
                key={post.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                  isExpanded
                    ? "border-amber-400 shadow-md"
                    : "border-stone-200/80 hover:border-stone-300 shadow-2xs"
                }`}
              >
                {/* Question Header (Clickable to expand/collapse) */}
                <div
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-mono font-bold">
                          <Pin className="w-3 h-3" />
                          <Translate>인기 FAQ</Translate>
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeClass(
                          post.category
                        )}`}
                      >
                        <Translate>{getCategoryLabel(post.category)}</Translate>
                      </span>
                      {hasOfficialReply && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <Translate>공식 답변 완료</Translate>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1 font-medium text-stone-600">
                        <span>{post.countryFlag}</span>
                        <span>{post.author}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">{post.createdAt.slice(0, 10)}</span>
                      {isAdmin && (
                        <button
                          onClick={(e) => handleDeletePost(post.id, e)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="질문 삭제 (관리자)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 leading-snug">
                        Q. <Translate>{post.title}</Translate>
                      </h3>
                      <p className={`text-xs sm:text-sm text-stone-600 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                        <Translate>{post.content}</Translate>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => handleLikePost(post.id, e)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          isLiked
                            ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                            : "bg-stone-50 border-stone-200/70 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span><Translate>도움돼요</Translate></span>
                        <span className="font-mono font-bold">{post.likes || 0}</span>
                      </button>

                      <span className="inline-flex items-center gap-1.5 font-medium text-stone-600">
                        <MessageCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span><Translate>답변</Translate></span>
                        <span className="font-mono font-bold text-stone-900">{(post.replies || []).length}</span>
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-amber-700">
                      {isExpanded ? <Translate>접기 ▲</Translate> : <Translate>답변 보기 &amp; 댓글 작성 ▼</Translate>}
                    </span>
                  </div>
                </div>

                {/* Expanded Replies & Reply Input */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-stone-50/80 border-t border-stone-200/70 px-5 sm:px-6 py-5 space-y-4"
                    >
                      {/* Replies List */}
                      <div className="space-y-3">
                        {(post.replies || []).length === 0 ? (
                          <p className="text-xs text-stone-500 py-2">
                            <Translate>아직 등록된 답변이 없습니다. 첫 번째 답변을 남겨주세요!</Translate>
                          </p>
                        ) : (
                          post.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-4 rounded-2xl border space-y-2 ${
                                reply.isOfficial
                                  ? "bg-amber-50/70 border-amber-300/80"
                                  : "bg-white border-stone-200/70"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span>{reply.countryFlag || "🇰🇷"}</span>
                                  <span className="text-xs font-bold text-stone-900">
                                    <Translate>{reply.author}</Translate>
                                  </span>
                                  {reply.isOfficial && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 text-[10px] font-mono font-bold">
                                      <ShieldCheck className="w-3 h-3" />
                                      <Translate>공식 컨시어지 답변</Translate>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-mono text-stone-400">
                                  {reply.createdAt.slice(0, 10)}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                                <Translate>{reply.content}</Translate>
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Write a Reply Box */}
                      <div className="pt-2 border-t border-stone-200/60 space-y-2.5">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={replyAuthorMap[post.id] || ""}
                            onChange={(e) =>
                              setReplyAuthorMap((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                            placeholder={isAdmin ? "Corea Labs 공식 컨시어지" : t("작성자 닉네임 (선택)")}
                            className="sm:w-48 px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={replyTextMap[post.id] || ""}
                              onChange={(e) =>
                                setReplyTextMap((prev) => ({ ...prev, [post.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddReply(post.id);
                                }
                              }}
                              placeholder={t("이 질문에 대한 답변이나 여행 팁을 남겨주세요...")}
                              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddReply(post.id)}
                              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-400 text-white hover:text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span><Translate>답변 등록</Translate></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </section>

      {/* Modal: Ask a New Question */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="font-display font-bold text-lg text-stone-900">
                    <Translate>한국 여행 새 질문 등록하기</Translate>
                  </h2>
                </div>
                <button
                  onClick={() => setIsWriteModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      <Translate>작성자 닉네임</Translate>
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder={t("예: Traveler_Kim")}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      <Translate>국가 아이콘 선택</Translate>
                    </label>
                    <div className="flex flex-wrap gap-1 bg-stone-50 p-1.5 rounded-xl border border-stone-200">
                      {FLAG_OPTIONS.map((flag) => (
                        <button
                          key={flag}
                          type="button"
                          onClick={() => setNewFlag(flag)}
                          className={`px-1.5 py-0.5 rounded-md text-sm cursor-pointer ${
                            newFlag === flag ? "bg-amber-400 shadow-2xs" : "hover:bg-stone-200/60"
                          }`}
                        >
                          {flag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    <Translate>질문 카테고리</Translate>
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as QnaPost["category"])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium"
                  >
                    <option value="festival">{t("축제 & 대중교통")}</option>
                    <option value="visa">{t("비자 & 입국절차")}</option>
                    <option value="finance">{t("환전 & 결제카드")}</option>
                    <option value="places">{t("고궁 & 추천명소")}</option>
                    <option value="general">{t("자유 질문")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    <Translate>질문 제목</Translate> *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t("궁금하신 내용을 한 줄로 요약해 주세요")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    <Translate>상세 질문 내용</Translate> *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={t("방문 예정 시기, 출발지(예: 서울역, 인천공항), 궁금한 축제나 교통편 등을 적어주시면 더욱 정확한 답변을 받으실 수 있습니다.")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    <Translate>취소</Translate>
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold cursor-pointer shadow-sm"
                  >
                    <Translate>질문 등록 완료</Translate>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
