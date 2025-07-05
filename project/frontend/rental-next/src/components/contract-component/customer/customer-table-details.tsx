import { ContractCell } from '../contract-cell';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { CustomerTableDefaultValues, CustomerTableSchema } from './customer-models';



export default function CustomerTableDetails() {
    const form = useForm<z.infer<typeof CustomerTableSchema>>({
            resolver: zodResolver(CustomerTableSchema),
            defaultValues: CustomerTableDefaultValues,
        })

        function onSubmit(data: z.infer<typeof CustomerTableSchema>) {
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

                        <ContractCell form={form} formName="surname_name" label="Cognome e Nome:" value="Gaetano LoZio" />

                        <ContractCell form={form} formName="tax_code" label="Codice Fiscale:" value="LZNGTN90A01C351Z" />

                        <ContractCell form={form} formName="gender" label="Sesso:" value="M" grow={false} />

                    </div>

                    {/* Customer details table 2nd row */}
                    <div className="flex flex-row items-center w-full">

                        <ContractCell form={form} formName="residence" label="Residenza:" value="Via spartilacqua potabile, 27" />

                        <ContractCell form={form} formName="city" label="Citta&#39;:" value="Catania" />

                        <ContractCell form={form} formName="province" label="Prov.:" value="CT" grow={false} />

                        <ContractCell form={form} formName="postal_code" label="CAP:" value="95100" grow={false} />

                    </div>

                    {/* Customer details table 3rd row */}
                    <div className="flex flex-row items-center w-full">

                        <ContractCell form={form} formName="phone" label="Telefono:" value="0957088392" />

                        <ContractCell form={form} formName="birth_date" label="Data di nascita:" value="01/01/1990" />

                        <ContractCell form={form} formName="birth_place" label="Luogo:" value="Catania" />

                        <ContractCell form={form} formName="birth_province" label="Prov.:" value="CT" grow={false} />

                    </div>

                    {/* Customer details table 4th row */}
                    <div className="flex flex-row items-center w-full">

                        <ContractCell form={form} formName="license_type" label="Tipo patente:" value="B" grow={false} />

                        <ContractCell form={form} formName="license_number" label="N.:" value="L120331982" />

                        <ContractCell form={form} formName="issuing_authority" label="Ente rilascio:" value="Motorizzazione Civile" />

                    </div>

                    {/* Customer details table 5th row */}
                    <div className="flex flex-row items-center w-full">

                        <ContractCell form={form} formName="issue_date" label="Data rilascio:" value="01/01/2020" grow={false} />

                        <ContractCell form={form} formName="expiration_date" label="Data scadenza:" value="01/01/2030" grow={false} />

                        <ContractCell form={form} formName="email" label="Email:" value="motorizzazione@example.com" />

                    </div>

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
    );

};