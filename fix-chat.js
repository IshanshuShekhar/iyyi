const fs = require('fs');
const file = 'apps/web/src/pages/journey/NextStepsPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const stateBlock = `  const [isTraceOpen, setIsTraceOpen] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Welcome to Premium! I can help you book your Frankfurt advisor call, track your APS fast-track status, or recommend which German learning modules to tackle first. How can I assist you today?' }
  ]);

  const handleChatSubmit = (e: any) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { role: 'user', text: chatInput }];
    setChatMessages(newMessages as any);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setChatMessages([
        ...newMessages,
        {
          role: 'ai',
          text: 'Thanks for reaching out! Since this is a demo environment, I am currently in offline mode. If you need immediate assistance, please use the Consultant Support tab to book a 1-on-1 session with our human advisors!'
        }
      ] as any);
      setIsTyping(false);
    }, 1200);
  };`;

content = content.replace('  const [isTraceOpen, setIsTraceOpen] = useState(false);', stateBlock);

// Now replace the JSX
const oldChatArea = `          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/30">
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-educaro-accent flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="p-3 rounded-2xl rounded-bl-none text-xs leading-relaxed bg-educaro-main border border-educaro-border text-educaro-primary">
                Welcome to Premium! I can help you book your Frankfurt advisor call, track your APS fast-track status, or recommend which German learning modules to tackle first. How can I assist you today?
              </div>
            </div>
          </div>`;

const newChatArea = `          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/30">
            {chatMessages.map((msg, i) => (
              <div key={i} className={\`flex items-end gap-2 max-w-[85%] \${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}\`}>
                <div className={\`w-6 h-6 rounded-full flex items-center justify-center shrink-0 \${msg.role === 'user' ? 'bg-educaro-primary' : 'bg-educaro-accent'}\`}>
                  {msg.role === 'user' ? <span className="text-white text-[10px]">U</span> : <Bot className="w-3 h-3 text-white" />}
                </div>
                <div className={\`p-3 rounded-2xl text-xs leading-relaxed border \${
                  msg.role === 'user' 
                    ? 'rounded-br-none bg-educaro-primary text-white border-educaro-primary' 
                    : 'rounded-bl-none bg-educaro-main text-educaro-primary border-educaro-border'
                }\`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-2 max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-educaro-accent flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="p-3 rounded-2xl rounded-bl-none bg-educaro-main border border-educaro-border flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
          </div>`;

content = content.replace(oldChatArea, newChatArea);

const oldChatInput = `          {/* Chat Input */}
          <div className="p-3 bg-educaro-secondary border-t border-educaro-border">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about your premium benefits..."
                className="flex-1 px-4 py-2.5 rounded-full border border-educaro-border bg-educaro-main text-xs text-educaro-primary focus:outline-none focus:ring-1 focus:ring-educaro-accent"
              />
              <button
                type="button"
                className="p-2.5 rounded-full bg-educaro-accent text-white hover:bg-educaro-accentHover transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>`;

const newChatInput = `          {/* Chat Input */}
          <div className="p-3 bg-educaro-secondary border-t border-educaro-border">
            <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your premium benefits..."
                className="flex-1 px-4 py-2.5 rounded-full border border-educaro-border bg-educaro-main text-xs text-educaro-primary focus:outline-none focus:ring-1 focus:ring-educaro-accent"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="p-2.5 rounded-full bg-educaro-accent text-white hover:bg-educaro-accentHover disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>`;

content = content.replace(oldChatInput, newChatInput);

fs.writeFileSync(file, content, 'utf8');
