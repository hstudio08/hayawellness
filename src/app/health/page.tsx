import Image from "next/image";
import Link from "next/link";
import { HEALTH_ARTICLES } from "@/data/mockContent";
import { Clock } from "lucide-react";

export default function HealthInsightsPage() {
  return (
    <main className="flex flex-col w-full pb-24">
      <section className="bg-ivory-warm py-16 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-deep mb-6">Health & Insights</h1>
          <p className="text-lg text-text-muted">
            Expert medical advice, health tips, and wellness information from our specialists.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HEALTH_ARTICLES.map(article => (
            <Link key={article.id} href={`/health/${article.slug}`} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col group">
              <div className="relative h-56 w-full">
                <Image src={article.coverImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-deep">
                  {article.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-serif text-emerald-deep mb-3 group-hover:text-emerald-teal transition-colors">{article.title}</h3>
                <p className="text-text-muted text-sm mb-6 flex-1">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-text-muted border-t border-gray-100 pt-4 mt-auto">
                  <span>{article.author}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readingTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
