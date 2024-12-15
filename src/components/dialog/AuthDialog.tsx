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

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  // password: z.string().min(6),
});

export function AuthDialog({ open }: { open: boolean }) {
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
        // TODO: pass error to UI
        console.error("Error signing up", error);
        return;
      }

      // create a new plinko game
      const { data: newPlinkoData, error: newPlinkoError } =
        await actions.newPlinko({});

      if (newPlinkoError) {
        // TODO: pass error to UI
        console.error("Error creating plinko game", newPlinkoError);
        return;
      }
    },
    (err) => console.error("RHF Error", err),
  );

  // random username generator
  const randomUsername = () => {
    form.setValue("username", generateRandomUsername());
  };

  return (
    <Dialog open={open}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>

                  <FormDescription>
                    This field was pre-filled for you from the link we sent to
                    your email.
                  </FormDescription>

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
                  <Button
                    type="button"
                    onClick={randomUsername}
                    variant={"link"}
                  >
                    Randomize
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
            <Button type="submit">Let's Play! 🎉</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
