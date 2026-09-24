import { useEffect, useState } from "react";

/** Responsive SVG gauge diameter for phone / tablet / desktop. */
export function useGaugeSize(variant: "default" | "hero" = "default"): number {
  const [size, setSize] = useState(variant === "hero" ? 220 : 148);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (variant === "hero") {
        if (w < 340) setSize(200);
        else if (w < 390) setSize(220);
        else if (w < 768) setSize(240);
        else setSize(260);
        return;
      }
      if (w < 340) setSize(120);
      else if (w < 390) setSize(132);
      else if (w < 480) setSize(140);
      else if (w < 768) setSize(156);
      else setSize(172);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [variant]);

  return size;
}
