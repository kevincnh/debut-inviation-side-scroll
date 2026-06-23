import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// ─── data ────────────────────────────────────────────────────────────────────

interface Photo {
  id: number;
  src: string;
  alt: string;
  category: "showcase" | "gallery";
  caption: string;
  year?: string;
  span?: "wide" | "tall" | "normal";
  description?: string;
}

const photos: Photo[] = [
  // showcase (timeline)
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=1600&fit=crop&auto=format",
    alt: "Young Sofia playing in sunlight",
    category: "showcase",
    caption: "A Joyful Beginning",
    year: "2008",
    description: "The earliest memories bathed in golden sunlight, where every fallen leaf and gentle breeze held a new discovery.",
    span: "tall",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=1600&fit=crop&auto=format",
    alt: "Childhood garden",
    category: "showcase",
    caption: "Roots in the Garden",
    year: "2013",
    description: "A quiet sanctuary of blooming flowers where imagination ran wild and the seeds of creativity were first planted.",
    span: "tall",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h=1600&fit=crop&auto=format",
    alt: "Ballet recital",
    category: "showcase",
    caption: "Pointe and Grace",
    year: "2018",
    description: "Countless hours of discipline, worn-out slippers, and the beautiful pursuit of perfection on stage.",
    span: "tall",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=1600&fit=crop&auto=format",
    alt: "Portrait in golden light",
    category: "showcase",
    caption: "Edge of Eighteen",
    year: "2024",
    description: "A quiet moment of reflection, poised on the edge of adulthood. The calm before a beautiful storm of celebration.",
    span: "tall",
  },

  // gallery (pre-debut shoot)
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop&auto=format",
    alt: "Debut portrait in gown",
    category: "gallery",
    caption: "Elegance",
    span: "tall",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop&auto=format",
    alt: "Grand ballroom entrance",
    category: "gallery",
    caption: "The Grandeur",
    span: "wide",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&auto=format",
    alt: "Debut gown detail",
    category: "gallery",
    caption: "Details in Champagne",
    span: "normal",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=1200&h=800&fit=crop&auto=format",
    alt: "Cotillion waltz",
    category: "gallery",
    caption: "The Waltz",
    span: "wide",
  },
  {
    id: 17,
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1200&fit=crop&auto=format",
    alt: "Flowers and celebration",
    category: "gallery",
    caption: "Dusty Rose",
    span: "tall",
  },
  {
    id: 18,
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop&auto=format",
    alt: "Dinner reception",
    category: "gallery",
    caption: "Gathered with Love",
    span: "wide",
  },
];

const showcasePhotos = photos.filter(p => p.category === "showcase");
const galleryPhotos = photos.filter(p => p.category === "gallery");

// ─── lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-foreground/60 hover:text-primary transition-colors z-10"
      >
        <X size={32} strokeWidth={1} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-12 text-foreground/40 hover:text-primary transition-colors z-10"
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-12 text-foreground/40 hover:text-primary transition-colors z-10"
      >
        <ChevronRight size={48} strokeWidth={1} />
      </button>

      <div
        className="max-w-5xl w-full mx-12 flex flex-col items-center gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[80vh] w-auto object-contain shadow-2xl"
        />
        <div className="text-center">
          <p
            className="text-foreground/90 text-2xl md:text-3xl"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic" }}
          >
            {photo.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── left panel (sticky invitation) ───────────────────────────────────────────

function LeftPanel() {
  return (
    <div className="w-full lg:w-5/12 lg:fixed lg:top-0 lg:h-screen min-h-[90vh] relative border-b lg:border-b-0 lg:border-r border-primary/20 flex flex-col overflow-hidden">
      
      {/* Background with delicate fade */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop&auto=format"
          alt="Sofia"
          className="w-full h-full object-cover opacity-15 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between p-8 md:p-12 lg:p-16">
        
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <p className="text-primary text-xs tracking-[0.4em] uppercase font-['Jost']">The Debut</p>
          <span className="text-primary/30 text-6xl leading-none" style={{ fontFamily: "'Gloock', serif" }}>
            XVIII
          </span>
        </div>

        {/* Center Typography */}
        <div className="my-16 lg:my-0">
          <h1
            className="text-[5rem] lg:text-[7rem] leading-[0.8] mb-2 text-foreground"
            style={{ fontFamily: "'Gloock', serif" }}
          >
            Sofia
          </h1>
          <h1
            className="text-[4.5rem] lg:text-[6rem] leading-[0.8] text-primary mb-10"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic" }}
          >
            Reyes
          </h1>
          
          <div className="w-12 h-px bg-primary/40 mb-10" />
          
          <p className="text-foreground/80 font-['Jost'] font-light tracking-[0.3em] uppercase text-sm md:text-base leading-relaxed">
            You are joyfully invited <br /> to celebrate her debut
          </p>
        </div>

        {/* Bottom Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm border-t border-primary/20 pt-8">
          <div>
            <span className="block text-primary tracking-[0.3em] uppercase mb-3 font-['Jost'] text-xs">When</span>
            <span className="font-['Jost'] font-light text-foreground/80 leading-loose">
              Saturday, June 28 <br /> 6:00 in the evening
            </span>
          </div>
          <div>
            <span className="block text-primary tracking-[0.3em] uppercase mb-3 font-['Jost'] text-xs">Where</span>
            <span className="font-['Jost'] font-light text-foreground/80 leading-loose">
              The Grand Ballroom <br /> Makati Shangri-La
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="block text-primary tracking-[0.3em] uppercase mb-3 font-['Jost'] text-xs">Attire</span>
            <span className="font-['Jost'] font-light text-foreground/80 leading-loose">
              Formal / Black Tie (Champagne & Noir)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── right panel (scrolling showcase & gallery) ───────────────────────────────

function RightPanel({ onOpenLightbox }: { onOpenLightbox: (index: number) => void }) {
  return (
    <div className="w-full lg:w-7/12 lg:ml-[41.666667%] min-h-screen bg-background">
      
      {/* Cover Image */}
      <div className="h-[60vh] lg:h-screen w-full relative border-b border-primary/20">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=2000&fit=crop&auto=format"
          alt="Gown detail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
        <div className="absolute bottom-8 left-8 lg:bottom-16 lg:left-16">
          <p className="text-primary text-xs tracking-[0.4em] uppercase font-['Jost'] mb-4">Chapter One</p>
          <h2 className="text-4xl lg:text-6xl text-foreground drop-shadow-lg" style={{ fontFamily: "'Gloock', serif" }}>
            The Prelude
          </h2>
        </div>
      </div>

      {/* Showcase Archival Layout */}
      <div className="flex flex-col">
        {showcasePhotos.map((photo, index) => (
          <div key={photo.id} className="p-8 lg:p-16 border-b border-primary/20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
              <span className="text-primary font-['Jost'] tracking-[0.4em] text-sm uppercase">
                {photo.year}
              </span>
              <h3 
                className="text-3xl lg:text-4xl text-foreground" 
                style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic" }}
              >
                {photo.caption}
              </h3>
            </div>
            
            {/* Structured Image Box */}
            <div className="mb-10 overflow-hidden group border border-primary/10 p-2 lg:p-4 bg-secondary/5">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-auto max-h-[70vh] object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            
            {/* Description */}
            <div className="flex md:justify-end">
              <p className="text-foreground/80 font-['Jost'] font-light text-lg lg:text-xl leading-relaxed max-w-xl text-left md:text-right border-l md:border-l-0 md:border-r border-primary/30 pl-6 md:pl-0 md:pr-6 py-2">
                {photo.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Gallery Section */}
      <div className="p-8 lg:p-16 border-b border-primary/20 bg-secondary/10">
        <div className="mb-16 text-center">
          <p className="text-primary text-xs tracking-[0.4em] uppercase font-['Jost'] mb-4">The Portfolio</p>
          <h2 className="text-4xl lg:text-6xl text-foreground" style={{ fontFamily: "'Gloock', serif" }}>
            Captured Elegance
          </h2>
          <div className="w-px h-16 bg-primary/40 mx-auto mt-8" />
        </div>

        {/* Structured Masonry Grid */}
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {galleryPhotos.map((photo, i) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer overflow-hidden border border-primary/10 break-inside-avoid"
              onClick={() => onOpenLightbox(i)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform"
              />
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6 text-center backdrop-blur-sm">
                <p 
                  className="text-foreground text-2xl lg:text-3xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500" 
                  style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic" }}
                >
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP Section */}
      <div className="p-12 lg:p-32 flex flex-col items-center text-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full w-[150%] left-[-25%] h-[150%] top-[-25%] pointer-events-none" />
        </div>

        <div className="relative z-10">
          <p className="text-primary text-xs tracking-[0.4em] uppercase font-['Jost'] mb-6">RSVP</p>
          <h2 className="text-5xl lg:text-7xl text-foreground mb-8" style={{ fontFamily: "'Gloock', serif" }}>
            Will You Join Us?
          </h2>
          <p className="font-['Jost'] font-light text-foreground/80 text-xl lg:text-2xl mb-16 leading-relaxed">
            Please grace us with your response <br className="hidden md:block"/>
            by the 1st of June, 2026.
          </p>
          <button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-background px-12 py-5 uppercase tracking-[0.3em] font-['Jost'] text-sm transition-colors duration-500">
            Confirm Attendance
          </button>
        </div>
      </div>

    </div>
  );
}

// ─── app ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const nextPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % galleryPhotos.length);
  }, [lightboxIndex]);

  const prevPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length);
  }, [lightboxIndex]);

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/20 selection:text-primary flex flex-col lg:flex-row relative">
      
      <LeftPanel />
      <RightPanel onOpenLightbox={openLightbox} />

      {lightboxIndex !== null && (
        <Lightbox
          photos={galleryPhotos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrev={prevPhoto}
        />
      )}
    </div>
  );
}
