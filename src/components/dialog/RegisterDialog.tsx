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

        {/* Form */}
        <RegisterGuestUserForm gameType="plinko"/>
      </DialogContent>
    </Dialog>
  );
}


export function RegisterGuestUserDialog21Questions({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent dismissable={false} winter>
        <DialogHeader className="border-b border-sky-900/30 pb-4">
          <DialogTitle className="text-center text-red-400">
            Pick a username and let's play!
          </DialogTitle>
          <DialogDescription className="text-center">
            Before starting the game, pick a festive username to join the fun!

          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <RegisterGuestUserForm gameType="21Questions"/>
      </DialogContent>
    </Dialog>
  );
}
