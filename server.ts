import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API route to fetch donation progress
  app.get("/api/donation-progress", async (req, res) => {
    try {
      // Added cache-busting parameter to ensure real-time data
      const url = `https://trousseaprojets.fr/projet/20429-les-2ndes-si-cit-de-figeac-champollion-tirent-leurs-fusees?_t=${Date.now()}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const html = await response.text();

      // Refined extraction targeting the exact HTML structure provided
      const extractAmount = (label: string, fallback: number) => {
        // We look for the label and then the very next occurrence of amount-number
        // We limit the search range to avoid jumping to the next section
        const labelIndex = html.indexOf(label);
        if (labelIndex === -1) return fallback;

        const subHtml = html.substring(labelIndex, labelIndex + 500);
        const regex = /class=["']amount-number["'][^>]*?>\s*([\d\s,.]+)\s*€/i;
        const match = subHtml.match(regex);
        
        if (match) {
          const cleanValue = match[1].replace(/\s/g, "").replace(",", ".");
          return parseFloat(cleanValue);
        }
        return fallback;
      };

      // Use the values provided by the user as fallbacks if extraction fails
      const collected = extractAmount("Montant collecté", 0);
      const minGoal = extractAmount("Objectif Minimum", 550);
      const optGoal = extractAmount("Objectif Optimum", 1625);
      
      // Extract other stats
      const daysMatch = html.match(/Plus que\s*(\d+)\s*jours/i);
      const donorsMatch = html.match(/Donateurs\s*(\d+)/i);

      res.json({
        collected,
        minGoal,
        optGoal,
        daysLeft: parseInt(daysMatch?.[1] || "0"),
        donors: parseInt(donorsMatch?.[1] || "0"),
        lastUpdated: new Date().toLocaleTimeString('fr-FR')
      });
    } catch (error) {
      console.error("Error fetching donation data:", error);
      res.status(500).json({ error: "Failed to fetch donation data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
