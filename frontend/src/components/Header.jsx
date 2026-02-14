import { Link, useNavigate } from "react-router-dom"
import { Scale, FileText, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-6 flex items-center space-x-2" to="/">
                        <Scale className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            Legal Mitra
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            className="transition-colors hover:text-foreground/80 text-foreground"
                            to="/chat"
                        >
                            Chat
                        </Link>
                        <Link
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                            to="/resources"
                        >
                            Resources
                        </Link>
                        <Link
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                            to="/templates"
                        >
                            Templates
                        </Link>
                        <Link
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                            to="/legal-aid"
                        >
                            Legal Aid
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or extra items */}
                    </div>
                    <nav className="flex items-center">
                        <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Templates</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                            <span className="sr-only">Help</span>
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="ml-2"
                            onClick={() => navigate("/login")}
                        >
                            Log In
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
