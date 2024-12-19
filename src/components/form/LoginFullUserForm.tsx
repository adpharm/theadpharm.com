import { z } from "astro:schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { generateRandomUsername } from "@/lib/generateRandomUsername";
import { Button } from "../ui/button";
import { actions } from "astro:actions";
import { useStore } from "@nanostores/react";
import { $router } from "@/lib/stores/router";
import { parseRouterSearch } from "@/lib/utils.searchParams";
import { useEffect } from "react";
import { log, logDebug, logError } from "@/lib/utils.logger";
import { $guestCode } from "@/lib/stores";
import { newPlinkoGame } from "@/lib/client/newPlinkoGame";
import { RefreshCcw } from "lucide-react";
import { signInUserSchema } from "@/lib/zod.schema";
import { Separator } from "../ui/separator";
import { getPagePath } from "@nanostores/router";

export function LoginFullUserForm() {
  const router = useStore($router);
  const guestCode = useStore($guestCode);
  const search = parseRouterSearch(router);
  const guestFromSearch = search.guest;
  const isValidGuest = !!(
    guestFromSearch && guestFromSearch.code === guestCode
  );

  // form
  const form = useForm<z.infer<typeof signInUserSchema>>({
    resolver: zodResolver(signInUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // submit
  const onSubmit = form.handleSubmit(
    async (inputData) => {
      // create the anonymous user
      const { data, error } = await actions.user.signInUser(inputData);

      // if there's an error, show it
      if (error) {
        return form.setError("root", { message: error.message });
      }

      // navigate to games home page
      // TODO: update this link
      window.location.href = getPagePath($router, "games.plinko.home");
    },
    (err) => logError("RHF Error", err),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-8">
        {/***************************************************
         *
         * Username
         *
         ****************************************************/}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/***************************************************
         *
         * Password
         *
         ****************************************************/}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>

              <FormControl>
                <Input {...field} type="password" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/***************************************************
         *
         * Submit
         *
         ****************************************************/}
        <Button type="submit">
          {form.formState.isSubmitting ? "Submitting..." : "Sign in"}
        </Button>

        {form.formState.errors.root && (
          <div className="text-red-500 dark:text-red-300">
            {form.formState.errors.root.message}
          </div>
        )}

        {/***************************************************
         *
         * OR Sign in/sign up buttons
         *
         ****************************************************/}
        <div className="">
          <div className="text-center">
            <Separator />
          </div>

          <FormDescription className="py-4 text-center">
            Need an account?
          </FormDescription>

          <div className="grid grid-cols-1 gap-4">
            <Button type="button" variant="secondary" asChild>
              <a href={getPagePath($router, "register")}>Sign up</a>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
