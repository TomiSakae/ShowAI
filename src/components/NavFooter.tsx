import Link from 'next/link';

const NavBar = () => (
    <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
                ShowAI
            </Link>
            <ul className="flex space-x-4">
                <li>
                    <Link href="/" className="hover:text-gray-300">
                        Trang chủ
                    </Link>
                </li>
                <li>
                    <Link href="/about" className="hover:text-gray-300">
                        Giới thiệu
                    </Link>
                </li>
                <li>
                    <Link href="/contact" className="hover:text-gray-300">
                        Liên hệ
                    </Link>
                </li>
            </ul>
        </div>
    </nav>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <p>&copy; 2024 ShowAI. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="flex space-x-4">
                <Link href="/terms" className="hover:text-gray-300">
                    Điều khoản sử dụng
                </Link>
                <Link href="/privacy" className="hover:text-gray-300">
                    Chính sách bảo mật
                </Link>
                <Link href="/contact" className="hover:text-gray-300">
                    Liên hệ
                </Link>
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