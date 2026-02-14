import { useState } from "react";
import { FileText, Book, Video, ExternalLink, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function ResourcesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        {
            title: "Bare Acts",
            icon: <Book className="h-6 w-6 text-blue-500" />,
            items: [
                { title: "Constitution of India", link: "https://legislative.gov.in/constitution-of-india" },
                { title: "Bharatiya Nyaya Sanhita (BNS)", link: "https://www.mha.gov.in/en/commoncontent/new-criminal-laws" },
                { title: "Bharatiya Nagarik Suraksha Sanhita (BNSS)", link: "https://www.mha.gov.in/en/commoncontent/new-criminal-laws" },
                { title: "Bharatiya Sakshya Adhiniyam (BSA)", link: "https://www.mha.gov.in/en/commoncontent/new-criminal-laws" },
                { title: "Information Technology Act", link: "https://www.meity.gov.in/content/information-technology-act-2000" },
                { title: "Consumer Protection Act", link: "https://consumeraffairs.nic.in/acts-and-rules/consumer-protection" },
                { title: "Right to Information Act", link: "https://rti.gov.in/" },
                { title: "Indian Contract Act", link: "https://www.indiacode.nic.in/handle/123456789/2187" }
            ]
        },
        {
            title: "Legal Guides",
            icon: <FileText className="h-6 w-6 text-green-500" />,
            items: [
                { title: "How to file an FIR", link: "https://citizen.uppolice.gov.in/citizen-services/first-information-report" },
                { title: "Understanding your Rights", link: "https://nalsa.gov.in/" },
                { title: "Consumer Protection Guide", link: "https://consumeraffairs.nic.in/" },
                { title: "RTI Application Process", link: "https://rtionline.gov.in/" },
                { title: "Women's Safety Laws", link: "https://wcd.nic.in/" },
                { title: "Cyber Crime Reporting", link: "https://cybercrime.gov.in/" },
                { title: "Tenant Rights in India", link: "https://mohua.gov.in/" },
                { title: "Basics of Intellectual Property", link: "https://ipindia.gov.in/" }
            ]
        },
        {
            title: "Video Tutorials",
            icon: <Video className="h-6 w-6 text-red-500" />,
            items: [
                { title: "Courtroom Etiquette 101", link: "https://www.youtube.com/results?search_query=courtroom+etiquette+india" },
                { title: "Drafting a Legal Notice", link: "https://www.youtube.com/results?search_query=how+to+draft+legal+notice" },
                { title: "Understanding Bail Process", link: "https://www.youtube.com/results?search_query=bail+process+india" },
                { title: "Cyber Crime Reporting", link: "https://www.youtube.com/results?search_query=cyber+crime+reporting+india" },
                { title: "Property Registration Basics", link: "https://www.youtube.com/results?search_query=property+registration+process+india" },
                { title: "Public Interest Litigation (PIL)", link: "https://www.youtube.com/results?search_query=how+to+file+PIL+india" },
                { title: "Filling Income Tax Return", link: "https://www.youtube.com/results?search_query=file+itr+india" },
                { title: "Cheque Bounce Case Procedure", link: "https://www.youtube.com/results?search_query=cheque+bounce+case+procedure" }
            ]
        }
    ];

    const handleDownloadGuide = () => {

        const content = `
Complete Guide to New Criminal Laws (2024)
===========================================

1. Bharatiya Nyaya Sanhita (BNS) replaces the Indian Penal Code (IPC).
   - Key Changes: Digitization of FIRs, stricter punishments for mob lynching, and organized crime.

2. Bharatiya Nagarik Suraksha Sanhita (BNSS) replaces the Code of Criminal Procedure (CrPC).
   - Key Changes: Time-bound trials, mandatory forensic evidence collection for serious crimes.

3. Bharatiya Sakshya Adhiniyam (BSA) replaces the Indian Evidence Act.
   - Key Changes: Electronic evidence (emails, server logs) is now primary evidence.

For detailed analysis, please visit official MHA website.
        `;

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "BNS_BNSS_Guide_2024.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {categories.map((category, idx) => (
                        <CategoryCard key={idx} category={category} idx={idx} searchQuery={searchQuery} />
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
                    <Button
                        size="lg"
                        variant="secondary"
                        className="whitespace-nowrap"
                        onClick={handleDownloadGuide}
                    >
                        Download Guide
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}

function CategoryCard({ category, idx, searchQuery }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter items based on search query
    const filteredItems = category.items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // If searching, show all matching items, otherwise respect view all logic
    const displayItems = searchQuery
        ? filteredItems
        : (isExpanded ? filteredItems : filteredItems.slice(0, 5));

    if (filteredItems.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col h-full"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {category.title}
                </h2>
            </div>

            <ul className="space-y-4 flex-grow">
                <AnimatePresence>
                    {displayItems.map((item, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                            onClick={() => window.open(item.link, '_blank')}
                        >
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                                {item.title}
                            </span>
                            <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>

            {!searchQuery && filteredItems.length > 5 && (
                <Button
                    variant="ghost"
                    className="w-full mt-6 text-primary hover:text-primary/80 hover:bg-primary/5"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? (
                        <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
                    ) : (
                        <>View All ({filteredItems.length}) <ChevronDown className="ml-2 h-4 w-4" /></>
                    )}
                </Button>
            )}
        </motion.div>
    );
}
