import CommonButton from "../common-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";



function Commonform({ formControls = [], handleSubmit, form, btnText }) {

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                {
                    formControls?.length > 0 ?
                        formControls.map(controlItem => (
                            <FormField
                                key={controlItem.id}
                                control={form.control}
                                name={controlItem?.id}
                                rules={controlItem?.validation || {}}
                                render={({ field }) => {
                                    return <FormItem className="mb-4">
                                        <FormLabel>{controlItem.label}</FormLabel>
                                        {
                                            controlItem?.componentType === "input" ?
                                                <FormControl>
                                                    <Input
                                                        placeholder={controlItem?.placeholder}
                                                        type={controlItem.type}
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        min={
                                                            controlItem.type === "date"
                                                                ? new Date().toISOString().split("T")[0]
                                                                : undefined
                                                        }
                                                        className="w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                                                </FormControl> :
                                                controlItem?.componentType === "select" ?
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
                                                                {
                                                                    field.value ? <SelectValue
                                                                        className="text-black focus:text-black"
                                                                        placeholder={controlItem.placeholder}
                                                                    /> : "Select"
                                                                }
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-white">
                                                            {
                                                                controlItem.options?.map(optionItem => <SelectItem key={optionItem.id}
                                                                    value={optionItem.id}
                                                                    className="text-black cursor-pointer focus:text-black">
                                                                    {optionItem?.label}
                                                                </SelectItem>)
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    : null
                                        }
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                }}
                            />
                        ))
                        : null
                }
                <div className="flex justify-center mt-4 items-center">
                    <CommonButton
                        type={"submit"}
                        buttonText={btnText}
                        disabled={!form.formState.isValid && form.formState.isSubmitted}
                    />
                </div>

            </form>
        </Form>
    )
}

export default Commonform;