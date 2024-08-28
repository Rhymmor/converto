import { required } from "./nullability";

export function getObjectUrlId(objectUrl: string): string {
  return required(objectUrl.split("/").pop(), "Object URL ID");
}

export function createObjectUrlFromId(objectId: string): string {
  return `blob:${window.location.origin}/${objectId}`;
}
