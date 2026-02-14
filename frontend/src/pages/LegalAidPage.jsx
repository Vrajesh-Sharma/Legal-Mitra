import { MapPin, Phone, MessageCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function LegalAidPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero */}
            <section className="bg-primary/5 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-600 font-semibold text-sm mb-6">
                            Free Legal Support
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                            Justice Should Not Be a Luxury.
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                            Connect with pro-bono lawyers, NGOs, and government legal aid services instantly. We believe every Indian citizen deserves fair representation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                                Find Lawyer Near Me <MapPin className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-primary text-primary hover:bg-primary/10">
                                Call Helpline (15100) <Phone className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "NALSA & SLSA Services",
                            desc: "Connect directly with National/State Legal Services Authorities for free court representation.",
                            icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
                            action: "Apply Now"
                        },
                        {
                            title: "NGO Directory",
                            desc: "Browse our curated list of 500+ NGOs specializing in women's rights, labor laws, and tenant disputes.",
                            icon: <MessageCircle className="h-8 w-8 text-green-500" />,
                            action: "Browse Directory"
                        },
                        {
                            title: "Pro-Bono Lawyers",
                            desc: "Search for lawyers who have volunteered to take up cases for free or at reduced fees.",
                            icon: <MapPin className="h-8 w-8 text-blue-500" />,
                            action: "Search Lawyers"
                        }
                    ].map((service, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                {service.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                {service.desc}
                            </p>
                            <Button variant="link" className="p-0 text-primary font-semibold text-lg flex items-center group">
                                {service.action} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Eligibility Check */}
            <section className="py-20 bg-slate-900 text-white px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Am I Eligible for Free Legal Aid?</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-blue-400">You are eligible if you are:</h3>
                            <ul className="space-y-3">
                                {["A woman or child", "Member of SC/ST", "Industrial workman", "Victim of mass disaster/violence", "Disabled person", "In custody/juvenile home"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-green-400 rounded-full" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-blue-400">Income Criteria:</h3>
                            <p className="text-slate-300">
                                Check your specific state's income limit. Generally, annual income should be less than ₹3,00,000 for High Court cases and ₹5,00,000 for Supreme Court cases.
                            </p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                                Check My Eligibility
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
