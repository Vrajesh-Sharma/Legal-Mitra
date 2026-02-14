import { FileText, Book, Video, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function ResourcesPage() {
    const categories = [
        {
            title: "Bare Acts",
            icon: <Book className="h-6 w-6 text-blue-500" />,
            items: [
                "Constitution of India",
                "Bharatiya Nyaya Sanhita (BNS)",
                "Bharatiya Nagarik Suraksha Sanhita (BNSS)",
                "Bharatiya Sakshya Adhiniyam (BSA)",
                "Information Technology Act"
            ]
        },
        {
            title: "Legal Guides",
            icon: <FileText className="h-6 w-6 text-green-500" />,
            items: [
                "How to file an FIR",
                "Understanding your Rights",
                "Consumer Protection Guide",
                "RTI Application Process",
                "Women's Safety Laws"
            ]
        },
        {
            title: "Video Tutorials",
            icon: <Video className="h-6 w-6 text-red-500" />,
            items: [
                "Courtroom Etiquette 101",
                "Drafting a Legal Notice",
                "Understanding Bail Process",
                "Cyber Crime Reporting",
                "Property Registration Basics"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Legal Resources Library
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        A comprehensive collection of simplified legal knowledge, acts, and guides for every Indian citizen.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16 relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search for acts, guides, or topics..."
                        className="pl-12 h-12 text-lg rounded-full shadow-md border-slate-200 dark:border-slate-800"
                    />
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {categories.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                    {category.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {category.title}
                                </h2>
                            </div>
                            <ul className="space-y-4">
                                {category.items.map((item, i) => (
                                    <li key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                                            {item}
                                        </span>
                                        <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </li>
                                ))}
                            </ul>
                            <Button variant="outline" className="w-full mt-6">
                                View All
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Featured Guide */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between"
                >
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold mb-4">Complete Guide to New Criminal Laws (2024)</h2>
                        <p className="text-blue-100 text-lg mb-8 md:mb-0">
                            Understanding BNS, BNSS, and BSA. What has changed from IPC, CrPC, and Indian Evidence Act? Download our free comparison chart.
                        </p>
                    </div>
                    <Button size="lg" variant="secondary" className="whitespace-nowrap">
                        Download Guide
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
