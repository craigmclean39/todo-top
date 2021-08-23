/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
export class LocalStorageHelper {
  constructor() {
    if (typeof Storage !== 'undefined') {
      this._storageAvailable = true;
    } else {
      this._storageAvailable = false;
    }
  }

  SaveItem(key, objectToSave) {
    if (!this._storageAvailable) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(objectToSave));
  }

  ClearItems() {
    if (!this._storageAvailable) {
      return;
    }

    window.localStorage.clear();
  }

  RetrieveItem(key) {
    if (!this._storageAvailable) {
      return undefined;
    }

    return window.localStorage.getItem(key);
  }

  RemoveItem(key) {
    if (!this._storageAvailable) {
      return;
    }

    window.localStorage.removeItem(key);
  }
}
