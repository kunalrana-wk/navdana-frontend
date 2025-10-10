import React, { useState, useEffect, useRef } from "react";
import { LuEye } from "react-icons/lu";

// Replace with your Instagram credentials or use mocked data for local testing
const DEMO_USER_ID = "17841476089772806";
const DEMO_ACCESS_TOKEN =
  "IGAAhRZCVkZCeY9BZAE5XTERRcXVKNW1Dd0tQTjZAxZA0I1c1ktM3o4X0l3d2VMODVYZAmo5ZAWhFTEFWZAXl5N3o4RWVyeWNOUUpFNnhjajAtOXJyT1g5b1dxaFVWNjdwZAHJQaHZAZAMDRJa2pSTUZAIaHhyZA3R3RkNoSUJ2NVlvVVd2TFViawZDZD";

export default function App() {
  return (
    <div className="overflow-x-hidden">

      {/* <InstagramReels userId={DEMO_USER_ID} accessToken={DEMO_ACCESS_TOKEN} /> */}
    </div>
  );
}

const InstagramReels = ({ userId, accessToken }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [modalAddToCartMedia, setModalAddToCartMedia] = useState(null);

  // Mobile reel modal
  const [showMobileReel, setShowMobileReel] = useState(false);
  const [mobileReelIndex, setMobileReelIndex] = useState(0);

  // responsive card width
  const [cardWidth, setCardWidth] = useState(320);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardWidth(220);
      else if (window.innerWidth < 1024) setCardWidth(260);
      else setCardWidth(320);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCards = Math.max(1, Math.floor(window.innerWidth / (cardWidth + 24)));
  const maxSlides = Math.max(0, media.length - visibleCards);

  // auto-scroll
  useEffect(() => {
    if (media.length <= visibleCards) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev < maxSlides ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxSlides, media.length, visibleCards]);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: currentSlide * (cardWidth + 24),
        behavior: "smooth",
      });
    }
  }, [currentSlide, cardWidth]);

  const openMediaPopup = (idx) => {
    if (window.innerWidth < 640 && media[idx]?.media_type === "VIDEO") {
      // open mobile vertical reel and set initial index to correct position in video-only list
      const videos = media.filter((m) => m.media_type === "VIDEO");
      const initialIndex = videos.findIndex((v) => v.id === media[idx].id);
      setMobileReelIndex(initialIndex >= 0 ? initialIndex : 0);
      setShowMobileReel(true);
      setMuted(false);
      setModalAddToCartMedia(null);
    } else {
      setModalIndex(idx);
      setMuted(false);
      setShowModal(true);
      setModalAddToCartMedia(null);
    }
  };

  const toggleMute = () => setMuted((m) => !m);

  const handleShareProduct = (item) => {
    if (!item) return;
    if (navigator.share) {
      navigator
        .share({
          title: item.media_type === "VIDEO" ? "Instagram Reel" : "Instagram Image",
          text: item.caption || "",
          url: item.permalink || window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(item.permalink || window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const handleViewBag = (item) => {
    alert("View Bag: " + (item?.caption || item?.media_type));
  };

  useEffect(() => {
    const fetchInstagramMedia = async () => {
      if (!userId || !accessToken) {
        setError("User ID and Access Token are required");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,thumbnail_url,caption,permalink,timestamp,like_count&access_token=${accessToken}`
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const mediaData = data.data?.filter((item) => item.media_type === "VIDEO" || item.media_type === "IMAGE") || [];
        setMedia(mediaData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch Instagram media. Please check credentials or network.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstagramMedia();
  }, [userId, accessToken]);

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const truncateCaption = (caption, maxLength = 100) => {
    if (!caption) return "";
    return caption.length > maxLength ? caption.substring(0, maxLength) + "..." : caption;
  };

  const handleAddToCart = (item) => {
    alert("Added to cart: " + (truncateCaption(item?.caption, 30) || item?.media_type));
  };

  const handleModalAddToCart = (item) => {
    if (!item) return;
    setModalAddToCartMedia(item.id);
    setTimeout(() => setModalAddToCartMedia(null), 1200);
    alert("Added to cart: " + (truncateCaption(item?.caption, 30) || item?.media_type));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-700 p-8">
        <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg font-medium">Loading Instagram Media...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-700 p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Error Loading Media</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-700 p-8">
        <div className="bg-white/90 border border-gray-200 rounded-xl p-8 max-w-md text-center shadow-lg">
          <h3 className="text-xl font-semibold mb-2">No Media Found</h3>
          <p>No Instagram Reels or Images were found for this account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-medium">Explore & Buy</h2>
      </div>

      <div className="relative">
        {/* Prev Button */}
        <button
          onClick={() => currentSlide > 0 && setCurrentSlide((s) => s - 1)}
          className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 sm:p-3 border border-gray-200 bg-white/80 ${
            currentSlide === 0 ? "opacity-40 cursor-not-allowed" : "hover:scale-110"
          }`}
          disabled={currentSlide === 0}
          aria-label="Previous"
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="black" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={() => currentSlide < maxSlides && setCurrentSlide((s) => s + 1)}
          className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 sm:p-3 border border-gray-200 bg-white/80 ${
            currentSlide === maxSlides ? "opacity-40 cursor-not-allowed" : "hover:scale-110"
          }`}
          disabled={currentSlide === maxSlides}
          aria-label="Next"
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="black" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel: swipeable, snap, hidden scrollbar */}
        <div
          ref={carouselRef}
          className="flex gap-6 px-2 sm:px-16 py-6 scroll-smooth hide-scrollbar overflow-x-auto sm:overflow-x-hidden snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
          onScroll={(e) => {
            const scrollLeft = e.target.scrollLeft;
            const slideWidth = cardWidth + 24; // card width + gap
            const idx = Math.round(scrollLeft / slideWidth);
            if (idx !== currentSlide) setCurrentSlide(idx);
          }}
        >
          {media.map((item, idx) => (
            <div key={item.id} className="flex-none snap-start" style={{ width: cardWidth }}>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 duration-200 shadow-sm">
                <div className="relative group">
                  {item.media_type === "VIDEO" ? (
                    <video
                      className="w-full h-64 sm:h-80 md:h-96 object-cover bg-gray-100 group-hover:brightness-90 transition duration-200"
                      poster={item.thumbnail_url}
                      preload="metadata"
                      autoPlay
                      muted
                      loop
                      style={{ aspectRatio: "9/16" }}
                    >
                      <source src={item.media_url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      className="w-full h-64 sm:h-80 md:h-96 object-cover bg-gray-100 group-hover:brightness-90 transition duration-200"
                      src={item.media_url}
                      alt={item.caption || "Instagram Image"}
                      style={{ aspectRatio: "9/16" }}
                    />
                  )}

                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10 shadow">
                    <LuEye className="w-3.5 h-3.5 text-pink-400" />
                    <span>
                      {typeof item.like_count === "number" ? `${item.like_count} View${item.like_count !== 1 ? "s" : ""}` : "View"}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-200"></div>

                  {/* Play/View Icon */}
                  <button
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200"
                    onClick={() => openMediaPopup(idx)}
                    aria-label={item.media_type === "VIDEO" ? "Play Reel" : "View Image"}
                  >
                    <span className="text-pink-600 font-bold px-4 py-2 rounded-full text-sm flex items-center justify-center">
                      {item.media_type === "VIDEO" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="#fff" opacity="0.7" />
                          <polygon points="10,8 16,12 10,16" fill="#ec4899" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="#fff" opacity="0.7" />
                          <rect x="8" y="8" width="8" height="8" rx="2" fill="#ec4899" />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>

                {/* <div className="p-4 sm:p-6">
                  <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <img className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-gray-200 shadow" src={item.thumbnail_url || item.media_url} alt={item.caption} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1 truncate">{item.media_type === "VIDEO" ? "Instagram Reel" : "Instagram Image"}</h3>
                      <p className="text-gray-600 text-xs mb-2 truncate">{truncateCaption(item.caption)}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-gray-500">{formatDate(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleAddToCart(item)} className="w-full flex justify-center items-center bg-black text-white py-1 sm:py-2 rounded-md font-semibold hover:bg-gray-900 transition-all duration-200 shadow text-xs sm:text-sm">
                    Add to Cart
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop/Tablet Modal */}
      {showModal && (
        <MediaModal
          item={media[modalIndex]}
          showModal={showModal}
          setShowModal={setShowModal}
          muted={muted}
          toggleMute={toggleMute}
          handleViewBag={handleViewBag}
          handleShareProduct={handleShareProduct}
          truncateCaption={truncateCaption}
          formatDate={formatDate}
          handleAddToCart={handleModalAddToCart}
          addToCartMediaId={modalAddToCartMedia}
        />
      )}

      {/* Mobile Reel Modal */}
      {showMobileReel && (
        <MobileReelModal
          media={media.filter((m) => m.media_type === "VIDEO")}
          initialIndex={mobileReelIndex}
          showModal={showMobileReel}
          setShowModal={setShowMobileReel}
          muted={muted}
          setMuted={setMuted}
          handleViewBag={handleViewBag}
          handleShareProduct={handleShareProduct}
          truncateCaption={truncateCaption}
          formatDate={formatDate}
          handleAddToCart={handleModalAddToCart}
          addToCartMediaId={modalAddToCartMedia}
        />
      )}
    </div>
  );
};

const MediaModal = ({ item, showModal, setShowModal, muted, toggleMute, handleViewBag, handleShareProduct, truncateCaption, formatDate, handleAddToCart, addToCartMediaId }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  if (isMobile && item?.media_type === "VIDEO") return null;

  const modalWidthClass = isMobile ? "w-full h-full rounded-none" : "w-full max-w-[320px] rounded-2xl";

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target.classList.contains("bg-black/80")) setShowModal(false);
      }}
    >
      <div className={`relative bg-black overflow-hidden shadow-2xl flex flex-col ${modalWidthClass}`} style={isMobile ? { maxWidth: "100vw", maxHeight: "100vh", height: "100vh" } : { maxWidth: 320 }}>
        <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 rounded-full p-2 z-30 text-black" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative flex-1 flex flex-col justify-center items-center">
          {item?.media_type === "VIDEO" ? (
            <video key={item?.media_url} className={isMobile ? "w-full h-full object-contain bg-black" : "w-full h-auto bg-black"} autoPlay muted={muted} style={isMobile ? { width: "100vw", height: "100vh", objectFit: "contain" } : { width: "100%", maxWidth: "320px", aspectRatio: "9/16", objectFit: "contain" }}>
              <source src={item?.media_url} type="video/mp4" />
            </video>
          ) : (
            <img key={item?.media_url} className={isMobile ? "w-full h-full object-contain bg-black" : "w-full h-auto bg-black"} src={item?.media_url} alt={item?.caption || "Instagram Image"} style={isMobile ? { width: "100vw", height: "100vh", objectFit: "contain" } : { width: "100%", maxWidth: "320px", aspectRatio: "9/16", objectFit: "contain" }} />
          )}

          {/* Controls moved up with higher z-index */}
          <div className="absolute left-0 right-0 flex flex-row justify-between items-center px-3 z-40" style={{ bottom: "5.5rem" }}>
            {item?.media_type === "VIDEO" ? (
              <button onClick={toggleMute} className="bg-black/60 hover:bg-black/80 rounded-full p-2 shadow" aria-label="Toggle Mute">
                <span className="text-white text-lg">{muted ? "🔇" : "🔊"}</span>
              </button>
            ) : (
              <div />
            )}

            <ThreeDotMenu onViewBag={() => handleViewBag(item)} onShareProduct={() => handleShareProduct(item)} />
          </div>
        </div>

        {/* Caption & Add-to-cart with safe area padding */}
        <div className="p-3 text-white text-center bg-black/80 z-30" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
          <div className="font-semibold text-sm mb-1 truncate">{truncateCaption(item?.caption)}</div>
          <div className="text-xs opacity-70">{formatDate(item?.timestamp)}</div>
          <button onClick={() => handleAddToCart(item)} className={`mt-3 w-full flex justify-center items-center bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition-all duration-200 shadow text-xs sm:text-sm ${addToCartMediaId === item?.id ? "opacity-70 pointer-events-none" : ""}`} disabled={addToCartMediaId === item?.id}>
            {addToCartMediaId === item?.id ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileReelModal = ({ media, initialIndex = 0, showModal, setShowModal, muted, setMuted, handleViewBag, handleShareProduct, truncateCaption, formatDate, handleAddToCart, addToCartMediaId }) => {
  const [current, setCurrent] = useState(initialIndex || 0);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  useEffect(() => {
    if (containerRef.current && current != null) {
      containerRef.current.scrollTo({ top: current * window.innerHeight, behavior: "instant" });
    }
  }, [current, showModal]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = () => {
    if (touchStartY.current == null || touchEndY.current == null) return;
    const delta = touchStartY.current - touchEndY.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0 && current < media.length - 1) setCurrent((c) => c + 1);
      else if (delta < 0 && current > 0) setCurrent((c) => c - 1);
    }
    touchStartY.current = null;
    touchEndY.current = null;
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowUp" && current > 0) setCurrent((c) => c - 1);
      else if (e.key === "ArrowDown" && current < media.length - 1) setCurrent((c) => c + 1);
      else if (e.key === "Escape") setShowModal(false);
    };
    if (showModal) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, media.length, showModal, setShowModal]);

  if (typeof window !== "undefined" && window.innerWidth >= 640) return null;

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === current) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [current, media]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col" style={{ height: "100vh", width: "100vw" }} onClick={(e) => { if (e.target.classList.contains("bg-black")) setShowModal(false); }}>
      <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 rounded-full p-2 z-30 text-black" aria-label="Close" style={{ zIndex: 100 }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div ref={containerRef} className="flex-1 overflow-y-scroll snap-y snap-mandatory" style={{ height: "100vh", scrollBehavior: "smooth" }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onScroll={() => {
        if (!containerRef.current) return;
        const scrollTop = containerRef.current.scrollTop;
        const idx = Math.round(scrollTop / window.innerHeight);
        if (idx !== current && idx >= 0 && idx < media.length) setCurrent(idx);
      }}>
        {media.map((item, idx) => (
          <div key={item.id} className="snap-center flex flex-col justify-center items-center relative" style={{ height: "100vh", width: "100vw" }}>
            <video ref={(el) => (videoRefs.current[idx] = el)} key={item.media_url} className="w-full h-full object-contain bg-black" src={item.media_url} autoPlay={idx === current} muted={muted} loop playsInline style={{ width: "100vw", height: "100vh", objectFit: "contain", background: "black" }} />

            {/* Controls moved up so they are clickable above Add to Cart */}
            <div className="absolute left-0 right-0 flex flex-row justify-between items-center px-3 z-40" style={{ bottom: "5.5rem" }}>
              <button onClick={() => setMuted((m) => !m)} className="bg-black/60 hover:bg-black/80 rounded-full p-2 shadow" aria-label="Toggle Mute">
                <span className="text-white text-lg">{muted ? "🔇" : "🔊"}</span>
              </button>

              <ThreeDotMenu onViewBag={() => handleViewBag(item)} onShareProduct={() => handleShareProduct(item)} />
            </div>

            {/* Caption + Add to Cart (safe area) */}
            <div className="absolute left-0 right-0 p-3 text-white text-center bg-black/80 z-30" style={{ bottom: 0, paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
              <div className="font-semibold text-sm mb-1 truncate">{truncateCaption(item?.caption)}</div>
              <div className="text-xs opacity-70">{formatDate(item?.timestamp)}</div>
              <button onClick={() => handleAddToCart(item)} className={`mt-3 w-full flex justify-center items-center bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition-all duration-200 shadow text-xs sm:text-sm ${addToCartMediaId === item?.id ? "opacity-70 pointer-events-none" : ""}`} disabled={addToCartMediaId === item?.id}>
                {addToCartMediaId === item?.id ? "Added!" : "Add to Cart"}
              </button>
            </div>

            {/* Up/Down indicators */}
            {idx > 0 && <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white/60 text-2xl select-none pointer-events-none">▲</div>}
            {idx < media.length - 1 && <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-2xl select-none pointer-events-none">▼</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const ThreeDotMenu = ({ onViewBag, onShareProduct }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen((v) => !v)} className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white" aria-label="More">
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 py-2">
          <button onClick={() => { setOpen(false); onViewBag && onViewBag(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black">View Bag</button>
          <button onClick={() => { setOpen(false); onShareProduct && onShareProduct(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black">Share Product</button>
        </div>
      )}
    </div>
  );
};