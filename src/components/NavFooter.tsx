import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => (
    <nav className="bg-[#3E52E8] text-white p-4">
        <div className="container md:mx-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold">
                <Image src="https://tomisakae.github.io/ShowAI/logo.jpg" alt="ShowAI Logo" className='rounded-full' width={60} height={60} />
            </Link>
        </div>
    </nav>
);

const Footer = () => (
    <footer className="bg-[#3E52E8] text-white p-4">
        <div className="container mx-auto flex flex-col items-center justify-center">
            <div className="text-center font-bold text-lg">
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