import { persistentAtom } from "@nanostores/persistent";
import { atom, computed } from "nanostores";
import { getFileStore } from "../features/file-storage/file-store";
import { createObjectUrlFromId, getObjectUrlId } from "../utils/object-url";

export const $currentFileHash = persistentAtom<string | undefined>("video-hash");

export const $currentBlobUrlId = atom<string | null>(null);
export const $currentBlobUrl = computed($currentBlobUrlId, objectId =>
  objectId ? createObjectUrlFromId(objectId) : null
);

$currentFileHash.subscribe(async fileHash => {
  if (!fileHash) {
    return;
  }

  const store = await getFileStore();
  const blob = await store.loadFile(fileHash);
  if (blob) {
    const blobUrl = URL.createObjectURL(blob);
    $currentBlobUrlId.set(getObjectUrlId(blobUrl));
  }
});
