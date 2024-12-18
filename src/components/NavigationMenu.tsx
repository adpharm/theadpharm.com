import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import type { string } from "astro:schema";

interface NavigationItem {
  label: string;
  href?: string;
  children?: NavigationItem[];
}

interface NavigationProps {
  items: NavigationItem[];
  currentPath: string;
}

export function MainNavigation({ items, currentPath }: NavigationProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item, i) => {
          const isActive = currentPath === item.href;

          return (
            <NavigationMenuItem className="tracking-wider" key={i}>
              {item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger className="tracking-wider font-extralight text-md">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="p-4 grid gap-2">
                      {item.children.map((child, j) => {
                        const childActive = currentPath === child.href;
                        return (
                          <li key={j}>
                            <NavigationMenuLink
                              className={
                                childActive
                                  ? "text-white tracking-wider"
                                  : "text-gray-500 hover:text-white tracking-wider"
                              }
                              asChild
                            >
                              <a href={child.href}>{child.label}</a>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  className={`tracking-wider font-extralight mx-6 ${
                    isActive ? "text-white" : "text-gray-500 hover:text-white"
                  }`}
                  asChild
                >
                  <a href={item.href}>{item.label}</a>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}
