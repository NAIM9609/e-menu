import { z } from "zod"

export const CustomerTableSchema = z.object({
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

export const CustomerTableDefaultValues =
{
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
};