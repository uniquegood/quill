import Picker from './picker';

class ColorPicker extends Picker {
  constructor(select, label, quill, format) {
    super(select);
    this.quill = quill;
    this.format = format;
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

    const selectors = {
      color: '.ql-stroke',
      background: '.ql-fill > rect',
    };

    const svgShapes = this.label.querySelectorAll(selectors[this.format]);
    const value =
      (item && item.getAttribute('data-value')) ||
      (() => {
        if (this.quill) {
          let range = this.quill.getSelection();
          let formats = range ? this.quill.getFormat(range) : {};

          const { color, background } = formats;

          if (this.format === 'color') return color;
          return background;
        }
      })();

    if (this.format === 'background') {
      this.label.querySelector('svg').style.backgroundColor =
        value || 'initial';
    }

    if (!value) {
      for (const svgShape of svgShapes) {
        if (svgShape) {
          svgShape.style = {};
        }
      }
      return;
    }

    const calculateStrokeColor = {
      color: () => {
        const [r, g, b] = hexToRgb(value);
        const isCloseToBrightColor = (r + g + b) / 3 > 127;

        return isCloseToBrightColor ? '#000' : '#fff';
      },
      background: () => value,
    };

    for (const svgShape of svgShapes) {
      if (svgShape) {
        svgShape.style.stroke = calculateStrokeColor[this.format]();
      }
    }
  }
}

function hexToRgb(hex) {
  return hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => `#${r + r + g + g + b + b}`
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
}

export default ColorPicker;
