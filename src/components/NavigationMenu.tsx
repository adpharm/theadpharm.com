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
import type { NavItem } from "@/lib/types.nav";
import { $router } from "@/lib/stores/router";
import { useStore } from "@nanostores/react";

export function MainNavigation({
  items,
  currentPath,
}: {
  items: NavItem[];
  currentPath: string;
}) {
  const router = useStore($router);
  const pathname = router?.path ?? currentPath;

  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        {items.map((item, i) => {
          const isActive = pathname === item.href;

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
                        const childActive = pathname === child.href;
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
