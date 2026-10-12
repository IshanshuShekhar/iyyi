const fs = require('fs');
const path = 'apps/api/src/consultant/consultant.service.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes("import Groq from 'groq-sdk';")) {
  code = code.replace(
    "import { CreateBookingDto, LogCallDto } from './consultant.dto';",
    "import { CreateBookingDto, LogCallDto } from './consultant.dto';\nimport Groq from 'groq-sdk';"
  );
}

if (!code.includes("private groq: Groq | null = null;")) {
  code = code.replace(
    "private readonly logger = new Logger(ConsultantService.name);",
    "private readonly logger = new Logger(ConsultantService.name);\n  private groq: Groq | null = null;"
  );
}

if (!code.includes("const groqKey = ")) {
  code = code.replace(
    "private readonly emailService: EmailService,",
    "private readonly emailService: EmailService,\n  ) {\n    const groqKey = process.env.GROQ_API_KEY?.trim();\n    if (groqKey) {\n      this.groq = new Groq({ apiKey: groqKey });\n    }\n  }\n\n  // old constructor signature ends here..."
  );
  
  // Clean up the constructor replace
  code = code.replace(
    "private readonly emailService: EmailService,\n  ) {\n    const groqKey = process.env.GROQ_API_KEY?.trim();\n    if (groqKey) {\n      this.groq = new Groq({ apiKey: groqKey });\n    }\n  }\n\n  // old constructor signature ends here...\n  ) {}",
    "private readonly emailService: EmailService,\n  ) {\n    const groqKey = process.env.GROQ_API_KEY?.trim();\n    if (groqKey) {\n      this.groq = new Groq({ apiKey: groqKey });\n    }\n  }"
  );
}

const handleChatMethod = `
  async handleChat(userId: string, message: string, history: any[]) {
    if (!this.groq) {
      return { text: "I'm currently in offline mode (API key not configured). Please book a call with a human consultant using the slots above!" };
    }

    try {
      // Basic system prompt for the consultant
      const systemPrompt = "You are an AI Consultant for Educaro, specializing in German university applications, APS certificates, blocked accounts, and visa processes. Be extremely concise, professional, and helpful. Guide the user to book a 1-on-1 strategy call if they need complex help.";

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
          role: msg.role === 'ai' ? 'assistant' : 'user',
          content: msg.text
        })),
        { role: 'user', content: message }
      ];

      const completion = await this.groq.chat.completions.create({
        messages,
        model: 'llama-3.1-8b-instant',
        temperature: 0.5,
        max_tokens: 256,
      });

      const reply = completion.choices[0]?.message?.content || "I'm having trouble processing that right now. Please book a call below.";
      return { text: reply };
    } catch (error) {
      this.logger.error('Groq chat error:', error);
      return { text: "I encountered an error connecting to my knowledge base. Please try again or book a 1-on-1 session." };
    }
  }
}
`;

code = code.replace(/}\s*$/, handleChatMethod);

fs.writeFileSync(path, code, 'utf8');
console.log('Updated consultant.service.ts');
