"use client";

import Avvvatars from "avvvatars-react";
import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarPrimitive,
} from "@/components/ui/avatar";

export default function Avatar({
  value,
  avatar,
}: {
  value: string;
  avatar?: string | null;
}) {
  return (
    <AvatarPrimitive className="size-8">
      <AvatarImage className="size-full" src={avatar ?? undefined} />
      <AvatarFallback>
        <Avvvatars size={32} style="shape" value={value} />
      </AvatarFallback>
    </AvatarPrimitive>
  );
}
