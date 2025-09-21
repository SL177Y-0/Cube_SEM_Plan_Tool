import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// bootstrap the app - simple and clean
createRoot(document.getElementById("root")!).render(<App />);
