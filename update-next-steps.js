const fs = require('fs');
const file = 'apps/web/src/pages/journey/NextStepsPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHandleChat = `  const handleChatSubmit = (e: any) => {
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

const newHandleChat = `  const handleChatSubmit = async (e: any) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userText = chatInput;
    const newMessages = [...chatMessages, { role: 'user', text: userText }];
    setChatMessages(newMessages as any);
    setChatInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/consultant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: \`Bearer \${token}\` } : {})
        },
        body: JSON.stringify({
          message: userText,
          history: chatMessages // Send previous messages for context
        })
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      
      setChatMessages(prev => [...prev, { role: 'ai', text: data.text }] as any);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "I'm having network issues connecting to the server. Please book a call with a human consultant below." }] as any);
    } finally {
      setIsTyping(false);
    }
  };`;

content = content.replace(oldHandleChat, newHandleChat);
fs.writeFileSync(file, content, 'utf8');
console.log('Updated NextStepsPage.tsx');
