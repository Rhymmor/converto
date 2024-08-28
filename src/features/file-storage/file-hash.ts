import { createMD5 } from "hash-wasm";
import type { IHasher } from "hash-wasm/dist/lib/WASMInterface";

const chunkSize = 64 * 1024 * 1024;
const fileReader = new FileReader();

let hasher: IHasher | null = null;

export async function md5(file: File): Promise<string> {
  if (hasher) {
    hasher.init();
  } else {
    hasher = await createMD5();
  }

  const chunkNumber = Math.floor(file.size / chunkSize);

  for (let i = 0; i <= chunkNumber; i++) {
    const chunk = file.slice(chunkSize * i, Math.min(chunkSize * (i + 1), file.size));
    await hashChunk(chunk);
  }

  const hash = hasher.digest();
  return Promise.resolve(hash);
}

function hashChunk(chunk: Blob) {
  return new Promise<void>((resolve, reject) => {
    fileReader.onload = async e => {
      const buffer = e.target?.result;

      if (!buffer) {
        return reject(new Error("No event target buffer chunk"));
      }

      if (typeof buffer === "string") {
        return reject(new Error("Buffer is a string"));
      }

      if (!hasher) {
        return reject(new Error("Hasher is not initialized"));
      }

      const view = new Uint8Array(buffer);
      hasher.update(view);
      resolve();
    };

    fileReader.readAsArrayBuffer(chunk);
  });
}
