import { Link, useNavigate, useLocation } from "react-router-dom"
import { Scale, FileText, Phone, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { addToast } = useToast();

    const handleLogout = () => {
        logout();
        addToast({
            title: "Logged Out",
            message: "You have been securely logged out. See you soon!",
            type: "info"
        });
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-6 flex items-center space-x-2" to="/">
                        <Scale className="h-6 w-6 text-blue-600" />
                        <span className="hidden font-bold sm:inline-block text-blue-600">
                            Legal Mitra
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            className={`transition-colors hover:text-foreground/80 ${location.pathname === '/chat' ? 'text-blue-600 font-bold' : 'text-foreground/60'}`}
                            to="/chat"
                        >
                            Chat
                        </Link>
                        <Link
                            className={`transition-colors hover:text-foreground/80 ${location.pathname === '/resources' ? 'text-blue-600 font-bold' : 'text-foreground/60'}`}
                            to="/resources"
                        >
                            Resources
                        </Link>
                        <Link
                            className={`transition-colors hover:text-foreground/80 ${location.pathname === '/templates' ? 'text-blue-600 font-bold' : 'text-foreground/60'}`}
                            to="/templates"
                        >
                            Templates
                        </Link>
                        <Link
                            className={`transition-colors hover:text-foreground/80 ${location.pathname === '/legal-aid' ? 'text-blue-600 font-bold' : 'text-foreground/60'}`}
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
                    <nav className="flex items-center space-x-2">
                        {user ? (
                            <div className="flex items-center gap-2">
                                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mr-2">
                                    <User className="h-4 w-4" />
                                    <span>{user.name}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <>
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
                                    className="ml-2 bg-blue-600 hover:bg-blue-500"
                                    onClick={() => navigate("/login")}
                                >
                                    Log In
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
