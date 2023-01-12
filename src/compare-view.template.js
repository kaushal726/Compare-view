export function getTemplate(o) {
  let options = o || {};
  let templateString = `
  <style>
    .compare_view{
      display: flex;
      margin-top:5vh;
      align-items: center;
      justify-content: center;
    }
    .compare_view_slider {
      pointer-events: none;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      height: 850px;
      width: 1400px;
      appearance: none;
      background-color: transparent;
      border: none;
      outline: none;
      cursor: auto;
      z-index: 22;
    }
    .compare_view_slider::-webkit-slider-thumb {
      pointer-events: auto;
      -webkit-appearance: none;
      appearance: none;
      width: 15px;
      height: 455px;
      background: yellow;
      cursor: ew-resize;
      border-radius: 20px;
    }

    .compare_view_slider::-moz-range-thumb {
      pointer-events: auto;
      width: 25px;
      height: 25px;
      background: #d6e022;
      cursor: pointer;
    }
  </style>

  <div id="compare-view" class="compare_view">
    <input id="compare_view_slider" class="compare_view_slider" class="fa-solid fa-sliders"  type="range" min="0" max="100" value="50" />
    <div id="compare_view_container" class="compare_view_container"></div>
    <slot id="compare_view_slot_after" name="after" style="display:none"></slot>
    <slot id="compare_view_slot_before" name="before" style="display:none" ></slot>
  </div>
  `;
  let template = document.createElement("template");
  template.innerHTML = templateString;
  return template;
}
