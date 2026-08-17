import React, { useState } from 'react';
import { useFirmData } from '../hooks/useFirmData';
import { BlogPost } from '../types';
import { formatDateToDDMMYYYY } from '../utils/dateFormatter';
import { Calendar, User, Clock, Search, ArrowRight, Share2, Bookmark, X } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { blogs, firmDetails } = useFirmData();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredPosts = blogs.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Legal Insights &amp; Updates</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1e293b]">Legal Articles &amp; High Court News</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Expert analysis published by {firmDetails.founderName} on Allahabad High Court judgments, Supreme Court precedents, criminal law amendments, and UP property regulations.
          </p>
        </div>

        {/* Search & Newsletter Bar */}
        <div className="bg-white p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Search Field */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search legal topics, writs, CrPC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* Newsletter Subscribe Box */}
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
            {subscribed ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 border border-emerald-200">
                ✓ Subscribed to Daily High Court Bulletin!
              </span>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Enter email for legal newsletter"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#c5a059] w-full md:w-64"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#a88442] text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#c5a059] transition-all duration-300">
              
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={post.imageUrl || post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <span className="absolute top-3 left-3 bg-[#1e293b] text-[#c5a059] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-[#c5a059]/40">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                      {formatDateToDDMMYYYY(post.date)}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-[#1e293b] group-hover:text-[#c5a059] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-[11px] font-semibold text-slate-500">
                  By {post.author}
                </span>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#c5a059] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Full Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 space-y-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2 border-b pb-4">
              <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 bg-[#1e293b] text-[#c5a059] inline-block">
                {selectedPost.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#1e293b]">{selectedPost.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span>By <strong>{selectedPost.author}</strong> ({selectedPost.authorRole})</span>
                <span>&bull;</span>
                <span>{formatDateToDDMMYYYY(selectedPost.date)}</span>
                <span>&bull;</span>
                <span>{selectedPost.readTime}</span>
              </div>
            </div>

            <div className="relative h-64 overflow-hidden bg-slate-900 border">
              <img src={selectedPost.imageUrl || selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900 text-base">{selectedPost.excerpt}</p>
              <div className="whitespace-pre-line leading-relaxed">{selectedPost.fullArticle || selectedPost.excerpt}</div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between text-xs">
              <span className="text-slate-400">Tags: {selectedPost.tags.join(', ')}</span>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2 bg-[#1e293b] text-white font-bold uppercase tracking-wider hover:bg-slate-800"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
