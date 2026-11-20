import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import "./styles.css";
import App from "./App";
import ErroDados from "@/pages/ErroDados";
import { iniciarBanco } from "@/data/seed";

// Pede ao navegador para não apagar os dados sozinho (pode ser negado, sem problema).
void navigator.storage?.persist?.().catch(() => {});

async function iniciar() {
  const raiz = createRoot(document.getElementById("root")!);
  try {
    await iniciarBanco();
  } catch {
    raiz.render(<ErroDados />);
    return;
  }
  raiz.render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>,
  );
}

void iniciar();
