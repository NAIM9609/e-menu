import AppFootbar from "@/components/app-footbar";
import AppHome from "@/components/app-home";
import AppTopbar from "@/components/app-topbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppTopbar/>
      <AppHome className="flex-grow"/>
      <AppFootbar className="flex-shrink-0"/>
    </div>
  );
}
