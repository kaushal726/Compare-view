// import Konva from "konva";
import { getTemplate } from "./compare-view.template.js";
// import Konva from "konva";
function define(o) {
  class compareEl extends HTMLElement {

    constructor() {
      super();
      let template = getTemplate(o);
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.layer;
      this.layer2;
      this.stage;
      this.position;
      this.width;
      this.height;
      this.image1;
      this.image2;
    }

    handleInput = (e) => {
      let currpos = e.target.value;
      console.log(currpos);
      this.layer2.clip({
        x: 0,
        y: 0,
        height: this.height,
        width: currpos,
      })
    }
    konvaLoad() {
      this.stage = new Konva.Stage({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        container: this.domRefs.container
      })

      this.layer = new Konva.Layer();
      this.layer2 = new Konva.Layer();
      this.stage.add(this.layer);
      this.stage.add(this.layer2);
    }

    async loadImage(img, layer, width, height, callback) {

      let imageObj = new Image();
      imageObj.src = img;
      let bitMap = await createImageBitmap(imageObj);
      // console.log({ bitMap });

      let fimg = new Konva.Image({
        x: 0,
        y: 0,
        image: bitMap,
        width: width,
        height: height,
      });
      layer.add(fimg);
      callback(this.geometry);
    }

    clipInitial(layer, position) {
      layer.clip({
        x: 0,
        y: 0,
        height: this.height,
        width: position,
      })
    }
    setPosition(position) {
      this.domRefs.input.value = position;
      console.log(this.domRefs.input.value);
    }
    setSliderWH(width, height) {
      console.log("width = " + width, "height = " + height);
      this.domRefs.input.style.width = `${width}px`;
      this.domRefs.input.style.height = `${height}px`;
    }
    setPositionValue(position, width) {
      if (position == "")
        this.position = 0.5 * width;
      else
        this.position = (position / 100) * width;
    }

    setDefaultHeightWidth(height, width) {
      if (height == "" && width == "") {
        this.width = 1400;
        this.height = 850;
      }
      else if (height == "") this.height = (width / 1.334);
      else if (width == "") this.width = (1.334 * height);
    }
    setSliderMaxValue(width) {
      this.domRefs.input.max = width;
    }
    setImage() {
      this.image1 = this.domRefs.cvSlotA.assignedElements()[0].src;
      this.image2 = this.domRefs.cvSlotB.assignedElements()[0].src;
    }

    getDomRefs() {
      const domRefs = {
        container: this.shadowRoot.querySelector("#compare_view_container"),
        input: this.shadowRoot.querySelector("#compare_view_slider"),
        cvSlotA: this.shadowRoot.querySelector("#compare_view_slot_after"),
        cvSlotB: this.shadowRoot.querySelector('#compare_view_slot_before'),
      }
      return domRefs;
    }

    drawLine(obj) {
      let x = obj.shape_attributes.all_point_x;
      let y = obj.shape_attributes.all_point_y;
      let merArray = x.map((element, index) => [element, y[index]]).flat();
      let polygonlayer = new Konva.Line({
        points: merArray,
        stroke: 'red',
        strokeWidth: 3,
        lineCap: 'round',
        lineJoin:'round'
      });
      if (obj.side == "left") {
        this.layer2.add(polygonlayer)
        this.layer2.draw();
      }
      else {
        this.layer.add(polygonlayer)
        this.layer.draw();
      }
    }
    drawPoint(obj) {
      let polygonlayer = new Konva.Line({
        points: [obj.shape_attributes.x,obj.shape_attributes.y],
        stroke: 'black',
        strokeWidth: 300,
        closed: true,
        strokeWidth: 30,
      });
      if (obj.side == "left") {
        this.layer2.add(polygonlayer)
        this.layer2.draw();
      }
      else {
        this.layer.add(polygonlayer)
        this.layer.draw();
      }
    }
    drawRect(obj) {
      console.log('rect');
    }
    drawPoly(obj) {
      let x = obj.shape_attributes.all_point_x;
      let y = obj.shape_attributes.all_point_y;
      let merArray = x.map((element, index) => [element, y[index]]).flat();
      let polygonlayer = new Konva.Line({
        points: merArray,
        stroke: 'black',
        strokeWidth: 3,
        closed: true,
      })
      if (obj.side == "left") {
        this.layer2.add(polygonlayer)
        this.layer2.draw();
      }
      else {
        this.layer.add(polygonlayer)
        this.layer.draw();
      }
    }

    drawRegion(arr) {
      arr.forEach(obj => {
        switch (obj.shape_attributes.name) {
          case 'polygon':
            this.drawPoly(obj);
            break;
          case 'rect':
            this.drawRect(obj);
            break;
          case 'polyline':
            this.drawLine(obj);
            break;
          case 'point':
            this.drawPoint(obj);
            break;
          default: break;
        }
      })

    }



    connectedCallback() {
      this.position = isNaN(this.getAttribute('position')) ? 50 : this.getAttribute('position');
      this.width = isNaN(this.getAttribute('width')) ? 1400 : this.getAttribute('width');
      this.height = isNaN(this.getAttribute('height')) ? 900 : this.getAttribute('height');
      this.domRefs = this.getDomRefs();
      this.setImage();
      this.setDefaultHeightWidth(this.height, this.width);
      this.setSliderMaxValue(this.width);
      this.setPositionValue(this.position, this.width);
      this.setSliderWH(this.width, this.height);
      this.setPosition(this.position);
      this.konvaLoad();
      this.geometry = [
        {
          region_attributes: {
            label: "",
            layer: "",
          },
          shape_attributes: {
            all_point_x: [12, 34, 56, 78, 90,200],
            all_point_y: [23, 45, 67, 89, 98,600],
            id: 0,
            name: "polygon",
          },
          side: "left"
        },
        {
          region_attributes: {
            label: "",
            layer: "",
          },
          shape_attributes: {
            height: 123,
            id: 0,
            name: "rect",
            width: 244,
            x: 1234,
            y: 2,
          },
          side: "left"
        },
        {
          region_attributes: {
            label: "",
            layer: "",
          },
          shape_attributes: {
            id: 0,
            name: "point",
            x: 62,
            y: 53,
          },
          side: "left"
        },
        {
          region_attributes: {
            label: "",
            layer: "",
          },
          shape_attributes: {
            all_point_x: [12,34,56,78],
            all_point_y: [54,43,32,21],
            id: 0,
            name: "polyline",
          },
          side: "left"
        }, {
          region_attributes: {
            label: "",
            layer: "",
          },
          shape_attributes: {
            all_point_x: [67,89,87,65,80,100],
            all_point_y: [34,56,78,90,100,120],
            id: 0,
            name: "polyline",
          },
          side: "left"
        },
      ];
      this.loadImage(this.image2, this.layer, this.width, this.height, this.drawRegion.bind(this));
      this.loadImage(this.image1, this.layer2, this.width, this.height, this.drawRegion.bind(this));
      this.clipInitial(this.layer2, this.position);
      this.domRefs.input.addEventListener('input', this.handleInput.bind(this));
      console.log("Slot = " + this.children[0].slot);
    }
  }
  return compareEl;
}

class CompareView {
  constructor(options) {
    this.options = options;
  }
  init() {
    let name = this.options.name;
    window.customElements.define(name, define())
  }
}
export default { CompareView };
export { CompareView };
