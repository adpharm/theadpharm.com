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
          <DialogTitle className="text-center">
            Pick a username and let's play!
          </DialogTitle>
          {/* <DialogDescription className="text-center">
            
          </DialogDescription> */}
        </DialogHeader>

        {/* Form */}
        <RegisterGuestUserForm />
      </DialogContent>
    </Dialog>
  );
}
