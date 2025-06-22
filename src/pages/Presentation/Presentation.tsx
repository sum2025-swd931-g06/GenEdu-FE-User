import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Reveal from "reveal.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import "reveal.js/plugin/highlight/monokai.css";

type SlideType = "text" | "image" | "code";

interface SlideData {
  type: SlideType;
  title: string;
  content: string;
  imageUrl?: string;
  codeLanguage?: string;
}

export default function Presentation() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") ?? "";
  const [slides, setSlides] = useState<SlideData[]>([]);
  const revealRef = useRef<HTMLDivElement>(null);
  const revealInstance = useRef<Reveal.Api | null>(null);

  const initReveal = () => {
    if (!revealRef.current) return;

    if (revealInstance.current) {
      revealInstance.current.destroy();
      revealInstance.current = null;
    }

    const deck = new Reveal(revealRef.current, {
      embedded: true,
      hash: true,
      transition: "fade",
      plugins: [RevealHighlight],
    });

    deck.initialize().then(() => {
      revealInstance.current = deck;
    });
  };

  const fetchSlides = async () => {
    let data: SlideData[] = [];

    if (topic.toLowerCase() === "ai") {
      data = [
        { type: "text", title: "What is AI?", content: "AI is Artificial Intelligence." },
        { type: "image", title: "AI Image", content: "", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Robot_icon.svg" },
      ];
    } else if (topic.toLowerCase() === "code") {
      data = [
        {
          type: "code",
          title: "JS Example",
          content: `console.log("Hello AI");`,
          codeLanguage: "javascript",
        },
        {
          type: "text",
          title: "Explanation",
          content: "This logs a message to the console.",
        },
      ];
    } else {
      data = [{ type: "text", title: "Unknown topic", content: `No slide found for "${topic}"` }];
    }

    setSlides(data);
  };

  useEffect(() => {
    fetchSlides();
  }, [topic]);

  useEffect(() => {
    if (slides.length > 0) {
      setTimeout(() => initReveal(), 0);
    }
  }, [slides]);

  const renderSlide = (slide: SlideData, index: number) => {
    switch (slide.type) {
      case "text":
        return (
          <section key={index}>
            <h2>{slide.title}</h2>
            <p>{slide.content}</p>
          </section>
        );
      case "image":
        return (
          <section key={index}>
            <h2>{slide.title}</h2>
            <img src={slide.imageUrl} alt={slide.title} width="400" />
          </section>
        );
      case "code":
        return (
          <section key={index}>
            <h2>{slide.title}</h2>
            <pre>
              <code className={`language-${slide.codeLanguage ?? "text"}`}>{slide.content}</code>
            </pre>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="reveal" ref={revealRef}>
      <div className="slides">{slides.map((s, i) => renderSlide(s, i))}</div>
    </div>
  );
}
