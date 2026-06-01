
import React, { useEffect } from 'react';

export default function LegacyApp() {
  useEffect(() => {
    // Dynamically import the legacy logic only on the client side
    if (typeof window !== 'undefined') {
      import('../lib/legacyLogic.js').catch(err => console.error("Failed to load legacy logic:", err));
    }
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: ``${htmlContent}`` }} />
  );
}
