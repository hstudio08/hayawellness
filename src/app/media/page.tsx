import Image from "next/image";
import { MEDIA_ITEMS } from "@/data/mockContent";
import { Play, Image as ImageIcon } from "lucide-react";

export default function MediaPage() {
  return (
    <main className="flex flex-col w-full pb-24">
      <section className="bg-ivory-warm py-16 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-deep mb-6">Media & Updates</h1>
          <p className="text-lg text-text-muted">
            See what's happening at Haya Wellness Centre. Watch patient stories, health tips, and community events.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MEDIA_ITEMS.map(item => (
            <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 cursor-pointer group">
              <div className="relative h-64 w-full">
                <Image src={item.url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    {item.type === 'video' ? <Play className="w-8 h-8 ml-1" /> : <ImageIcon className="w-8 h-8" />}
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                  {item.type === 'video' ? item.duration : `${item.count} Photos`}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif text-emerald-deep font-medium">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
