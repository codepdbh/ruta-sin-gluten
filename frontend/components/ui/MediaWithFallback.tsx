"use client";

import { ImgHTMLAttributes, useState } from "react";

type MediaWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function MediaWithFallback({
  src,
  alt,
  fallbackSrc = "/libre-degluten.png",
  onError,
  ...props
}: MediaWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const srcValue = typeof src === "string" ? src : undefined;

  const resolvedSrc =
    !srcValue || srcValue === failedSrc ? fallbackSrc : srcValue;

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={(event) => {
        if (srcValue && srcValue !== fallbackSrc) {
          setFailedSrc(srcValue);
        }
        onError?.(event);
      }}
    />
  );
}
