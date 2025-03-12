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
import {
  generateRandomUsernameFromName,
} from "@/lib/generateRandomUsername";
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
import { createGuestUser21QuestionsSchema, createGuestUserSchema } from "@/lib/zod.schema";
import { new21QuestionsGame } from "@/lib/client/new21QuestionsGame";
import type { gameType } from "@/lib/types.christmasGames";

interface RegisterGuestUserFormProps {
  gameType: gameType;
}

export function RegisterGuestUserForm({ gameType }: RegisterGuestUserFormProps) {
  const router = useStore($router);
  const guestCode = useStore($guestCode);
  const search = parseRouterSearch(router);
  const guestFromSearch = search.guest;
  const isValidGuest = !!(
    guestFromSearch && guestFromSearch.code === guestCode
  );

  logDebug("guestFromSearch", guestFromSearch);

  // test:
  // {"email": "ben@theadpharm.com","code": "guest", "first_name":"Ben","last_name":"Honda"}
  // %7B%22email%22%3A%20%22ben%40theadpharm.com%22%2C%22code%22%3A%20%22guest%22%2C%20%22first_name%22%3A%22Ben%22%2C%22last_name%22%3A%22Honda%22%7D
  // {"email": "ben@theadpharm.com","code": "guest"}
  // %7B%22email%22%3A%20%22ben%40theadpharm.com%22%2C%22code%22%3A%20%22guest%22%7D

  // form
  const form = useForm<z.infer<typeof createGuestUserSchema>>({
    resolver: zodResolver(createGuestUserSchema),
    defaultValues: {
      username: generateRandomUsernameFromName(guestFromSearch?.first_name),
      numberOfGamesPlayed: 0, // Default value for numberOfGamesPlayed
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

      // create a new plinko game and navigate to the game OR create the 21 questions game
      { gameType === "plinko" ? await newPlinkoGame() : await new21QuestionsGame() }
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
    form.setValue(
      "username",
      generateRandomUsernameFromName(guestFromSearch?.first_name),
    );
  };

  return (
    <>
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
                <FormDescription className="text-xs">
                  Pick a username using the "Randomize" button.
                </FormDescription>

                <FormControl>
                  <Input
                    {...field}
                    disabled
                    className="py-7 pointer-events-none disabled:opacity-100"
                  />
                </FormControl>

                <Button
                  type="button"
                  onClick={randomUsername}
                  // className="text-sm font-medium inline-flex items-center active:opacity-75"
                  variant={"secondaryWinter"}
                >
                  <span>Randomize</span>
                  <RefreshCcw className="size-3.5 ml-1" />
                </Button>

                <FormMessage />
              </FormItem>
            )}
          />

          {/***************************************************
           *
           * Submit
           *
           ****************************************************/}
          <Button type="submit" variant={"primaryWinter"}>
            {form.formState.isSubmitting ? "Submitting..." : "Let's play 🎉"}
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
          {/* TODO: re-enable this after some testing */}
          {/* <div className="">
            <div className="text-center">
              <Separator className="bg-sky-900/30" />
            </div>

            <FormDescription className="py-6 text-center">
              Want to save your progress? Sign in or sign up.
            </FormDescription>

            <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant="secondaryWinter" asChild>
                <a href={getPagePath($router, "login")}>Sign in</a>
              </Button>

              <Button type="button" variant="secondaryWinter" asChild>
                <a href={getPagePath($router, "register")}>Sign up</a>
              </Button>
            </div>
          </div> */}
        </form>
      </Form>
    </>
  );
}