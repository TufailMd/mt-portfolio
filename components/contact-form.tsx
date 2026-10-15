"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import {
    Field,
    FieldLabel,
    FieldError,
    FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    function onSubmit(values: FormValues) {
        // Backend logic can be added here.
        console.log(values);

        toast.success("Message submitted successfully!");
        form.reset();
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
        >
            <FieldGroup>
                <Field data-invalid={!!form.formState.errors.name}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                        id="name"
                        placeholder="Rahul Kumar"
                        autoComplete="name"
                        aria-invalid={!!form.formState.errors.name}
                        {...form.register("name")}
                    />
                    <FieldError errors={[form.formState.errors.name]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.email}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="rahulkr@gmail.com"
                        autoComplete="email"
                        aria-invalid={!!form.formState.errors.email}
                        {...form.register("email")}
                    />
                    <FieldError errors={[form.formState.errors.email]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.message}>
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <Textarea
                        id="message"
                        placeholder="Tell me about your requirements"
                        className="min-h-30"
                        aria-invalid={!!form.formState.errors.message}
                        {...form.register("message")}
                    />
                    <FieldError errors={[form.formState.errors.message]} />
                </Field>
            </FieldGroup>

            <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
            >
                Send message
            </Button>
        </form>
    );
};

export default ContactForm;