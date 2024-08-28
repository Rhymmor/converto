import { atom, computed } from "nanostores";
import { createObjectUrlFromId } from "../../utils/object-url";

export const $resultBlobUrlId = atom<string | null>(null);
export const $resultBlobUrl = computed($resultBlobUrlId, objectId =>
  objectId ? createObjectUrlFromId(objectId) : null
);

export const $resultPercents = atom<number>(0);
export const $resultInProgress = atom<boolean>(false);
