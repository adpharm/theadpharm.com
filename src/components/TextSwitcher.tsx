import { useState, type ReactNode, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function TextSwitcher({
  textToCopy,
  beforeText,
  afterText,
  className,
  beforeClassName,
  afterClassName,
  seconds = 3,
}: {
  textToCopy: string;
  beforeText: string;
  afterText: string;
  className?: string;
  beforeClassName?: string;
  afterClassName?: string;
  seconds?: number;
}) {
  // const [timeoutFn, setTimeoutFn] = useState(null as any);
  const [switched, setSwitched] = useState(false);
  const [text, setText] = useState(beforeText);

  useEffect(() => {
    // if switched is true
    if (switched) {
      // set timeout to switch back to before
      const timeout = setTimeout(() => {
        setText(beforeText);
        setSwitched(false);
      }, seconds * 1000);

      // return a function to clear the timeout
      return () => {
        clearTimeout(timeout);
      };
    }

    // return a function to do nothing
    return () => {};
  }, [switched, beforeText, seconds]);

  return (
    <button
      type="button"
      onClick={() => {
        // if switched is true, do nothing
        if (switched) {
          return;
        }

        // copy text to clipboard
        navigator.clipboard.writeText(textToCopy);

        // switch to after
        setText(afterText);

        // set switched to true
        setSwitched(true);
      }}
      className={twMerge(className, switched ? afterClassName : beforeClassName)}
    >
      {text}
    </button>
  );
}
