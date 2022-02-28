import $ from 'jquery';

export function $$(type, classes = '', props = {}) {
  const {content, ...otherProps} = props;
  if (classes instanceof Array) {
    classes = classes.join(' ');
  }
  const attrs = classes ? {class: classes, ...otherProps} : otherProps;
  const attrsString = Object.entries(attrs)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join(' ');
  return $(
    `<${type}${attrsString ? ` ${attrsString}` : ''}>${
      content ? content : ''
    }</${type}>`
  );
}

export const toOptions = (values = []) =>
  values.map(([key, text]) => $(`<option value="${key}"}>${text}</option>`));
