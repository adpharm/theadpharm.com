import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RegisterFullUserForm } from "../form/RegisterFullUserForm";
import { RegisterGuestUserForm } from "../form/RegisterGuestUserForm";
import { Separator } from "../ui/separator";

export function RegisterFullUserDialog({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent dismissable={false}>
        <DialogHeader>
          <DialogTitle>Create your Adpharm Games account.</DialogTitle>
          <DialogDescription>
            Please fill in the form below to create your account.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <RegisterFullUserForm />
      </DialogContent>
    </Dialog>
  );
}

export function RegisterGuestUserDialog({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent dismissable={false} winter>
        <DialogHeader className="border-b border-sky-900/30 pb-4">
          <DialogTitle className="text-center text-red-400">
            Pick a username and let's play!
            {/* 🎁 It's the season of giving! 🎁 */}
          </DialogTitle>
          <DialogDescription className="text-center">
            Every play contributes toward our donation goal. At the end of the
            holiday season, we'll share the list of everyone who joined in to
            help our community. Let's do this!
          </DialogDescription>
        </DialogHeader>
        {/* <p>Here's how to get started:</p>
        <ol className="list-decimal list-inside pl-4">
          <li>Play our Holiday Plinko game</li>
          <li>Climb the Leaderboard</li>
          <li>Make a Difference</li>
        </ol> */}

        {/* <p className="text-center text-red-400 text-lg font-medium">
          Pick a username and let's play!
        </p> */}

        {/* <Separator className="bg-sky-900/30" /> */}

        {/* Form */}
        <RegisterGuestUserForm />
      </DialogContent>
    </Dialog>
  );
}
