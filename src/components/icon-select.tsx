import type { VariantProps } from "class-variance-authority";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { buttonVariants } from "./ui/button";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const icons = [
  "avatar-1",
  "avatar-2",
  "avatar-3",
  "avatar-4",
  "avatar-5",
  "avatar-6",
  "avatar-7",
  "avatar-8",
  "avatar-9",
  "avatar-10",
  "avatar-11",
  "avatar-12",
  "avatar-13",
  "avatar-14",
  "avatar-15",
  "avatar-16",
  "avatar-17",
  "avatar-18",
  "avatar-19",
  "avatar-20",
];

export const IconSelectButton = ({
  children,
  onSelectIcon,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    onSelectIcon: (icon: string) => void;
  }) => {
  const handleSelectIcon = (icon: string) => {
    onSelectIcon(`/icons/${icon}.png`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button {...props}>{children}</Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-1/3 space-y-2">
        <p className="text-muted-foreground text-base">Icons</p>
        <div className="grid grid-cols-4 gap-2 place-items-center">
          {icons.map((icon) => (
            <Button
              key={icon}
              variant="ghost"
              size="icon"
              className="size-min rounded-full"
              onClick={() => handleSelectIcon(icon)}
            >
              <Avatar className="size-12">
                <AvatarImage src={`/icons/${icon}.png`} />
                <AvatarFallback>{icon}</AvatarFallback>
              </Avatar>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
