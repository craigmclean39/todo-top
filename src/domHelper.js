// eslint-disable-next-line import/prefer-default-export
export class DomHelper {
  static CreateElement(selector, classNames) {
    // eslint-disable-next-line no-undef
    const element = document.createElement(selector);
    if (classNames !== undefined) {
      for (let i = 0; i < classNames.length; i++) {
        element.classList.add(classNames[i]);
      }
    }
    return element;
  }
}
