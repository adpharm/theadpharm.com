import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { log, logDebug } from "@/lib/utils.logger";
import { $guestCode } from "@/lib/stores";
import { newPlinkoGame } from "@/lib/client/newPlinkoGame";
import { RefreshCcw } from "lucide-react";

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters",
    })
    .max(50, {
      message: "Username must be less than 50 characters",
    }),
  email: z.string().email({ message: "Please double-check your email" }),
  // password: z.string().min(6),
});

export function AuthDialog({ open }: { open: boolean }) {
  const router = useStore($router);
  const guestCode = useStore($guestCode);
  const search = parseRouterSearch(router);
  logDebug("search", search);
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      // password: "",
    },
  });

  // submit
  const onSubmit = form.handleSubmit(
    async (inputData) => {
      console.log(inputData);

      // create the anonymous user
      const { data, error } = await actions.signUpAndSignInAnonUser(inputData);

      if (error) {
        form.setError("root", {
          message: error.message,
        });
        return;
      }

      // create a new plinko game
      await newPlinkoGame();
    },
    (err) => console.error("RHF Error", err),
  );

  // useEffect to set the email from the search params
  useEffect(() => {
    logDebug("useEffect to set the email from the search params");
    if (guestFromSearch && isValidGuest) {
      form.setValue("email", guestFromSearch.email);
    }
  }, [guestFromSearch, isValidGuest]);

  // random username generator
  const randomUsername = () => {
    form.setValue("username", generateRandomUsername());
  };

  return (
    <Dialog open={open}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent dismissable={false}>
        <DialogHeader>
          <DialogTitle>Welcome to The Adpharm's Xmas Plinko!</DialogTitle>
          <DialogDescription>
            Try your luck and win some prizes!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-8">
            {/***************************************************
             *
             * Email
             *
             ****************************************************/}

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem
                  className={
                    // show on email error, just as a fallback
                    fieldState.error ? "" : isValidGuest ? "hidden" : ""
                  }
                >
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>

                  {/* <FormDescription>
                    This field was pre-filled for you from the link we sent to
                    your email.
                  </FormDescription> */}

                  <FormMessage />
                </FormItem>
              )}
            />

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

                  {/* <FormDescription>This field is optional.</FormDescription> */}
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
              {form.formState.isSubmitting ? "Submitting..." : "Let's Play! 🎉"}
            </Button>

            {form.formState.errors.root && (
              <div className="text-red-500 dark:text-red-300">
                {form.formState.errors.root.message}
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
