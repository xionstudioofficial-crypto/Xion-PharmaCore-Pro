import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey 
    ? new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      })
    : null;

  // AI chat API route
  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ 
          error: "Gemini API key is not configured. Please set GEMINI_API_KEY in Settings." 
        });
      }

      const { messages, context } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      // Convert messages to Gemini SDK contents format
      const formattedContents = messages.map((m: any) => {
        const role = m.role === "user" ? "user" : "model";
        return {
          role,
          parts: [{ text: m.content || "" }]
        };
      });

      // System Instructions establishing context and bilingual capabilities (English + Urdu)
      const systemInstruction = `
You are the "PharmaCore AI Copilot", a highly intelligent, secure, and professional bilingual ERP Assistant built for Xion PharmaCore Pro (the SaaS Pharmacy Enterprise Resource Planning Platform).

Active Tenant Details:
- Client Tenant ID: ${context?.tenantId || "N/A"}
- Client Tenant: ${context?.tenantName || "Unknown Pharmacy Tenant"}
- Client Domain: ${context?.tenantDomain || "Unknown"}
- Client Subscription Plan: ${context?.tenantPlan || "N/A"}

Current User Details:
- Logged-in Operator Name: ${context?.userName || "Anonymous Operator"}
- Role-Based Access Level (RBAC): ${context?.userRole || "Staff"}
- Layout Preset: ${context?.darkMode ? "Dark Core Theme" : "Light High-Contrast"}

Inventory & ERP Data Snapshots:
- Stock Threshold Alert: Minimum level is 10 units for auto-triggering purchase workflows.
- Loaded Mock drugs of primary workspace: 
  1. Panadol Extra 500mg [Paracetamol & Caffeine] - Active Stock: 50
  2. Amoxil Forte 250mg [Amoxicillin Trihydrate] - Active Stock: 30
  3. Zyrtec Allergy 10mg [Cetirizine Hydrochloride] - Active Stock: 100

Primary Platform Capabilities:
- Multi-Pharmacy Client Isolation: Different pharmacies login with isolated local storage and localized data workspaces.
- Dynamic JWT Cryptographic Inspector: Provides active insight into tenant, role, and expiry mapping.
- Role-Based Access level filters: Owner/Admin sees full analytics, stock updates, revenue figures, whereas Salesman can only access billing.

Your Guidelines & Tone (Strictly Enforced):
1. **Bilingual Mastery (English + Urdu)**: Fully comprehend and speak English and Urdu.
   - If the user types in Urdu script (e.g., "سٹاک کی تفصیلات بتائیں") or Roman Urdu (e.g., "stock check karo" or "panadol kitni bachi hai?"), respond natively in Urdu context, keeping it incredibly natural, crisp, polite, and helpful (using professional terms like 'خوش آمدید', 'سامان', 'ادویات').
   - If the user types in English, respond in professional, friendly, descriptive English.
   - Code-switch gracefully when the user mixes English & Urdu.
2. **Helpfulness**: Assist the pharmacy operator "to the fullest extent". Help them understand how to use Xion PharmaCore Pro, how to navigate the current active tab: "${context?.activeTab || "Dashboard"}", how to scanner barcodes, manage expiry updates, or toggle multi-tenant domains.
3. **Professional Persona**: Do not breakdown your persona or mention you are a standard OpenAI/Google model, rather focus entirely on being the built-in "PharmaCore AI Copilot". KEEP RESPONSES SHORT AND SCANNING-FRIENDLY so it fits inside a side drawer/chatbot interface beautifully.
`;

      // Call Gemini 3.5 Flash for high performance, bilingual support and low-latency interaction
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || "Internal AI generation error" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
