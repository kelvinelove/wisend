import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full border-t bg-background/80 backdrop-blur py-4 mt-8">
    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-muted-foreground text-sm">
      <span>
        &copy; {new Date().getFullYear()} WiSend by WiRemit. All rights reserved.
      </span>
      <a
        href="https://kelvin.is-a.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary underline font-medium transition-colors mt-2 sm:mt-0"
      >
        Made by Kelvin
      </a>
    </div>
  </footer>
);

export default Footer;
