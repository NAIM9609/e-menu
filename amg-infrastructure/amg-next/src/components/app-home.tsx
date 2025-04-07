interface AppHomeProps {
    className?: string;
}


export default function AppHome({ className }: AppHomeProps) {
    return (
        <div className={className}>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-zinc-100/50 aspect-video rounded-full dark:bg-zinc-800/50" />
                    <div className="bg-zinc-100/50 aspect-video rounded-full dark:bg-zinc-800/50" />
                    <div className="bg-zinc-100/50 aspect-video rounded-full dark:bg-zinc-800/50" />
                </div>
                <div className="bg-zinc-100/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min dark:bg-zinc-800/50">
                    ciao
                </div>
            </div>
        </div>
    );
};