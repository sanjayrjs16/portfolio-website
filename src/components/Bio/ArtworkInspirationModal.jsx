import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ArtworkInspirationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <p className="bio-credit">
        *
        {' '}
        <button type="button" className="artwork-trigger" onClick={() => setIsOpen(true)}>
          site inspired by artwork I made
          <span className="eye-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M1.5 12S5.5 5.5 12 5.5 22.5 12 22.5 12 18.5 18.5 12 18.5 1.5 12 1.5 12Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="2.8" fill="currentColor" />
            </svg>
          </span>
        </button>
      </p>

      {isMounted && isOpen && createPortal(
        <div
          className="artwork-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Artwork inspiration"
          onClick={() => setIsOpen(false)}
        >
          <article className="artwork-modal-card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="artwork-close"
              aria-label="Close artwork details"
              onClick={() => setIsOpen(false)}
            >
              x
            </button>

            <img
              src="/stardust-avatar.png"
              alt="The Stardust Psyche artwork"
              className="artwork-image"
              loading="lazy"
              decoding="async"
            />

            <div className="artwork-content">
              <h3 className="artwork-title">The Stardust Psyche</h3>
              <p>
                This artwork came from a 2020 phase of looking deeper at where we come from and what
                keeps us moving. The idea is simple and powerful: we are not separate from the cosmos,
                we are expressions of it.
              </p>
              <blockquote className="artwork-quote">
                The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, and the
                carbon in our apple pies were made in the interiors of collapsing stars. We are made
                of star stuff.
                <cite>Carl Sagan</cite>
              </blockquote>
              <blockquote className="artwork-quote">
                We are part of this universe, and perhaps more important than both of those facts is
                that the universe is in us.
                <cite>Neil deGrasse Tyson</cite>
              </blockquote>
              
            </div>
          </article>
        </div>,
        document.body
      )}

      <style jsx>{`
        .bio-credit {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(0.6rem, 1vw, 0.75rem);
          color: rgba(55, 48, 40, 0.72);
          margin: 0.4rem 0 0 auto;
          align-self: flex-end;
        }

        .artwork-trigger {
          border: 0;
          background: transparent;
          color: #4c1d95;
          font: inherit;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.32rem;
          border-bottom: 1px solid rgba(91, 33, 182, 0.48);
        }

        .artwork-trigger:hover {
          color: #5b21b6;
          border-bottom-color: rgba(91, 33, 182, 0.72);
        }

        .eye-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.02rem;
          height: 1.02rem;
          padding: 0.08rem;
          border-radius: 999px;
          border: 1px solid rgba(126, 58, 237, 0.25);
          background: rgba(139, 92, 246, 0.12);
        }

        .eye-icon svg {
          width: 100%;
          height: 100%;
          color: #5b21b6;
        }

        :global(html[data-theme='dark']) .artwork-trigger {
          color: rgba(225, 190, 255, 0.98) !important;
          border-bottom-color: rgba(217, 85, 242, 0.45) !important;
        }

        :global(html[data-theme='dark']) .artwork-trigger:hover {
          color: rgba(236, 210, 255, 1) !important;
          border-bottom-color: rgba(217, 85, 242, 0.72) !important;
        }

        :global(html[data-theme='dark']) .eye-icon svg {
          color: rgba(225, 190, 255, 0.98);
        }

        :global(html[data-theme='dark']) .bio-credit {
          color: rgba(225, 190, 255, 0.92) !important;
        }

        .artwork-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 8, 12, 0.62);
          backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          z-index: 1200;
          padding: 1rem;
        }

        .artwork-modal-card {
          width: min(760px, 100%);
          max-height: min(92vh, 900px);
          overflow: auto;
          border-radius: 16px;
          background: linear-gradient(165deg, rgba(252, 250, 246, 0.96) 0%, rgba(238, 234, 228, 0.94) 100%);
          border: 1px solid rgba(200, 188, 170, 0.45);
          box-shadow:
            0 0 0 1px rgba(168, 85, 247, 0.08),
            0 10px 30px rgba(20, 12, 40, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
          position: relative;
          display: grid;
          gap: 0.9rem;
          padding: 1rem;
        }

        .artwork-close {
          position: absolute;
          top: 0.65rem;
          right: 0.65rem;
          width: 2rem;
          height: 2rem;
          border-radius: 999px;
          border: 1px solid rgba(120, 110, 95, 0.3);
          background: rgba(255, 255, 255, 0.86);
          color: rgba(28, 25, 23, 0.9);
          cursor: pointer;
          font-size: 1rem;
          z-index: 1;
        }

        .artwork-image {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(200, 188, 170, 0.45);
          display: block;
          object-fit: cover;
          background: rgba(255, 255, 255, 0.7);
        }

        .artwork-content {
          display: grid;
          gap: 0.55rem;
          color: rgba(40, 36, 33, 0.9);
          font-family: 'Space Grotesk', sans-serif;
        }

        .artwork-title {
          margin: 0;
          color: #1c1917;
          font-size: clamp(1.04rem, 1.8vw, 1.3rem);
          letter-spacing: -0.02em;
        }

        .artwork-content p {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .artwork-quote {
          margin: 0;
          padding: 0.62rem 0.72rem;
          border-radius: 10px;
          border: 1px solid rgba(126, 58, 237, 0.22);
          background: rgba(139, 92, 246, 0.08);
          color: rgba(40, 36, 33, 0.92);
          font-size: 0.87rem;
          line-height: 1.5;
          display: grid;
          gap: 0.35rem;
        }

        .artwork-quote cite {
          font-style: normal;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(76, 29, 149, 0.88);
          font-weight: 700;
        }

        /* Dark mode: modal surface + copy */
        :global(html[data-theme='dark']) .artwork-modal-overlay {
          background: rgba(4, 4, 10, 0.72);
        }

        :global(html[data-theme='dark']) .artwork-modal-card {
          background: linear-gradient(165deg, rgba(30, 30, 38, 0.92) 0%, rgba(20, 20, 26, 0.9) 100%);
          border-color: rgba(168, 85, 247, 0.26);
          box-shadow:
            0 0 0 1px rgba(168, 85, 247, 0.12),
            0 10px 30px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        :global(html[data-theme='dark']) .artwork-close {
          border-color: rgba(168, 85, 247, 0.22);
          background: rgba(30, 30, 38, 0.9);
          color: rgba(255, 255, 255, 0.9);
        }

        :global(html[data-theme='dark']) .artwork-image {
          border-color: rgba(200, 188, 170, 0.22);
          background: rgba(30, 30, 38, 0.62);
        }

        :global(html[data-theme='dark']) .artwork-content {
          color: rgba(255, 255, 255, 0.82);
        }

        :global(html[data-theme='dark']) .artwork-title {
          color: rgba(255, 255, 255, 0.96);
        }

        :global(html[data-theme='dark']) .artwork-quote {
          border-color: rgba(168, 85, 247, 0.28);
          background: rgba(139, 92, 246, 0.12);
          color: rgba(255, 255, 255, 0.86);
        }

        :global(html[data-theme='dark']) .artwork-quote cite {
          color: rgba(225, 190, 255, 0.98);
        }

        @media (min-width: 900px) {
          .artwork-modal-card {
            width: min(980px, 100%);
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
            align-items: stretch;
            gap: 1rem;
            padding: 1rem 1rem 1rem;
          }

          .artwork-image {
            height: 100%;
            min-height: 480px;
            object-fit: cover;
          }

          .artwork-content {
            align-content: start;
            padding: 0.35rem 0.25rem 0.2rem 0.1rem;
          }
        }

        @media (max-width: 768px) {
          .artwork-modal-overlay {
            padding: 1.15rem 0.85rem;
            align-items: start;
          }

          .artwork-modal-card {
            width: 100%;
            max-height: calc(100vh - 2.3rem);
            padding: 0.72rem;
            gap: 0.62rem;
            border-radius: 14px;
          }

          .artwork-close {
            width: 1.8rem;
            height: 1.8rem;
            top: 0.5rem;
            right: 0.5rem;
          }

          .artwork-image {
            max-height: 220px;
            object-fit: cover;
          }

          .artwork-content {
            gap: 0.48rem;
          }

          .artwork-title {
            font-size: 1rem;
          }

          .artwork-content p {
            font-size: 0.81rem;
            line-height: 1.46;
          }

          .artwork-quote {
            font-size: 0.77rem;
            line-height: 1.42;
            padding: 0.48rem 0.54rem;
          }

          .artwork-quote cite {
            font-size: 0.64rem;
          }

          .eye-icon {
            width: 0.95rem;
            height: 0.95rem;
          }
        }
      `}</style>
    </>
  );
}
