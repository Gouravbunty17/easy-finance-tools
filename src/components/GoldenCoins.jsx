import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GoldenCoins({ children, className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 10;

    // Detect dark mode from the html class and keep in sync
    const getBg = () =>
      document.documentElement.classList.contains('dark') ? 0x001a33 : 0x003366;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setClearColor(getBg(), 1);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Watch for dark/light mode changes
    const observer = new MutationObserver(() => renderer.setClearColor(getBg(), 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Lighting — strong white lights create specular shine on Phong material
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Key light — bright white for sharp specular flash
    const keyLight = new THREE.PointLight(0xffffff, 8, 60);
    keyLight.position.set(6, 6, 10);
    scene.add(keyLight);

    // Fill light — warm gold
    const fillLight = new THREE.PointLight(0xFFEE88, 5, 50);
    fillLight.position.set(-6, -4, 8);
    scene.add(fillLight);

    // Rim light — top white for edge shine
    const rimLight = new THREE.PointLight(0xffffff, 4, 40);
    rimLight.position.set(0, 10, 5);
    scene.add(rimLight);

    // Moving light — orbits scene for dynamic glint
    const movingLight = new THREE.PointLight(0xffffff, 6, 50);
    scene.add(movingLight);

    // MeshPhongMaterial — real specular highlights + strong emissive glow
    const goldMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFD700,
      specular: 0xFFFFFF,
      shininess: 200,
      emissive: 0xFFCC00,
      emissiveIntensity: 0.8,   // coins glow bright gold on their own
    });

    // Create coins (flat cylinders) — fewer on mobile to protect performance
    const coinCount = isMobile ? 16 : 35;
    const coins = [];
    for (let i = 0; i < coinCount; i++) {
      const geometry = new THREE.CylinderGeometry(0.55, 0.55, 0.08, 32);
      const coin = new THREE.Mesh(geometry, goldMaterial);

      coin.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6
      );
      coin.rotation.x = Math.random() * Math.PI;
      coin.rotation.z = Math.random() * Math.PI;

      coin.userData = {
        floatSpeed: 0.003 + Math.random() * 0.004,
        floatOffset: Math.random() * Math.PI * 2,
        rotateSpeed: 0.008 + Math.random() * 0.012,
        driftX: (Math.random() - 0.5) * 0.002,
      };

      scene.add(coin);
      coins.push(coin);
    }

    let frame;
    let t = 0;

    function animate() {
      frame = requestAnimationFrame(animate);
      t += 1;

      // Orbit the moving light to create dynamic glints across coins
      movingLight.position.set(
        Math.sin(t * 0.012) * 12,
        Math.cos(t * 0.008) * 8,
        10
      );

      coins.forEach(coin => {
        const ud = coin.userData;
        coin.rotation.y += ud.rotateSpeed;
        coin.position.y += Math.sin(t * ud.floatSpeed + ud.floatOffset) * 0.008;
        coin.position.x += ud.driftX;

        if (coin.position.x > 12) coin.position.x = -12;
        if (coin.position.x < -12) coin.position.x = 12;
      });

      renderer.render(scene, camera);
    }

    animate();

    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      {/* Three.js canvas fills the hero */}
      <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      {/* Text with shadow for readability — no dark overlay killing coin colours */}
      <div style={{
        position: "relative", zIndex: 1,
        textShadow: "0 2px 12px rgba(0,0,30,0.9), 0 1px 4px rgba(0,0,0,0.8)",
      }}>
        {children}
      </div>
    </div>
  );
}
