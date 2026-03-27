import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";

const app = express();
const PORT = 3000;

// Increase payload limit for base64 images
app.use(express.json({ limit: '50mb' }));

// Hardcoded API key as requested by the user
const API_KEY = "AIzaSyCUMj1y1S37iX0N4Lb7rzbd0SNAckZtJTU";
const ai = new GoogleGenAI({ apiKey: API_KEY });

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, image, selectedType, selectedDialect, selectedTone, selectedLength } = req.body;
    
    const typeLabels: Record<string, string> = {
      instagram: 'منشور إنستغرام',
      ad: 'إعلان تسويقي',
      email: 'بريد إلكتروني',
      article: 'مقال بلوغ',
      product: 'وصف منتج',
      bio: 'نبذة شخصية'
    };
    
    const lengthMap: Record<string, string> = { 
      'قصير': '50-80 كلمة', 
      'متوسط': '100-150 كلمة', 
      'طويل': '200-300 كلمة' 
    };
    
    const systemPrompt = `أنت كاتب محتوى عربي محترف خبير في التسويق الرقمي والكتابة الإبداعية.
اكتب ${typeLabels[selectedType] || 'محتوى'} باللغة العربية.
اللهجة المطلوبة: ${selectedDialect}
النبرة المطلوبة: ${selectedTone}
الطول المطلوب: ${lengthMap[selectedLength] || 'متوسط'}
استخدم الهاشتاقات المناسبة للسوشيال ميديا عند الحاجة.
اكتب المحتوى النهائي مباشرة دون مقدمات أو شرح أو ملاحظات.`;

    let contents: any;
    if (image) {
      contents = {
        parts: [
          { inlineData: { data: image.data, mimeType: image.mimeType } },
          { text: systemPrompt + '\n\nالموضوع المطلوب: ' + prompt }
        ]
      };
    } else {
      contents = systemPrompt + '\n\nالموضوع المطلوب: ' + prompt;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        temperature: 0.85,
        topP: 0.95
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
