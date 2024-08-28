const DB_NAME = "FileStore";
const DB_VERSION = 1;

interface IDbObject {
  name: string;
  blob: File;
}

export class FileStore {
  private db: IDBDatabase | null = null;

  async init() {
    if (this.db === null) {
      this.db = await this._wrapReq(indexedDB.open(DB_NAME, DB_VERSION), event => {
        const db: IDBDatabase = (event.target as any).result;
        db.createObjectStore("files", { keyPath: "name" });
        /* no index needed for such a small database */
      });
    }
  }

  async hasFile(name: string) {
    const obj = await this._wrapReq<IDbObject | undefined>(
      this.requiredDb.transaction("files").objectStore("files").get(name)
    );

    return obj !== undefined;
  }

  async saveFile(name: string, file: File) {
    this.requiredDb
      .transaction(["files"], "readwrite")
      .objectStore("files")
      .add({
        name,
        blob: file,
      } satisfies IDbObject);
  }

  async loadFile(name: string) {
    try {
      const obj = await this._wrapReq<IDbObject | undefined>(
        this.requiredDb.transaction("files").objectStore("files").get(name)
      );
      return obj?.blob;
    } catch (error) {
      console.error("Cannot load file", error);
      return null;
    }
  }

  async close() {
    if (this.db) {
      this.db.close();
    }
  }

  private get requiredDb() {
    if (this.db === null) {
      throw new Error("BlobStore not initialized");
    }
    return this.db;
  }

  private async _wrapReq<T>(
    request: IDBRequest,
    onUpgrade: ((event: IDBVersionChangeEvent) => void) | null = null
  ) {
    return new Promise<T>((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      // eslint-disable-next-line unicorn/prefer-add-event-listener
      request.onerror = event => {
        reject(event);
      };

      if (onUpgrade !== null) {
        (request as IDBOpenDBRequest).addEventListener("upgradeneeded", onUpgrade);
      }
    });
  }
}

let fileStore: FileStore | undefined;

export async function getFileStore() {
  if (!fileStore) {
    fileStore = new FileStore();
  }

  await fileStore.init();
  return fileStore;
}
