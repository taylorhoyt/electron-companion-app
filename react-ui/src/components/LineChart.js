// @flow
import d3 from "d3";
import Chart from "./Chart";
import type { State } from "./Chart";

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

type Scales = {
  x: Function,
  y: Function,
};

export default class LineChart extends Chart {
  create() {
    const { height } = this.props;
    const svg = this.createRoot();

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`);

    svg.append("g").attr("class", "y axis");

    svg.append("g").attr("class", "lines");
  }

  getAxis(state: State, scales: Scales) {
    const x = d3.svg
      .axis()
      .scale(scales.x)
      .orient("bottom")
      .tickFormat(d3.time.format("%Y"))
      .outerTickSize(0);

    const y = d3.svg
      .axis()
      .scale(scales.y)
      .orient("left")
      .outerTickSize(0);

    return {
      x: x,
      y: y,
    };
  }

  update(state: State) {
    const scales = this.getScales(state);

    //this.drawAxis(state, scales);
    this.drawLines(state, scales);
  }

  drawAxis(state: State, scales: Scales) {
    const svg = d3.select(this.el);
    const axis = this.getAxis(state, scales);

    svg
      .select(".axis.x")
      .transition()
      .call(axis.x)
      .selectAll(".tick text")
      .call(this.wrapText);

    svg
      .select(".axis.y")
      .transition()
      .call(axis.y);
  }

  drawLines(state: State, scales: Scales) {
    const svg = d3.select(this.el);

    const d3Line = d3.svg
      .line()
      .x((d, i) => scales.x(dates[i]))
      .y((d) => scales.y(d));

    const lines = svg.selectAll(".lines");
    const line = lines.selectAll(".line").data(state.data);

    line
      .enter()
      .append("path")
      .attr("class", "line")
      .style("stroke-width", 2);

    line.transition().attr("d", d3Line);

    line.exit().remove();
  }
}
