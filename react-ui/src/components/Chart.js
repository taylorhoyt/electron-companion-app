// @flow
import d3 from "d3";

const dates = [
  new Date("1"),
  new Date("2"),
  new Date("3"),
  new Date("4"),
  new Date("5"),
  new Date("6"),
  new Date("7"),
  new Date("8"),
  new Date("9"),
  new Date("10"),
  new Date("11"),
  new Date("12"),
  new Date("13"),
  new Date("14"),
  new Date("15"),
  new Date("16"),
];

type Props = {
  width: number,
  height: number,
  margin: {
    left: number,
    right: number,
    top: number,
    bottom: number,
  },
};

export type State = {
  data: Array<number>,
};

/**
 * Abstract class for a D3 chart.
 */
export default class Chart {
  el: Element;
  props: Props;
  dispatch: Function;

  constructor(el: Element, props: Props) {
    this.el = el;
    this.props = props;
    this.dispatch = d3.dispatch("navigation");
  }

  /**
   * To override. Creates the initial rendering of the chart.
   */
  // create() {}

  /**
   * Creates the root-level SVG element.
   * @return {object} D3 SVG root.
   */
  createRoot() {
    const { width, height, margin } = this.props;

    const svg = d3
      .select(this.el)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    return svg;
  }

  /**
   * Retrieves the scales for our chart.
   * Those are numerical time series scales on full extent of both domains.
   */
  getScales(state: State) {
    const { height, width } = this.props;

    const x = d3.time
      .scale()
      .range([0, width])
      .domain(d3.extent(dates));

    const y = d3.scale
      .linear()
      .range([height, 0])
      .domain(d3.extent(state.data[0]))
      .nice();

    return {
      x: x,
      y: y,
    };
  }

  /**
   * To override. Populates the initial renderings with content.
   */
  // update() {}

  /**
   * To use to flush out D3 transitions.
   */
  preventTransitions() {
    const now = Date.now;
    // $FlowFixMe
    Date.now = () => Infinity;
    d3.timer.flush();
    // $FlowFixMe
    Date.now = now;
  }

  /**
   * Wraps multi-line text.
   * http://bl.ocks.org/mbostock/7555321
   */
  wrapText(selections: Object) {
    selections.each(function wrap() {
      const text = d3.select(this);
      const words = text
        .text()
        .split(/\s+/)
        .reverse();
      const lineHeight = 1.1; // ems
      const y = text.attr("y");
      const dy = parseFloat(text.attr("dy"));

      let line = [];
      let lineNumber = 0;
      let word = words.pop();
      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");

      while (word) {
        line.push(word);
        tspan.text(line.join(" "));
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
        word = words.pop();
      }
    });
  }

  /**
   * Can be overriden. Destroys the rendered SVG.
   */
  destroy() {
    d3
      .select(this.el)
      .selectAll("svg")
      .remove();
  }
}
