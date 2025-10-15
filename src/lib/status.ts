import { type Status } from "@/lib";

export function getStatusDotClass(status: Status): string {
  switch (status) {
    case "healthy":
      return "bg-primary";
    case "lag":
      return "bg-yellow-500";
    case "error":
      return "bg-red-500";
  }
}

export function getStatusTextClass(status: Status): string {
  switch (status) {
    case "healthy":
      return "text-primary";
    case "lag":
      return "text-yellow-600";
    case "error":
      return "text-red-600";
  }
}

export function getStatusBorderClass(status: Status): string {
  switch (status) {
    case "healthy":
      return "border-green-200";
    case "lag":
      return "border-yellow-200";
    case "error":
      return "border-red-200";
  }
}

export function getStatusLabel(status: Status): string {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "lag":
      return "Lagging";
    case "error":
      return "Error";
  }
}
