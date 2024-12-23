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
import { logDebug } from "@/lib/utils.logger";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function MainNavigation({
  items,
  currentPath,
}: {
  items: NavItem[];
  currentPath: string;
}) {
  const router = useStore($router);
  const [activePathName, setActivePathName] = useState(currentPath);

  logDebug(activePathName);

  useEffect(() => {
    logDebug("use effect to set active path name");
    if (router?.path) setActivePathName(router.path);
  }, [router?.path]);

  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        {items.map((item, i) => {
          const isActive = activePathName === item.href;

          return (
            <NavigationMenuItem
              className="tracking-wider"
              key={`${item.label}-nav-item-1`}
            >
              {item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger
                    className={cn(
                      "tracking-wider font-light text-md",
                      item.children.some(
                        (child) => activePathName === child.href,
                      )
                        ? "text-white"
                        : "text-gray-500 hover:text-white",
                    )}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="p-4 grid gap-2">
                      {item.children.map((child, j) => {
                        const childActive = activePathName === child.href;
                        return (
                          <li key={`${child.label}-nav-item`}>
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
                  className={`tracking-wider font-light mx-6 ${
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
