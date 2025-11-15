import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarPrimitive,
} from "@/components/ui/avatar";

export default function Avatar(props: {
  value: string;
  avatar?: string | null;
}) {
  const { value, avatar } = props;

  const initials = value
    .split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <AvatarPrimitive className="size-8">
      <AvatarImage src={avatar ?? undefined} />
      <AvatarFallback className="border bg-accent/50 uppercase">
        {initials}
      </AvatarFallback>
    </AvatarPrimitive>
  );
}
