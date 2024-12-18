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
import { createGuestUserSchema } from "@/lib/server/actions.user";

export function RegisterGuestUserForm() {
  const router = useStore($router);
  const guestCode = useStore($guestCode);
  const search = parseRouterSearch(router);
  const guestFromSearch = search.guest;
  const isValidGuest = !!(
    guestFromSearch && guestFromSearch.code === guestCode
  );

  // test:
  // {"email": "ben@theadpharm.com","code": "guest", "first_name":"Ben","last_name":"Honda"}
  // %7B%22email%22%3A%20%22ben%40theadpharm.com%22%2C%22code%22%3A%20%22guest%22%2C%20%22first_name%22%3A%22Ben%22%2C%22last_name%22%3A%22Honda%22%7D
  // {"email": "ben@theadpharm.com","code": "guest"}
  // %7B%22email%22%3A%20%22ben%40theadpharm.com%22%2C%22code%22%3A%20%22guest%22%7D

  // form
  const form = useForm<z.infer<typeof createGuestUserSchema>>({
    resolver: zodResolver(createGuestUserSchema),
    defaultValues: {
      username: "",
    },
  });

  // submit
  const onSubmit = form.handleSubmit(
    async (inputData) => {
      // create the anonymous user
      const { data, error } =
        await actions.user.createGuestUserAndSignIn(inputData);

      // if there's an error, show it
      if (error) {
        return form.setError("root", { message: error.message });
      }

      // create a new plinko game and navigate to the game
      await newPlinkoGame();
    },
    (err) => logError("RHF Error", err),
  );

  // useEffect to set the email from the search params
  useEffect(() => {
    logDebug("useEffect to set the user details from the search params");
    if (guestFromSearch && isValidGuest) {
      form.setValue("email", guestFromSearch.email);
      if (guestFromSearch.first_name)
        form.setValue("firstName", guestFromSearch.first_name);
      if (guestFromSearch.last_name)
        form.setValue("lastName", guestFromSearch.last_name);
    }
  }, [guestFromSearch, isValidGuest]);

  // random username generator
  const randomUsername = () => {
    form.setValue("username", generateRandomUsername());
  };

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

              <button
                type="button"
                onClick={randomUsername}
                className="text-sm font-medium inline-flex items-center active:opacity-75"
              >
                <span>Randomize</span>
                <RefreshCcw className="size-3.5 ml-1" />
              </button>

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
          {form.formState.isSubmitting ? "Submitting..." : "Let's play 🎉"}
        </Button>

        {form.formState.errors.root && (
          <div className="text-red-500 dark:text-red-300">
            {form.formState.errors.root.message}
          </div>
        )}
      </form>
    </Form>
  );
}
