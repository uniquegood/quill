import Picker from './picker';

class ColorPicker extends Picker {
  constructor(select, label, quill) {
    super(select);
    this.quill = quill;
    this.label.innerHTML = label;
    this.container.classList.add('ql-color-picker');
    [].slice
      .call(this.container.querySelectorAll('.ql-picker-item'), 0, 7)
      .forEach(function (item) {
        item.classList.add('ql-primary');
      });
  }

  buildItem(option) {
    let item = super.buildItem(option);
    item.style.backgroundColor = option.getAttribute('value') || '';
    return item;
  }

  selectItem(item, trigger) {
    super.selectItem(item, trigger);

    const svgShapes = this.label.querySelectorAll('.ql-stroke');
    const value =
      (item && item.getAttribute('data-value')) ||
      (() => {
        if (this.quill) {
          let range = this.quill.getSelection();
          let formats = range ? this.quill.getFormat(range) : {};
          const { color } = formats;
          return color;
        }
      })();

    if (!value) {
      for (const svgShape of svgShapes) {
        if (svgShape) {
          svgShape.style = {};
        }
      }
      return;
    }

    for (const svgShape of svgShapes) {
      if (svgShape) {
        svgShape.style.stroke = value;
      }
    }
  }
}

export default ColorPicker;
