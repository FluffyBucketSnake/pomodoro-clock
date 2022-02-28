import $ from 'jquery';

export function $$(type, classes = '', props = {}) {
  if (classes instanceof Array) {
    classes = classes.join(' ');
  }
  const attrs = classes ? {class: classes, ...props} : props;
  const attrsString = Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return $(`<${type}${attrsString ? ` ${attrsString}` : ''}></${type}>`);
}

export const toOptions = (values = []) =>
  values.map(([key, text]) => $(`<option value="${key}"}>${text}</option>`));
