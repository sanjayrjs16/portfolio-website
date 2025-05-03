import React, { useEffect, useRef } from 'react';

const ParallaxContainer = ({ children }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const layers = container.querySelectorAll('[data-parallax]');
    
    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const isVisible = containerRect.top < window.innerHeight && containerRect.bottom > 0;
      
      if (isVisible) {
        const scrolled = window.pageYOffset;
        
        layers.forEach(layer => {
          const speed = layer.dataset.parallax;
          const yOffset = -(scrolled * speed);
          layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
};

export default ParallaxContainer; 