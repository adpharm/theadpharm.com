import { useForm } from "react-hook-form";
import React from "react";
import { object, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  organization: z.string().optional(),
  message: z.string().min(1, { message: "Message is required" }),
});

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const onSubmit = async (data: any) => {
    console.log(data);

    // generate a unique ID for the form submission
    const formSubmissionId = Math.random().toString(36).substring(2, 15);

    // setShowAgreementModal(true);

    try {
      const res = await fetch("https://data-collector.theadpharm.com/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          formSubmissionId,
          type: "thedpharm_get_in_touch",
        }),
      });

      console.log(res);

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const response = await res.json();

      setSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      setFailure(true);
    }

    // setShowAgreementModal(false);

    // closeModal();
    reset();
  };

  return (
    <form
      className="space-y-6 max-w-md border border-zinc-800 p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl mb-4">Get in touch</h2>
      <div>
        <label htmlFor="firstName" className="block text-zinc-400">
          First Name
        </label>
        <input
          {...register("firstName", { required: true })}
          type="text"
          id="firstName"
          name="firstName"
          required
          className="mt-1 block w-full bg-black border border-zinc-800 py-2 px-3 text-white focus:outline-none focus:border-orange-500"
        />
        {errors.firstName && (
          <p className="text-xs pl-1 pt-1 text-left text-red-500">
            {errors.firstName.message?.toString()}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-zinc-400">
          Last Name
        </label>
        <input
          {...register("lastName", { required: false })}
          type="text"
          id="lastName"
          name="lastName"
          className="mt-1 block w-full bg-black border border-zinc-800 py-2 px-3 text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="organization" className="block text-zinc-400">
          Organization
        </label>
        <input
          {...register("organization", { required: false })}
          type="text"
          id="organization"
          name="organization"
          required
          className="mt-1 block w-full bg-black border border-zinc-800 py-2 px-3 text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-zinc-400">
          Email
        </label>
        <input
          {...register("email", { required: true })}
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full bg-black border border-zinc-800 py-2 px-3 text-white focus:outline-none focus:border-orange-500"
        />
        {errors.email && (
          <p className="text-xs pl-1 pt-1 text-left text-red-500">
            {errors.email.message?.toString()}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-zinc-400">
          How Can We Help?
        </label>
        <textarea
          {...register("message", { required: true })}
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 block w-full bg-black border border-zinc-800 py-2 px-3 text-white focus:outline-none focus:border-orange-500"
        ></textarea>
        {errors.message && (
          <p className="text-xs pl-1 pt-1 text-left text-red-500">
            {errors.message.message?.toString()}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-row justify-center items-stretch bg-orange-600 rounded-full px-6 py-2 mt-6 max-w-44 animate-fade-in-2"
        >
          Submit <ArrowRight className="ml-2 animate-pulse" />
        </button>
      </div>
    </form>
  );
}
