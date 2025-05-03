import React, { useState } from 'react';

const SocialIcons = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const email = 'sanjayrajesh.exe@gmail.com';

  const handleEmailClick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/sanjayrjs16',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@letthedevscook',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sanjay-rajesh/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://x.com/sanjayrjs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'Stack Overflow',
      url: 'https://stackoverflow.com/users/11468488/sanjay?tab=profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      url: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
        </svg>
      ),
      isEmail: true
    }
  ];

  return (
    <div className="social-icons">
      {socialLinks.map((social, index) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`social-icon ${social.isEmail ? 'email-icon' : ''}`}
          aria-label={social.name}
          style={{ '--delay': `${index * 0.1}s` }}
          onClick={social.isEmail ? handleEmailClick : undefined}
          onMouseEnter={() => social.isEmail && setShowTooltip(true)}
          onMouseLeave={() => social.isEmail && setShowTooltip(false)}
        >
          {social.icon}
          {social.isEmail && showTooltip && (
            <span className="tooltip">{email}</span>
          )}
        </a>
      ))}
      
      {showCopied && (
        <div className="copied-alert">
          Email copied to clipboard! ✨
        </div>
      )}

      <style jsx>{`
        .social-icons {
          display: flex;
          gap: 0.25rem;
          align-items: center;
          position: relative;
        }

        .social-icon {
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          position: relative;
        }

        .social-icon:hover {
          color: white;
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.2);
        }

        .email-icon {
          cursor: pointer;
        }

        .tooltip {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          white-space: nowrap;
          pointer-events: none;
          backdrop-filter: blur(5px);
          z-index: 100;
        }

        .tooltip::before {
          content: '';
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid rgba(0, 0, 0, 0.8);
        }

        .copied-alert {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(138, 43, 226, 0.9);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          white-space: nowrap;
          animation: fadeInOut 2s ease-in-out;
          backdrop-filter: blur(5px);
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -10px); }
        }

        @media (max-width: 768px) {
          .social-icons {
            gap: 0.75rem;
          }

          .social-icon {
            padding: 0.4rem;
          }

          .tooltip {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SocialIcons; 