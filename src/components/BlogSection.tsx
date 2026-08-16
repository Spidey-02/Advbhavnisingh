import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/legalData';
import { BlogPost } from '../types';
import { ChevronRight, Calendar, Clock, User, Tag, Mail, CheckCircle2, Sparkles, X, Share2 } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const handleGenerateAISummary = (post: BlogPost) => {
    setGeneratingSummary(true);
    setAiSummary(null);

    setTimeout(() => {
      setAiSummary(
        `AI Summary: "${post.title}" highlights key legal considerations under Indian Law. Advocate Bhavani Singh advises strict adherence to statutory timelines, filing comprehensive supporting affidavits, and seeking pre-litigation mediation where applicable to protect personal and financial rights.`
      );
      setGeneratingSummary(false);
    }, 1000);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059] block mb-1">Legal Insights &amp; Articles</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1e293b]">
              News, Tips and Legal Updates
            </h2>
          </div>

          <button
            onClick={() => {
              if (BLOG_POSTS.length > 0) setSelectedPost(BLOG_POSTS[0]);
            }}
            className="px-6 py-2.5 border border-[#1e293b] text-[#1e293b] hover:bg-[#1e293b] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Explore All Blogs</span>
            <ChevronRight className="w-4 h-4 text-[#c5a059]" />
          </button>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="group bg-white border border-slate-200 hover:border-[#c5a059] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-52 overflow-hidden bg-slate-200">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1e293b] text-[#c5a059] text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                      {post.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif text-[#1e293b] mb-3 group-hover:text-[#c5a059] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{post.author}</span>
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setAiSummary(null);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#1e293b] hover:text-[#c5a059] transition-colors cursor-pointer"
                >
                  <span>Read More</span>
                  <ChevronRight className="w-4 h-4 text-[#c5a059]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription Banner */}
        <div className="bg-[#1e293b] p-8 sm:p-12 text-white shadow-sm relative overflow-hidden border-t-2 border-[#c5a059]">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059] block">
              Stay Updated with Legal Precedents
            </span>

            <h3 className="text-2xl sm:text-4xl font-serif text-white">
              Subscribe to Legal Insights Newsletter
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
              Receive monthly breakdowns of Supreme Court judgments, Delhi High Court precedent orders, matrimonial statutory updates, and corporate compliance guides directly in your inbox.
            </p>

            {newsletterSubscribed ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-medium max-w-md mx-auto flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Thank you for subscribing to our legal newsletter!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full sm:flex-1 px-5 py-3 bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#c5a059]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <span className="px-3 py-1 bg-[#1e293b] text-[#c5a059] text-[10px] font-bold uppercase tracking-wider">
                {selectedPost.category}
              </span>

              <h2 className="text-2xl sm:text-3xl font-serif text-[#1e293b] leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-200">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <User className="w-3.5 h-3.5 text-[#c5a059]" />
                  {selectedPost.author} ({selectedPost.authorRole})
                </span>
                <span>&bull;</span>
                <span>{selectedPost.date}</span>
                <span>&bull;</span>
                <span>{selectedPost.readTime}</span>
              </div>

              {/* AI Summary Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1e293b] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#c5a059]" /> AI Key Takeaway
                  </span>
                  {!aiSummary && (
                    <button
                      onClick={() => handleGenerateAISummary(selectedPost)}
                      disabled={generatingSummary}
                      className="px-3 py-1 bg-[#1e293b] text-[#c5a059] text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {generatingSummary ? 'Generating...' : 'Summarize Article'}
                    </button>
                  )}
                </div>
                {aiSummary && (
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 border border-slate-200">
                    {aiSummary}
                  </p>
                )}
              </div>

              {/* Article Content */}
              <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-3 whitespace-pre-line">
                {selectedPost.fullArticle}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {selectedPost.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 bg-[#1e293b] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
