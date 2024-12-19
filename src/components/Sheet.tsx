import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Menu } from "lucide-react";
import { useRef } from "react";

export function MenuSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent className="bg-black border-l-zinc-800">
        <SheetHeader className="">
          <SheetTitle>
            <img
              src="/adpharm-logo@4x.png"
              alt="the adpharm"
              className="w-36 mt-2"
            />
          </SheetTitle>
        </SheetHeader>
        <div
          id="main"
          className="flex flex-col justify-center items-start space-y-4 w-full pt-10 font-extralight text-lg animate-fade-in-quick"
        >
          <button
            id="brands-btn"
            className="flex flex-row justify-center items-center"
            onClick={() => {
              const brandsDiv = document.getElementById("brands");
              const mainMenu = document.getElementById("main");

              console.log("Clicked", brandsDiv);

              mainMenu?.classList.remove("flex");
              mainMenu?.classList.add("hidden");

              brandsDiv?.classList.remove("animate-slide-out-to-right");
              brandsDiv?.classList.add("animate-slide-in-from-right");
              brandsDiv?.classList.remove("hidden");
              brandsDiv?.classList.add("flex");
            }}
          >
            Our Brands <ChevronRight className="ml-2" />
          </button>
          <a href="/about">About</a>
          <a href="/clients">Clients</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
        </div>
        <div
          id="brands"
          className="hidden flex-col justify-center items-start space-y-4 w-full pt-10 font-extralight text-lg"
        >
          <button
            id="brands-btn"
            className="flex flex-row justify-center items-center"
            onClick={() => {
              const brandsDiv = document.getElementById("brands");
              const mainMenu = document.getElementById("main");

              console.log("Clicked", brandsDiv);

              brandsDiv?.classList.remove("animate-slide-in-from-right");
              brandsDiv?.classList.add("animate-slide-out-to-right");
              brandsDiv?.classList.remove("flex");
              brandsDiv?.classList.add("hidden");

              mainMenu?.classList.remove("hidden");
              mainMenu?.classList.add("flex");
            }}
          >
            <ChevronLeft className="mr-2" />
            Back
          </button>
          <a href="/">The Adpharm</a>
          <a href="/digital">Adpharm Digital</a>
          <a href="/synapse">Synapse Medcom</a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
