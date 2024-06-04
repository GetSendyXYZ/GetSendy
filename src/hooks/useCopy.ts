import { useState } from 'react';
import { toast } from 'sonner';

const useCopy = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyText = (text: string) => {
    try {
      void navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast(`${text} successfully copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return { isCopied, copyText };
};

export default useCopy;
