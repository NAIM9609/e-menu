"use client"
import Contract from "@/components/contract-component/contract"

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRef } from "react";


export default function Home() {

	const printRef = useRef<HTMLDivElement>(null);

	const handlePrint = async () => {
		if (!printRef.current) return;
		const canvas = await html2canvas(printRef.current, { scale: 1 });
		const imgData = canvas.toDataURL("image/png");
		const pdf = new jsPDF("p", "pt", "a4");
		// A4 size: 595 x 842 pt
		pdf.addImage(imgData, "PNG", 0, 0, 595, 842);
		pdf.save("document.pdf");
	};

	return (
		<SidebarProvider>
			<SidebarLeft />
			<SidebarInset>
				<header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
					<div className="flex flex-1 items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage className="line-clamp-1">
										Project Management & Task Tracking
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
						<Contract ref={printRef} />
						<button onClick={handlePrint}>Save as PDF</button>
				</div>
			</SidebarInset>
			<SidebarRight />
		</SidebarProvider>
	)
}
