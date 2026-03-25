import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import axios from "axios";

import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/github-dark.css";
import "./App.css";

function App() {
  // Code in editor
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);

  // AI review text
  const [review, setReview] = useState("");

  // Loading state (important)
  const [loading, setLoading] = useState(false);

  // Highlight code when component loads
  useEffect(() => {
    prism.highlightAll();
  }, []);

  // Runs ONLY when Review button is clicked
  async function reviewCode() {
    if (!code.trim()) {
      alert("Please write some code first");
      return;
    }

    // Prevent double clicks
    if (loading) return;

    setLoading(true);
    setReview("Reviewing code...");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/get-review`,
        { code }
      );

      // Backend should send text
      setReview(response.data);
    } catch (error) {
      console.error(error);
      setReview(
        "AI is unavailable (quota finished or server error). Please try later."
      );
    }

    setLoading(false);
  }

  return (
    <main>
      {/* LEFT SIDE - CODE EDITOR */}
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
            }}
          />
        </div>

        {/* REVIEW BUTTON */}
        <button
          className="review"
          onClick={reviewCode}
          disabled={loading}
        >
          {loading ? "Reviewing..." : "Review"}
        </button>
      </div>

      {/* RIGHT SIDE - AI RESPONSE */}
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review}
        </Markdown>
      </div>
    </main>
  );
}

export default App;