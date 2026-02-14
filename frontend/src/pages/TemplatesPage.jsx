import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Edit3, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function TemplatesPage() {
    const [activeTab, setActiveTab] = useState("all");

    const templates = {
        personal: [
            { title: "Affidavit Name Change", desc: "Format for legal name change declaration" }, // Local
            { title: "Divorce Petition", desc: "Mutual consent divorce filing template", link: "https://districts.ecourts.gov.in/" },
            { title: "Will & Testament", desc: "Standard format for drafting a personal will", link: "https://legalaffairs.gov.in/" },
            { title: "Power of Attorney", desc: "General Power of Attorney (GPA) format", link: "https://mea.gov.in/Images/pdf/PowerofAttorney.pdf" },
        ],
        business: [
            { title: "Employment Contract", desc: "Standard hiring agreement for employees", link: "https://www.startupindia.gov.in/content/sih/en/tools_templates.html" },
            { title: "NDA (Non-Disclosure)", desc: "Confidentiality agreement for business partners", link: "https://www.startupindia.gov.in/content/sih/en/tools_templates.html" },
            { title: "Partnership Deed", desc: "Agreement for forming a partnership firm", link: "https://www.startupindia.gov.in/content/sih/en/tools_templates.html" },
            { title: "Freelance Agreement", desc: "Contract for independent contractors", link: "https://www.startupindia.gov.in/content/sih/en/tools_templates.html" },
        ],
        property: [
            { title: "Rental Agreement", desc: "House rent agreement format (11 months)" }, // Local
            { title: "Sale Deed Draft", desc: "Draft for property sale and purchase", link: "https://dolr.gov.in/" },
            { title: "Lease Termination", desc: "Notice for ending a lease agreement", link: "https://mohua.gov.in/" },
            { title: "Gift Deed", desc: "Format for gifting property to family members", link: "https://igregistration.maharashtra.gov.in/" },
        ],
        legal: [
            { title: "Legal Notice", desc: "Notice for recovery of money or defamation", link: "https://nalsa.gov.in/" },
            { title: "RTI Application", desc: "Format for filing Right to Information request", link: "https://rtionline.gov.in/" },
            { title: "Consumer Complaint", desc: "Complaint format for consumer forum", link: "https://edaakhil.nic.in/" },
            { title: "Cheque Bounce Notice", desc: "Section 138 NI Act notice format", link: "https://districts.ecourts.gov.in/" },
        ]
    };

    const getFilteredTemplates = () => {
        if (activeTab === "all") {
            return Object.values(templates).flat();
        }
        return templates[activeTab] || [];
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Legal Document Templates
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Download ready-to-use legal drafts. Use our AI editor to customize them to your specific needs instantly.
                    </p>
                </motion.div>

                {/* Custom Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                        {["all", "business", "property", "personal", "legal"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all capitalize ${activeTab === tab
                                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {getFilteredTemplates().map((template, i) => (
                            <motion.div
                                key={`${activeTab}-${i}`}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TemplateCard title={template.title} desc={template.desc} link={template.link} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function TemplateCard({ title, desc, link }) {
    const navigate = useNavigate();

    const handleUseTemplate = () => {
        if (link) {
            window.open(link, '_blank');
        } else {
            navigate('/templates/edit', { state: { title } });
        }
    };

    return (
        <div className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                    <FileText className="h-6 w-6" />
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-green-600">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow">
                {desc}
            </p>

            <Button
                className="w-full group-hover:bg-blue-600 group-hover:text-white hover:bg-blue-600 hover:text-white transition-colors mt-auto"
                variant="outline"
                onClick={handleUseTemplate}
            >
                {link ? (
                    <>
                        View Official Model <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                ) : (
                    <>
                        Use Template <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>
        </div>
    );
}
