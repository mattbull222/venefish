import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function RecentRounds() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Patterson River Golf Course</p>
          <p className="text-sm text-muted-foreground">
          01/01/2024
          </p>
        </div>
        <div className="ml-auto font-medium">9:00A.M.</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sandhurst Golf Club</p>
          <p className="text-sm text-muted-foreground">01/01/2024</p>
        </div>
        <div className="ml-auto font-medium">7:00A.M.</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Patterson River Golf Course</p>
          <p className="text-sm text-muted-foreground">
          01/01/2024
          </p>
        </div>
        <div className="ml-auto font-medium">9:00A.M.</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sandhurst Golf Club</p>
          <p className="text-sm text-muted-foreground">01/01/2024</p>
        </div>
        <div className="ml-auto font-medium">9:00A.M.</div>
      </div>
    </div>
  )
}
