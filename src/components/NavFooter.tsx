import Link from 'next/link';

const NavBar = () => (
    <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
                ShowAI
            </Link>
        </div>
    </nav>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto flex flex-col items-center justify-center">
            <div className="text-center">
                <p>ShowAI</p>
            </div>
        </div>
    </footer>
);

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;