import { type AnchorHTMLAttributes, type MouseEventHandler } from "react";
import { $router } from "./router";

export const Link = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        const href = (e.target as HTMLAnchorElement).href;
        $router.open(new URL(href).pathname);
      }}
      {...props}
    />
  );
};
