import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, MessageSquare, BookOpen, Shield, CheckCircle, ArrowRight, Gavel, Users } from "lucide-react";
import { motion } from "framer-motion";

export function LandingPage() {
    const navigate = useNavigate();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-950 dark:to-slate-900 pt-32 pb-20">
                {/* Background Decor */}
                <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl opacity-30"></div>

                <div className="relative z-10 container px-4 md:px-6 text-center">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="space-y-8 max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeIn} className="flex justify-center">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Now Live: Legal AI Assistant 2.0
                            </span>
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Justice Simplified. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                                Legal Power in Your Hands.
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Navigate the Indian legal system with confidence. Instant answers, document drafting, and case research—powered by <span className="font-semibold text-primary">advanced AI</span>.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105"
                                onClick={() => navigate("/signup")}
                            >
                                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 text-lg rounded-full border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                onClick={() => navigate("/chat")}
                            >
                                Try Live Demo
                            </Button>
                        </motion.div>

                        <motion.div variants={fadeIn} className="pt-12 flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>No Credit Card</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>Govt. Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span>Encrypted Data</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Active Users", value: "50,000+" },
                            { label: "Queries Solved", value: "1.2M+" },
                            { label: "Legal Templates", value: "500+" },
                            { label: "Accuracy Rate", value: "98%" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-slate-500 uppercase tracking-wider text-sm font-semibold">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Why Legal Mitra?</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            We bridge the gap between complex laws and common citizens using state-of-the-art technology.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <MessageSquare className="h-8 w-8 text-white" />,
                                title: "Instant Legal Chat",
                                desc: "Ask questions in plain English, Hindi, or any regional language. Get instant, accurate answers citing Indian laws.",
                                color: "bg-blue-500"
                            },
                            {
                                icon: <BookOpen className="h-8 w-8 text-white" />,
                                title: "Document Simplifier",
                                desc: "Upload complex legal notices or contracts. Our AI summarizes them into simple bullet points you can actually understand.",
                                color: "bg-indigo-500"
                            },
                            {
                                icon: <Gavel className="h-8 w-8 text-white" />,
                                title: "Case Prediction",
                                desc: "Based on millions of past judgments, get an estimated success rate and timeline for your specific legal issue.",
                                color: "bg-purple-500"
                            },
                            {
                                icon: <Shield className="h-8 w-8 text-white" />,
                                title: "Smart Drafting",
                                desc: "Generate rent agreements, affidavits, and legal notices in minutes. Just fill in the blanks.",
                                color: "bg-emerald-500"
                            },
                            {
                                icon: <Scale className="h-8 w-8 text-white" />,
                                title: "Legal Aid Connect",
                                desc: "Cannot afford a lawyer? We connect you instantly with free legal aid services and pro-bono lawyers near you.",
                                color: "bg-orange-500"
                            },
                            {
                                icon: <Users className="h-8 w-8 text-white" />,
                                title: "Community Forum",
                                desc: "Discuss your issues anonymously with a community of legal experts and citizens who faced similar problems.",
                                color: "bg-pink-500"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className={`h-16 w-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials / Trust */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Trusted by Citizens & Lawyers</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-slate-200" />
                                <div>
                                    <div className="font-bold">Rahul Sharma</div>
                                    <div className="text-sm text-slate-500">Small Business Owner</div>
                                </div>
                                <div className="ml-auto flex text-yellow-400">★★★★★</div>
                            </div>
                            <p className="text-lg text-slate-700 dark:text-slate-300 italic">"Legal Mitra saved me ₹50,000 in legal fees. I drafted my rental agreement in 5 minutes and the AI explained every clause perfectly."</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-slate-200" />
                                <div>
                                    <div className="font-bold">Adv. Priya Mehta</div>
                                    <div className="text-sm text-slate-500">High Court Lawyer</div>
                                </div>
                                <div className="ml-auto flex text-yellow-400">★★★★★</div>
                            </div>
                            <p className="text-lg text-slate-700 dark:text-slate-300 italic">"An incredible tool for initial research. It helps clients understand their basic rights before they even step into my office. Highly recommended."</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-r from-primary to-blue-600 p-12 md:p-24 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to Win Your Case?</h2>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
                            Join the legal revolution today. Free forever for basic queries.
                        </p>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform bg-white text-primary hover:bg-slate-100 border-none"
                            onClick={() => navigate("/signup")}
                        >
                            Get Started Now
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
