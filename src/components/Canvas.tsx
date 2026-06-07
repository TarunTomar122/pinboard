"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Pin } from "@/types";
import { getPins, savePins } from "@/lib/store";
import { seedPins } from "@/lib/seed";
import { forceLayout } from "@/lib/layout";
import PinCard from "./PinCard";
import PinModal from "./PinModal";
import Toolbar from "./Toolbar";

export default function Canvas() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState("");
  const [modalPin, setModalPin] = useState<Pin | null>(null);
  const [isNewPin, setIsNewPin] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for interaction state
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  const dragPinId = useRef<string | null>(null);
  const dragStartMouse = useRef({ x: 0, y: 0 });
  const dragStartPin = useRef({ x: 0, y: 0 });
  const dragMoved = useRef(0);

  // Touch zoom state
  const lastTouchDist = useRef(0);
  const lastTouchCenter = useRef({ x: 0, y: 0 });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load pins
  useEffect(() => {
    getPins().then((data) => {
      if (data.length > 0) {
        setPins(data);
      } else {
        setPins(seedPins);
      }
      setLoading(false);
    });
  }, []);

  // Debounced save
  const debouncedSave = useCallback((updatedPins: Pin[]) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      savePins(updatedPins);
    }, 1000);
  }, []);

  // Update pin position
  const updatePinPosition = useCallback(
    (id: string, x: number, y: number) => {
      setPins((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, x, y } : p));
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  // Save entire pin (modal edit)
  const savePin = useCallback(
    (pin: Pin) => {
      setPins((prev) => {
        const idx = prev.findIndex((p) => p.id === pin.id);
        let updated: Pin[];
        if (idx >= 0) {
          updated = [...prev];
          updated[idx] = pin;
        } else {
          updated = [...prev, pin];
        }
        debouncedSave(updated);
        return updated;
      });
      setModalPin(null);
      setIsNewPin(false);
    },
    [debouncedSave]
  );

  // Delete pin
  const deletePin = useCallback(
    (id: string) => {
      setPins((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        debouncedSave(updated);
        return updated;
      });
      setModalPin(null);
      setIsNewPin(false);
    },
    [debouncedSave]
  );

  // Add new pin at position
  const addPinAtPosition = useCallback(
    (canvasX: number, canvasY: number) => {
      const newPin: Pin = {
        id: `pin-${Date.now()}`,
        title: "",
        description: "",
        url: "",
        tags: [],
        notes: "",
        x: Math.round(canvasX / 20) * 20,
        y: Math.round(canvasY / 20) * 20,
        createdAt: new Date().toISOString(),
      };
      setModalPin(newPin);
      setIsNewPin(true);
    },
    []
  );

  // Canvas mouse coords to canvas coords
  const screenToCanvas = useCallback(
    (clientX: number, clientY: number) => {
      return {
        x: (clientX - panX) / zoom,
        y: (clientY - 56 - panY) / zoom, // 56 = toolbar height
      };
    },
    [panX, panY, zoom]
  );

  // === MOUSE EVENTS ===

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start pan on the canvas background (not cards)
      if ((e.target as HTMLElement).closest(".pin-card")) return;
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      panOrigin.current = { x: panX, y: panY };
    },
    [panX, panY]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning.current) {
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setPanX(panOrigin.current.x + dx);
        setPanY(panOrigin.current.y + dy);
        return;
      }

      if (dragPinId.current) {
        const dx = (e.clientX - dragStartMouse.current.x) / zoom;
        const dy = (e.clientY - dragStartMouse.current.y) / zoom;
        dragMoved.current += Math.abs(dx) + Math.abs(dy);
        updatePinPosition(
          dragPinId.current,
          dragStartPin.current.x + (e.clientX - dragStartMouse.current.x) / zoom,
          dragStartPin.current.y + (e.clientY - dragStartMouse.current.y) / zoom
        );
      }
    };

    const handleMouseUp = () => {
      isPanning.current = false;
      dragPinId.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [zoom, updatePinPosition]);

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.min(3, Math.max(0.2, zoom * (1 + delta)));

      // Zoom centered on cursor
      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top - 56; // toolbar offset

      const newPanX = cursorX - (cursorX - panX) * (newZoom / zoom);
      const newPanY = cursorY - (cursorY - panY) * (newZoom / zoom);

      setZoom(newZoom);
      setPanX(newPanX);
      setPanY(newPanY);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [zoom, panX, panY]);

  // Double click to add
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".pin-card")) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const canvasX = (e.clientX - rect.left - panX) / zoom;
      const canvasY = (e.clientY - rect.top - 56 - panY) / zoom;
      addPinAtPosition(canvasX, canvasY);
    },
    [panX, panY, zoom, addPinAtPosition]
  );

  // === TOUCH EVENTS ===

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch start
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
        lastTouchCenter.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
      } else if (e.touches.length === 1) {
        const target = e.touches[0].target as HTMLElement;
        if (target.closest(".pin-card")) return;
        isPanning.current = true;
        panStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        panOrigin.current = { x: panX, y: panY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = dist / lastTouchDist.current;
        const newZoom = Math.min(3, Math.max(0.2, zoom * scale));

        const center = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
        const rect = el.getBoundingClientRect();
        const cx = center.x - rect.left;
        const cy = center.y - rect.top - 56;

        const newPanX = cx - (cx - panX) * (newZoom / zoom);
        const newPanY = cy - (cy - panY) * (newZoom / zoom);

        setZoom(newZoom);
        setPanX(newPanX);
        setPanY(newPanY);
        lastTouchDist.current = dist;
      } else if (e.touches.length === 1 && isPanning.current) {
        const dx = e.touches[0].clientX - panStart.current.x;
        const dy = e.touches[0].clientY - panStart.current.y;
        setPanX(panOrigin.current.x + dx);
        setPanY(panOrigin.current.y + dy);
      }
    };

    const handleTouchEnd = () => {
      isPanning.current = false;
      lastTouchDist.current = 0;
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [zoom, panX, panY]);

  // === CARD INTERACTION ===

  const handleCardMouseDown = useCallback(
    (e: React.MouseEvent, pinId: string) => {
      e.stopPropagation();
      const pin = pins.find((p) => p.id === pinId);
      if (!pin) return;
      dragPinId.current = pinId;
      dragStartMouse.current = { x: e.clientX, y: e.clientY };
      dragStartPin.current = { x: pin.x, y: pin.y };
      dragMoved.current = 0;
    },
    [pins]
  );

  const handleCardTouchStart = useCallback(
    (e: React.TouchEvent, pinId: string) => {
      e.stopPropagation();
      const pin = pins.find((p) => p.id === pinId);
      if (!pin) return;
      dragPinId.current = pinId;
      dragStartMouse.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      dragStartPin.current = { x: pin.x, y: pin.y };
      dragMoved.current = 0;

      // Touch drag handler
      const handleTouchMove = (ev: TouchEvent) => {
        if (!dragPinId.current) return;
        const dx = (ev.touches[0].clientX - dragStartMouse.current.x) / zoom;
        const dy = (ev.touches[0].clientY - dragStartMouse.current.y) / zoom;
        dragMoved.current += Math.abs(dx) + Math.abs(dy);
        updatePinPosition(
          dragPinId.current,
          dragStartPin.current.x + dx,
          dragStartPin.current.y + dy
        );
      };
      const handleTouchEnd = () => {
        dragPinId.current = null;
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    },
    [pins, zoom, updatePinPosition]
  );

  const handleCardClick = useCallback(
    (pin: Pin) => {
      // Only if we didn't drag
      if (dragMoved.current < 5) {
        setModalPin(pin);
        setIsNewPin(false);
      }
    },
    []
  );

  // === TOOLBAR ACTIONS ===

  const handleAddPin = useCallback(() => {
    // Add at center of viewport
    const canvasPos = screenToCanvas(window.innerWidth / 2, window.innerHeight / 2);
    addPinAtPosition(canvasPos.x, canvasPos.y);
  }, [screenToCanvas, addPinAtPosition]);

  const handleArrange = useCallback(() => {
    // Get viewport center in canvas coords
    const center = screenToCanvas(window.innerWidth / 2, window.innerHeight / 2);
    const positions = forceLayout(pins, center);

    setAnimating(true);
    setPins((prev) => {
      const updated = prev.map((p) => {
        const pos = positions.get(p.id);
        return pos ? { ...p, x: pos.x, y: pos.y } : p;
      });
      debouncedSave(updated);
      return updated;
    });
    setTimeout(() => setAnimating(false), 600);
  }, [pins, screenToCanvas, debouncedSave]);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(3, z * 1.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.2, z / 1.2));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  // Search filtering
  const isPinVisible = useCallback(
    (pin: Pin) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        pin.title.toLowerCase().includes(q) ||
        pin.description.toLowerCase().includes(q) ||
        pin.notes.toLowerCase().includes(q) ||
        pin.tags.some((t) => t.toLowerCase().includes(q))
      );
    },
    [search]
  );

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#86868b",
          fontSize: 14,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        onAddPin={handleAddPin}
        onArrange={handleArrange}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />

      <div
        ref={containerRef}
        onMouseDown={handleCanvasMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{
          position: "absolute",
          top: 56, // toolbar height
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          cursor: isPanning.current ? "grabbing" : "grab",
          background: "#fff",
        }}
      >
        {/* Dot grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, #e5e5e7 1px, transparent 1px)",
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${panX}px ${panY}px`,
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        {/* Canvas transform layer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "0 0",
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transition: animating ? "transform 0.5s ease" : "none",
          }}
        >
          {pins.map((pin) => (
            <PinCard
              key={pin.id}
              pin={pin}
              dimmed={search.trim() !== "" && !isPinVisible(pin)}
              onMouseDown={handleCardMouseDown}
              onTouchStart={handleCardTouchStart}
              onClick={handleCardClick}
              onDelete={deletePin}
            />
          ))}
        </div>
      </div>

      {modalPin && (
        <PinModal
          pin={modalPin}
          isNew={isNewPin}
          onSave={savePin}
          onClose={() => {
            setModalPin(null);
            setIsNewPin(false);
          }}
          onDelete={deletePin}
        />
      )}
    </div>
  );
}
