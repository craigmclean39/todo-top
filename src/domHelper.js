// eslint-disable-next-line import/prefer-default-export
export class DomHelper {
  constructor() {}

  static CreateElement(selector, classNames) {
    const element = document.createElement(selector);
    if (classNames !== undefined) {
      for (let i = 0; i < classNames.length; i++) {
        element.classList.add(classNames[i]);
      }
    }
    return element;
  }
}
