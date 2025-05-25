import { ContractCell } from './contract-cell';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

const FormSchema = z.object({
    surname_name: z.string().min(8, {
        message: "Surname and Name must be at least 8 characters.",
    }),
    tax_code: z.string().min(16, {
        message: "Tax Code must be at least 16 characters.",
    }),
    gender: z.enum(["M", "F"], {
        required_error: "Gender is required.",
        invalid_type_error: "Gender must be either 'M' or 'F'."
    }),
    residence: z.string().min(5, {
        message: "Residence must be at least 5 characters.",
    }),
    city: z.string().min(2, {
        message: "City must be at least 2 characters.",
    }),
    province: z.string().length(2, {
        message: "Province must be exactly 2 characters.",
    }),
    postal_code: z.string().length(5, {
        message: "Postal Code must be exactly 5 characters.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 characters.",
    }),
    birth_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Birth date must be a valid date.",
    }),
    birth_place: z.string().min(2, {
        message: "Birth place must be at least 2 characters.",
    }),
    birth_province: z.string().length(2, {
        message: "Birth province must be exactly 2 characters.",
    }),
    license_type: z.string().min(1, {
        message: "License type is required.",
    }),
    license_number: z.string().min(5, {
        message: "License number must be at least 5 characters.",
    }),
    issuing_authority: z.string().min(5, {
        message: "Issuing authority must be at least 5 characters.",
    }),
    issue_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Issue date must be a valid date.",
    }),
    expiration_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Expiration date must be a valid date.",
    }),
    email: z.string().email({
        message: "Email must be a valid email address.",
    }),
});

export default function CustomerTableDetails() {
    const form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
                surname_name: "",
                tax_code: "",
                residence: "",
                city: "",
                province: "",
                postal_code: "",
                phone: "",
                birth_date: "",
                birth_place: "",
                birth_province: "",
                license_type: "",
                license_number: "",
                issuing_authority: "",
                issue_date: "",
                expiration_date: "",
                email: "",
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