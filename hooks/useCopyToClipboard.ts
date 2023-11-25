import { useState } from 'react';

type CopiedValue = string | null;

const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };

  return {
    copy,
    copiedText,
  };
};

export default useCopyToClipboard;
