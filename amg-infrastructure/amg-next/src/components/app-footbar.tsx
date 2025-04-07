import Image from "next/image";

interface AppFootbarProps {
    className?: string;
}

export default function AppFootbar({ className }: AppFootbarProps) {
    return (
        <div className={className}>
            <footer className="footer row-start-3 flex gap-6 flex-wrap items-center justify-center p-6">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>Powered by</span>
                    <Image
                        src="/vercel.svg"
                        alt="Vercel logomark"
                        width={20}
                        height={20}
                    />
                </a>
            </footer>
        </div>
    );
}