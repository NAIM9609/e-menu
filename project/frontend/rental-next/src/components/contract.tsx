import Image from "next/image";

export default function Contract() {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-col w-full items-center justify-center gap-4 bg-white">

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

                {/* Customer details table 1st row */}
                <div className="flex flex-row items-center w-full">

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Cognome e Nome:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">Gaetano LoZio</span>
                        </div>
                    </div>

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Codice Fiscale:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">LZNGTN90A01C351Z</span>
                        </div>
                    </div>

                    <div className="flex flex-grow-0 items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Sesso.:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">M</span>
                        </div>
                    </div>

                </div>

                {/* Customer details table 2nd row */}
                <div className="flex flex-row items-center w-full">

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Indirizzo:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">Via spartilacqua potabile, 27</span>
                        </div>
                    </div>

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Citta&#39;:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">Catania</span>
                        </div>
                    </div>

                    <div className="flex flex-grow-0 items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Prov:</div>
                        <div className="flex">
                            <span className="text-xs text-center font-bold inline-block">CT</span>
                        </div>
                    </div>

                    <div className="flex flex-grow-0 items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">CAP:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">95100</span>
                        </div>
                    </div>

                </div>

                {/* Customer details table 3rd row */}
                <div className="flex flex-row items-center w-full">

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Telefono:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">0957088392</span>
                        </div>
                    </div>

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Data di nascita:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">01/01/1990</span>
                        </div>
                    </div>

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Luogo:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">Catania</span>
                        </div>
                    </div>

                    <div className="flex flex-grow-0 items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Prov.:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">CT</span>
                        </div>
                    </div>

                </div>

                {/* Customer details table 4th row */}
                <div className="flex flex-row items-center w-full">

                    <div className="flex flex-grow-0 items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Tipo patente:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">B</span>
                        </div>
                    </div>

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">N.:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">L120331982</span>
                        </div>
                    </div>

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Ente ril.:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">Motorizzazione</span>
                        </div>
                    </div>

                </div>

                {/* Customer details table 5th row */}
                <div className="flex flex-row items-center w-full">

                    <div className="flex flex-grow-0 items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Data rilascio:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">01/01/2020</span>
                        </div>
                    </div>

                    <div className="flex flex-grow-0 items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Data scadenza:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">01/01/2030</span>
                        </div>
                    </div>

                    <div className="flex flex-grow items-center p-1 gap-2 border border-black">

                        <div className="flex text-base text-center font-bold">Email:</div>
                        <div className="flex">
                            <span className="text-xs font-bold inline-block">motorizzazione@example.com</span>
                        </div>
                    </div>

                </div>

            </div>

        </div>
      </div>
    </>
  );
}