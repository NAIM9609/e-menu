import { Input } from "../ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { UseFormReturn } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ContractCell({ form, formName, label, value, grow = true }: { form: UseFormReturn<any>; formName: string; label: string; value: string; grow?: boolean }) {
    return (
        <div className={`flex ${grow ? "flex-grow" : "flex-grow-0"} items-center p-1 gap-2 border border-black`}>
            <div className="flex w-full flex-row">
                <FormField
                    control={form.control}
                    name={formName}
                    render={({ field }) => (
                            <FormItem className="w-full">
                                <div className="flex flex-row items-center">
                                        <FormLabel>
                                            <div className="text-xs text-center text-nowrap font-bold">{label}</div>
                                        </FormLabel>
                                        <FormControl>
                                            <Input className="" placeholder={value} {...field} />
                                        </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                    )}
                />
            </div>
        </div>
    );
}