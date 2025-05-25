import { ContractCell } from './contract-cell';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export default function CustomerTableDetails() {
    const form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
                username: "",
            },
        })

        function onSubmit(data: z.infer<typeof FormSchema>) {
            toast({
                title: "You submitted the following values:",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
            })
        }

    return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">

                    {/* Customer details table 1st row */}
                    <div className="flex flex-row items-center w-full">

                        <ContractCell form={form} label="Cognome e Nome:" value="Gaetano LoZio" />

                        <ContractCell form={form} label="Codice Fiscale:" value="LZNGTN90A01C351Z" />

                        <ContractCell form={form} label="Sesso:" value="M" grow={false} />

                    </div>

                    {/* Customer details table 2nd row */}
                    <div className="flex flex-row items-center w-full">

                        <ContractCell form={form} label="Residenza:" value="Via spartilacqua potabile, 27" />

                        <ContractCell form={form} label="Citta&#39;:" value="Catania" />

                        <ContractCell form={form} label="Provincia:" value="CT" grow={false} />

                        <ContractCell form={form} label="CAP:" value="95100" grow={false} />

                    </div>

                    {/* Customer details table 3rd row */}
                    <div className="flex flex-row items-center w-full">

                        <ContractCell form={form} label="Telefono:" value="0957088392" />

                        <ContractCell form={form} label="Data di nascita:" value="01/01/1990" />

                        <ContractCell form={form} label="Luogo:" value="Catania" />

                        <ContractCell form={form} label="Prov.:" value="CT" grow={false} />

                    </div>

                    {/* Customer details table 4th row */}
                    <div className="flex flex-row items-center w-full">

                        <ContractCell form={form} label="Tipo patente:" value="B" grow={false} />

                        <ContractCell form={form} label="N.:" value="L120331982" />

                        <ContractCell form={form} label="Ente rilascio:" value="Motorizzazione Civile" />

                    </div>

                    {/* Customer details table 5th row */}
                    <div className="flex flex-row items-center w-full">

                        <ContractCell form={form} label="Data rilascio:" value="01/01/2020" grow={false} />

                        <ContractCell form={form} label="Data scadenza:" value="01/01/2030" grow={false} />

                        <ContractCell form={form} label="Email:" value="motorizzazione@example.com" />

                    </div>

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
    );

};