import React, { useEffect, useRef } from 'react';

/**
 * Animated Dynamic Vibrant Tricolor River Canvas
 * Renders rich, high-vibrancy flowing sinusoidal waves representing the Indian Tricolor:
 * - Radiant Kesari / Saffron (#FF671F, #FF7800, #FF9933)
 * - Shimmering Silver White & Luminous Chakra Navy/Cyan (#FFFFFF, #002875, #00D2FF)
 * - Vibrant Sovereign India Green (#138808, #0D6838, #16A34A)
 * Enhanced with dynamic flowing river caustics, glowing particle sparks, and fluid organic harmonics.
 */
export default function TricolorRiverCanvas({ 
  opacity = 1.0, 
  speedMultiplier = 1.0,
  showParticles = true,
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent && parent.clientWidth > 0 ? parent.clientWidth : window.innerWidth;
      canvas.height = parent && parent.clientHeight > 0 ? parent.clientHeight : window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    let resizeObserver = null;
    if (window.ResizeObserver && canvas.parentElement) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas.parentElement);
    }

    // Particle system for glowing flowing river sparks
    const particleColors = [
      '#FF671F', // Kesari Saffron
      '#FFA14A', // Luminous Saffron
      '#FFFFFF', // Pure White Spark
      '#00D2FF', // Chakra Cyan
      '#002875', // Ashoka Navy
      '#138808', // India Green
      '#22C55E'  // Bright Emerald
    ];

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1.2,
      speedX: (Math.random() * 2.2 + 0.8) * speedMultiplier,
      speedY: (Math.random() - 0.5) * 0.6,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      opacity: Math.random() * 0.75 + 0.25,
      pulse: Math.random() * Math.PI * 2
    }));

    let step = 0;

    const drawWave = (yOffset, amplitude, frequency, speed, colorGradient, alpha) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width + 10; x += 8) {
        // Multi-harmonic compound sine wave for organic fluid river hydraulics
        const y =
          yOffset +
          Math.sin(x * frequency + step * speed) * amplitude +
          Math.cos(x * frequency * 0.65 + step * speed * 0.85) * (amplitude * 0.45) +
          Math.sin(x * frequency * 1.5 - step * speed * 0.5) * (amplitude * 0.18);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = colorGradient;
      ctx.globalAlpha = alpha * opacity;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      step += 0.024 * speedMultiplier;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 0. Soft Pearl/White Luminous Base Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#FAFCFF');
      bgGrad.addColorStop(0.45, '#F1F5F9');
      bgGrad.addColorStop(1, '#E8EFF8');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const h = canvas.height;
      const baseRiverY = h * 0.54;

      // 1. TOP STREAM: Vibrant Deep Saffron (Kesari)
      const saffronGrad1 = ctx.createLinearGradient(0, baseRiverY - 140, canvas.width, baseRiverY - 20);
      saffronGrad1.addColorStop(0, '#FF4500');   // Radiant Orange Red
      saffronGrad1.addColorStop(0.3, '#FF671F'); // India Saffron
      saffronGrad1.addColorStop(0.7, '#FFA14A'); // Golden Warm Saffron
      saffronGrad1.addColorStop(1, '#FF7A00');
      drawWave(baseRiverY - 110, 52, 0.0032, 1.25, saffronGrad1, 0.78);

      const saffronGlow = ctx.createLinearGradient(0, baseRiverY - 90, canvas.width, baseRiverY);
      saffronGlow.addColorStop(0, 'rgba(255, 103, 31, 0.65)');
      saffronGlow.addColorStop(0.5, 'rgba(255, 140, 40, 0.55)');
      saffronGlow.addColorStop(1, 'rgba(255, 180, 70, 0.45)');
      drawWave(baseRiverY - 70, 38, 0.0045, 1.5, saffronGlow, 0.7);

      // 2. MIDDLE STREAM: Shimmering Luminous White & Ashoka Navy Caustics
      const whiteGrad = ctx.createLinearGradient(0, baseRiverY - 30, canvas.width, baseRiverY + 50);
      whiteGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      whiteGrad.addColorStop(0.25, 'rgba(224, 242, 254, 0.9)'); // Light Sky
      whiteGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');  // Pure Shimmer
      whiteGrad.addColorStop(0.75, 'rgba(186, 230, 253, 0.85)');
      whiteGrad.addColorStop(1, 'rgba(255, 255, 255, 0.92)');
      drawWave(baseRiverY - 15, 46, 0.0038, 1.05, whiteGrad, 0.88);

      // Chakra Navy River Current Filament
      const navyFilament = ctx.createLinearGradient(0, baseRiverY, canvas.width, baseRiverY + 30);
      navyFilament.addColorStop(0, 'rgba(0, 40, 117, 0.35)');
      navyFilament.addColorStop(0.5, 'rgba(0, 150, 255, 0.45)');
      navyFilament.addColorStop(1, 'rgba(0, 40, 117, 0.25)');
      drawWave(baseRiverY + 12, 24, 0.0055, 1.35, navyFilament, 0.65);

      // 3. BOTTOM STREAM: Radiant India Sovereign Green
      const greenGrad1 = ctx.createLinearGradient(0, baseRiverY + 40, canvas.width, baseRiverY + 160);
      greenGrad1.addColorStop(0, '#138808'); // India Green Primary
      greenGrad1.addColorStop(0.4, '#10B981'); // Vibrant Emerald
      greenGrad1.addColorStop(0.8, '#046A38'); // Deep National Forest Green
      greenGrad1.addColorStop(1, '#059669');
      drawWave(baseRiverY + 55, 54, 0.0034, 0.95, greenGrad1, 0.85);

      const greenGlow = ctx.createLinearGradient(0, baseRiverY + 70, canvas.width, baseRiverY + 180);
      greenGlow.addColorStop(0, 'rgba(19, 136, 8, 0.65)');
      greenGlow.addColorStop(0.5, 'rgba(52, 211, 153, 0.55)');
      greenGlow.addColorStop(1, 'rgba(4, 106, 56, 0.45)');
      drawWave(baseRiverY + 95, 42, 0.0042, 0.8, greenGlow, 0.75);

      // 4. Luminous River Surface Sparkles & Floating Particles
      if (showParticles) {
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.pulse += 0.04;

          if (p.x > canvas.width + 10) p.x = -10;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          const dynamicSize = p.size + Math.sin(p.pulse) * 0.8;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, dynamicSize), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * opacity;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [opacity, speedMultiplier, showParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        zIndex: 0,
        ...style
      }}
    />
  );
}
