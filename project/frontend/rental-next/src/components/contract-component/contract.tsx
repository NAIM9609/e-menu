import Image from "next/image";
import CustomerTableDetails from "./customer-table-details";
import React from "react";

const Contract = React.forwardRef<HTMLDivElement>((props, ref) => (
    <div ref={ref} className="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" >
        <div className="flex flex-col items-center justify-center p-4 bg-white">
            <div className="flex flex-col w-full items-center justify-center gap-4">

                {/* Header */}
                <div className="flex flex-row gap-2 w-full">

                    {/* Logo */}
                    <div className="flex items-center flex-grow-1 justify-center">

                        <Image src="/logo.png" alt="Logo" width={400} height={250} />
                    </div>

                    {/* Contract Details */}
                    <div className="flex flex-col w-full items-center flex-grow-2 justify-start p-2 bg-blue-400 border-2 border-black">

                        {/* Contract number */}
                        <div className="flex flex-row items-center gap-6">

                            <p className="text-base font-bold inline-block">
                                Contratto autonoleggio SENZA conducente N°
                            </p>
                            <span className="text-xs font-bold inline-block">123456789</span>
                        </div>

                        <br />

                        {/* Contract date & location */}
                        <div className="flex flex-row w-full items-center">

                            {/* Contract date */}
                            <div className="flex items-center flex-start flex-grow flex-row gap-4">
                                <p className="text-base font-bold inline-block">Data stipula:</p>
                                <span className="text-sm font-bold inline-block">/2025</span>
                            </div>

                            {/* Contract location */}
                            <div className="flex items-center flex-start flex-grow flex-row gap-4">
                                <p className="text-base font-bold inline-block">Luogo:</p>
                                <span className="text-sm font-bold inline-block">Catania</span>
                            </div>
                        </div>

                        <br />
                        <br />

                        {/* Contract additional driver */}
                        <div className="flex w-full flex-col flex-start gap-2">

                            <p className="text-base font-bold">
                                CONDUCENTE SUPPLEMENTARE:
                            </p>

                            <span className="text-xs font-bold">ZioTano</span>
                        </div>

                        <br />
                    </div>
                </div>

                {/* Customer details */}
                <div className="flex flex-col w-full">

                    {/* Customer details header */}
                    <div className="flex items-center justify-center w-full">
                        <div className="w-full text-base text-center font-bold border-2 border-black bg-blue-400 p-1">
                            DATI CLIENTE
                        </div>
                    </div>

                    <CustomerTableDetails />

                </div>

            </div>
        </div>
    </div>
));

export default Contract;
Contract.displayName = "Contract";