import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Download, FileText } from "lucide-react";
import { motion } from "framer-motion";

// Placeholder templates data - ideally this would act as a small database or come from an API
const TEMPLATE_DEFAULTS = {
    "Affidavit Name Change": `AFFIDAVIT FOR CHANGE OF NAME

I, [Current Name], s/o / d/o / w/o [Parent/Spouse Name], aged about [Age] years, residing at [Address], do hereby solemnly affirm and declare as under:

1. That my recorded name is [Current Name].
2. That I desire to change my name from [Current Name] to [New Name].
3. That I declare that I shall at all times hereafter in all records, deeds, and writings, and in all proceedings, dealings, and transactions, private as well as upon all occasions whatsoever, use and sign the name of [New Name] as my name in place and substitution of my former name.
4. That I expressly authorize and request all persons at all times hereafter to designate and address me by such assumed name of [New Name] accordingly.

Verification:
I, the above-named deponent, do hereby verify that the contents of the above affidavit are true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed therefrom.

Date: [Date]
Place: [Place]

(Signature of Deponent)
`,
    "Rental Agreement": `RENTAL AGREEMENT

This Rent Agreement is made on this [Date] by and between:

[Landlord Name], s/o [Landlord Father Name], residing at [Landlord Address] (hereinafter called the LESSOR/LANDLORD).

AND

[Tenant Name], s/o [Tenant Father Name], residing at [Tenant Address] (hereinafter called the LESSEE/TENANT).

WHEREAS, the Lessor is the absolute owner of the property located at [Property Address].
WHEREAS, the Tenant has requested the Lessor to let out the said premises on a monthly rent basis, and the Lessor has agreed to the same on the following terms and conditions:

1. The rent for the said premises is fixed at Rs. [Rent Amount] per month.
2. The tenancy shall commence from [Start Date] and shall be valid for a period of 11 months.
3. The Tenant has paid a security deposit of Rs. [Deposit Amount] which is refundable at the time of vacating the premises.
4. The Tenant shall use the premises for residential purposes only.

IN WITNESS WHEREOF, the parties have signed this agreement on the day and year first above written.

Lessor: _________________
Tenant: _________________

Witness 1: ______________
Witness 2: ______________
`,
    // default template for others.
    "default": `[TEMPLATE CONTENT]

Customize this template by editing the text here. 
Fill in the brackets like [Name], [Date], and [Address] with your details.
`
};

export function TemplateEditorPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState(state?.title || "Untitled Document");
    const [content, setContent] = useState(TEMPLATE_DEFAULTS[state?.title] || TEMPLATE_DEFAULTS["default"]);

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-8 font-semibold text-lg border-transparent hover:border-slate-200 focus:border-blue-500 px-2 -ml-2 w-[300px]"
                            />
                            <p className="text-xs text-slate-500 px-[2px]">Last edited just now</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => alert("Save functionality would save to user profile database.")}>
                        <Save className="mr-2 h-4 w-4" /> Save Draft
                    </Button>
                    <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-lg min-h-[800px] p-12 border border-slate-200 dark:border-slate-800"
                >
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full min-h-[700px] resize-none outline-none text-slate-800 dark:text-slate-200 text-lg leading-relaxed font-serif bg-transparent"
                        placeholder="Start typing your document..."
                        spellCheck="false"
                    />
                </motion.div>
            </div>
        </div>
    );
}
