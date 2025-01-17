import type React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

function LookingForMoreFunGames() {
  return (
    <div className="grid pt-4 gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <div className="space-y-4">
        <WarningDialog href="https://theadpharm.com/digital/21Questions">
          <img src="/21QuestionsCard.webp" className="" />
          <p className="pt-2 font-medium">
            Play 21 Questions against the AI (Holiday Edition)
          </p>
        </WarningDialog>
      </div>
      <div className="space-y-4">
        <WarningDialog href="https://theadpharm.com/digital/plinko">
          <img src="/plinkoCard.webp" className="" />
          <p className="pt-2 font-medium">Holiday Plinko</p>
        </WarningDialog>
      </div>
    </div>
  );
}

export default LookingForMoreFunGames;

function WarningDialog({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger className="text-left">{children}</DialogTrigger>
      <DialogContent className="" winter>
        <DialogHeader>
          <DialogTitle>
            We're taking you theadpharm.com to play this game.
          </DialogTitle>
          <DialogDescription>
            This game is hosted on the site of our sister company, The Adpharm.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <DialogClose asChild>
            <Button variant={"secondaryWinter"}>Cancel</Button>
          </DialogClose>
          <Button asChild variant={"primaryWinter"}>
            <a href={href} target="_blank">
              Let's go!
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
