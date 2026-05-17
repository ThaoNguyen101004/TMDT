import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./stores/store.ts";
import { UIConfigProvider } from "./stores/uiConfigStore.tsx";

// Send logs to parent frame (like a preview system)
function postToParent(level: string, ...args: any[]): void {
  if (window.parent !== window) {
    window.parent.postMessage(
      {
        type: "iframe-console",
        level,
        args,
      },
      "*"
    );
  }
}

// Global error handler
window.onerror = function (message, source, lineno, colno, error) {
  const errPayload = {
    message,
    source,
    lineno,
    colno,
    stack: error?.stack,
  };
  postToParent("error", "[Fiveting_Error_Caught]", errPayload);
};

// Unhandled promise rejection
window.onunhandledrejection = function (event) {
  postToParent("error", "[Fiveting_Error_Caught]", { reason: event.reason });
};

// Patch console
(["log", "warn", "info", "error"] as const).forEach((level) => {
  const original = console[level];
  console[level] = (...args: any[]) => {
    postToParent(level, ...args);
    original(...args);
  };
});

// ── Error Boundary ──────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("React ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          background: "#fff0f3",
          padding: "2rem",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h1 style={{ color: "#c0392b", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Đã xảy ra lỗi
          </h1>
          <p style={{ color: "#555", marginBottom: "1.5rem", maxWidth: 480 }}>
            {this.state.error?.message || "Lỗi không xác định"}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#e11d48",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1.6rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <UIConfigProvider>
          <App />
        </UIConfigProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
