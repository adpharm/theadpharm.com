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

interface NavigationItem {
  label: string;
  href?: string;
  children?: NavigationItem[];
}

interface NavigationProps {
  items: NavigationItem[];
}

export function MainNavigation({ items }: NavigationProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item, i) => (
          <NavigationMenuItem key={i}>
            {item.children && item.children.length > 0 ? (
              <>
                <NavigationMenuTrigger className="font-medium text-md">
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="p-4 grid gap-2">
                    {item.children.map((child, j) => (
                      <li key={j}>
                        <NavigationMenuLink
                          className="text-sm hover:underline"
                          asChild
                        >
                          <a href={child.href}>{child.label}</a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink className="font-medium mx-6" asChild>
                <a href={item.href}>{item.label}</a>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}
