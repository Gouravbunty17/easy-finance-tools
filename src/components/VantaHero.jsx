import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function VantaHero({ children, className = "" }) {
  const containerRef = useRef(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect = null;

    async function initVanta() {
      const VANTA = await import("vanta/dist/vanta.net.min");
      vantaEffect = VANTA.default({
        el: containerRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x1a5fa8,        // soft blue lines — subtle, not harsh
        backgroundColor: 0x003366,
        points: 6,
        maxDistance: 18,
        spacing: 28,
      });
      vantaRef.current = vantaEffect;
    }

    initVanta();

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ position: "relative" }}>
      {/* Dark gradient overlay so text stays readable over the network */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, rgba(0,30,80,0.55) 0%, rgba(0,20,60,0.75) 100%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      {children}
    </div>
  );
}
