import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, User, Bot, MapPin, Gavel, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';

const fetchResponse = async (query) => {
    try {
        const response = await fetch('http://localhost:8000/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: query }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Network response was not ok');
        }

        const data = await response.json();

        return {
            answer: data.answer,
            simplified_answer: data.simplified_answer,
            action_steps: data.action_steps,
            sources: (data.sources || []).map(source => ({
                title: source.act_name || source.title || "Unknown Act",
                section: source.section_number || source.section || "",
                ...source
            }))
        };
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export function ChatInterface() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: `Namaste ${user?.name || ''}! I am Legal Mitra, your personal legal AI. I can help you understand Indian laws, draft documents, and find solutions. What’s on your mind today?`,
            timestamp: new Date(),
        },
    ]);
    const scrollViewportRef = useRef(null);

    // Rate Limiting Logic
    const MAX_DEMO_MESSAGES = 10;
    const [demoCount, setDemoCount] = useState(() => {
        return parseInt(localStorage.getItem('demo_msg_count') || '0');
    });

    const mutation = useMutation({
        mutationFn: fetchResponse,
        onSuccess: (data) => {
            const botMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.answer,
                data: data,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        },
        onError: () => {
            const errorMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error while processing your request. Please check your connection or try again later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    });

    const handleSend = () => {
        if (!input.trim()) return;

        // Check Rate Limit for Demo Users
        if (!user) {
            if (demoCount >= MAX_DEMO_MESSAGES) {
                addToast({
                    title: "Demo Limit Reached",
                    message: "You've reached the limit of free messages. Please login to continue.",
                    type: "info",
                    duration: 5000
                });

                // Add a system message to chat as well
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: "🔒 You have reached the free demo limit. Please **[Login](/login)** or **[Sign Up](/signup)** to continue your legal journey safely.",
                    timestamp: new Date(),
                }]);

                return;
            }

            // Increment count
            const newCount = demoCount + 1;
            setDemoCount(newCount);
            localStorage.setItem('demo_msg_count', newCount.toString());

            if (newCount === MAX_DEMO_MESSAGES - 3) {
                addToast({
                    title: "3 Messages Left",
                    message: "You have 3 free messages remaining in your demo session.",
                    type: "info"
                });
            }
        }

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        mutation.mutate(input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (scrollViewportRef.current) {
            const scrollContainer = scrollViewportRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, mutation.isPending]);


    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-5xl mx-auto p-4 md:p-6 gap-6 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative">

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Chat Area */}
            <ScrollArea className="flex-1 pr-4 relative z-10" ref={scrollViewportRef}>
                <div className="flex flex-col gap-8 py-4 px-2">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "flex gap-4 group",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <Avatar className={cn(
                                    "h-10 w-10 border-2 shadow-sm shrink-0",
                                    msg.role === 'assistant' ? "bg-white border-primary/20" : "bg-slate-900 border-white/10"
                                )}>
                                    <AvatarFallback className={msg.role === 'assistant' ? "text-primary" : "text-white bg-slate-900"}>
                                        {msg.role === 'user' ? <User className="h-5 w-5" /> : <Sparkles className="h-5 w-5 fill-primary text-primary" />}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={cn(
                                    "flex flex-col gap-2 max-w-[85%] md:max-w-[75%]",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "rounded-2xl p-4 text-base shadow-sm leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-primary text-white rounded-tr-sm"
                                            : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                                    )}>
                                        {msg.content}
                                    </div>

                                    {msg.data && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ delay: 0.2 }}
                                            className="flex flex-col gap-4 w-full mt-2"
                                        >
                                            {/* Simplified Answer */}
                                            {msg.data.simplified_answer && (
                                                <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 overflow-hidden">
                                                    <CardContent className="p-4 space-y-2">
                                                        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                                                            <Bot className="h-4 w-4" />
                                                            Simplified Breakdown
                                                        </div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300">{msg.data.simplified_answer}</p>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {/* Action Planner */}
                                            {msg.data.action_steps && msg.data.action_steps.length > 0 && (
                                                <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                        <MapPin className="h-3 w-3" /> Action Plan
                                                    </h4>
                                                    <div className="grid gap-3">
                                                        {msg.data.action_steps.map((step, idx) => (
                                                            <div key={step.step_number} className="flex gap-3 items-start text-sm">
                                                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shrink-0 mt-0.5">
                                                                    {idx + 1}
                                                                </span>
                                                                <span className="text-slate-700 dark:text-slate-300">{step.description}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Sources */}
                                            {msg.data.sources.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.data.sources.map((source, index) => (
                                                        <div key={index} className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 hover:border-slate-300 cursor-help transition-colors">
                                                            <Gavel className="h-3 w-3" />
                                                            {source.title} {source.section}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {mutation.isPending && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4"
                        >
                            <Avatar className="h-10 w-10 border-2 border-primary/20 bg-white">
                                <AvatarFallback><Sparkles className="h-5 w-5 text-primary animate-pulse" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 shadow-sm">
                                <span className="flex gap-1 h-3 items-center">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                </span>
                                <span className="text-xs text-slate-400 font-medium">Analyzing legal precedents...</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="relative z-20 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300">
                <div className="flex gap-2 items-center px-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={!user ? `Describe your legal issue... (${MAX_DEMO_MESSAGES - demoCount} free messages left)` : "Describe your legal issue..."}
                        className="border-0 focus-visible:ring-0 shadow-none text-base h-12 bg-transparent placeholder:text-slate-400"
                        disabled={mutation.isPending || (!user && demoCount >= MAX_DEMO_MESSAGES)}
                        autoFocus
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={mutation.isPending || !input.trim()}
                        className={cn(
                            "h-10 w-10 rounded-xl transition-all duration-300 shrink-0",
                            input.trim() ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 scale-100" : "bg-slate-200 text-slate-400 scale-95"
                        )}
                    >
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-center text-slate-400 pb-2">
                Legal Mitra is an AI assistant, not a lawyer. {!user && <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate('/signup')}>Sign up for unlimited access.</span>}
            </div>
        </div>
    );
}
