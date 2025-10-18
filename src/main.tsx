// Import polyfills FIRST before anything else
import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Add a MutationObserver to ensure modals are centered when they appear
if (typeof window !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          // Check if this is a modal container
          const isModalContainer = 
            node.getAttribute('role') === 'dialog' ||
            node.hasAttribute('data-radix-portal') ||
            node.style.position === 'fixed';
          
          if (isModalContainer || node.querySelector('[role="dialog"]')) {
            // Force center the modal container
            Object.assign(node.style, {
              position: 'fixed',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '999999'
            });
          }
        }
      });
    });
  });

  // Start observing when DOM is ready
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
