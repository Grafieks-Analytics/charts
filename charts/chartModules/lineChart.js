const d3 = require("d3");

const CONSTANTS = require("../constants");

const utils = require("../utils");

const { drawMarker } = require("../modules/markers");

const chartGeneration = (svg) => {
    const grafieks = window.grafieks;

    const data = grafieks.dataUtils.rawData || [];

    const { dataValues = [], dataLabels = [] } = data;

    grafieks.dataUtils.dataValues = dataValues;
    grafieks.dataUtils.dataLabels = dataLabels;

    grafieks.dataUtils.dataLabelValues = dataValues[1];

    grafieks.legend.data = [dataLabels[0]];

    const { height } = grafieks.chartsConfig;

    const numericalValues = dataValues.map((d) => d[1]);
    const minValue = utils.getMinimumValue(numericalValues);
    const maxValue = utils.getMaximumValue(numericalValues);

    // Setting yScale
    const yDomain = [minValue, maxValue];
    const yRange = utils.getYRange();
    const yScale = utils.getYScale(yDomain, yRange);

    // Setting xScale
    const xDomain = dataValues.map((d) => d[0]); // Map the text values for x axis
    const xRange = utils.getXRange();
    const xScale = utils.getXScale(xDomain, xRange);

    // Exposing to utils, to be used in other places, like legend, tooltip, datalabels, axis etc.
    grafieks.utils.yScale = yScale;
    grafieks.utils.xScale = xScale;
    
    var datad3fc = dataValues.map(b=>b[1]);
    console.log("dataValues",dataValues)
    console.log("datad3fc",datad3fc)

    const xAxis = (options = {}, g) => {
        const {
            xTickfontSize = CONSTANTS.defaultValues.fontSize,
            xTickfontFamily = CONSTANTS.defaultValues.fontFamily,
            xTickfontColor = CONSTANTS.defaultValues.fontColor
        } = window.grafieks.plotConfiguration;
        const chartsMargins = window.grafieks.chartsConfig.margins;
        let { textAnchor = "middle", translateY = height - chartsMargins.bottom } = options;
        // Adding rotating margin to xAxis so that when it is rotated things are visible fine
        const ticks = g
            .attr("transform", `translate(0,${translateY - (chartsMargins.rotatingMargin || 0)})`)
            .call(d3.axisBottom(grafieks.utils.xScale).tickSizeOuter(0))
            .selectAll("text");

        // If ticking config is vertical -> rotating the tick to 90 degrees
        if (grafieks.chartsConfig.ticksStyle == CONSTANTS.TICK_VERTICAL) {
            let xTickfontSizeTemp = xTickfontSize / 2;
            if (xTickfontSize < 16) {
                xTickfontSizeTemp -= 2;
            }
            ticks.attr("dx", "-.8em").attr("dy", `-0.${xTickfontSizeTemp}em`).attr("transform", "rotate(-90)");
            textAnchor = "end";
        }

        ticks.attr("text-anchor", textAnchor);
        ticks.attr("font-size", xTickfontSize);
        ticks.attr("font-family", xTickfontFamily);
        ticks.attr("fill", xTickfontColor);

        return ticks;
    };

    const yAxis = (g) => {
        const chartsMargins = window.grafieks.chartsConfig.margins;

        const {
            yTickfontSize = CONSTANTS.defaultValues.fontSize,
            yTickfontFamily = CONSTANTS.defaultValues.fontFamily,
            yTickfontColor = CONSTANTS.defaultValues.fontColor
        } = window.grafieks.plotConfiguration;

        const ticks = g
            .attr("transform", `translate(${chartsMargins.left},0)`)
            .call(
                d3
                    .axisLeft(grafieks.utils.yScale)
                    .tickSize(0) // To remove the tick marks (The dashed solid lines)
                    .ticks(utils.getNumberOfTicks())
                    .tickFormat(d3.format(".2s"))
            )
            .selectAll("text");

        ticks.attr("font-size", yTickfontSize);
        ticks.attr("font-family", yTickfontFamily);
        ticks.attr("fill", yTickfontColor);

        return ticks;
    };

    svg.append("g").attr("class", "x-axis").call(xAxis.bind(this, {}));
    svg.append("g").attr("class", "y-axis").call(yAxis);

    const {
        chartName,
        d3colorPalette = CONSTANTS.d3ColorPalette,
        curveType = CONSTANTS.curveType.LINEAR
    } = grafieks.plotConfiguration;

    let line;
    let fill = "none";
    const lineStroke = CONSTANTS.defaultValues.lineStrokeWidth;
    if (chartName == CONSTANTS.AREA_CHART) {
        if (window.limit) {
            drawD3AreaCharts();
        } else {
            drawD3FCAreaCharts();
        }
    } else {
        if (window.limit) {
            drawD3LineCharts();
        } else {
            drawD3FCLineCharts();
        }
    }

    drawMarker(svg, dataValues, lineStroke, d3colorPalette[0]);
    function drawD3LineCharts() {
        line = d3
            .line()
            .x(function (d, i) {
                // this.setAttribute("data-value-x", d[0]);
                // this.setAttribute("data-value-y", d[1]);
                // console.log(d);
                return xScale(d[0]) + xScale.bandwidth() / 2;
            })
            .y(function (d) {
                return yScale(d[1]);
            })
            .curve(d3[curveType]);
        svg.append("path")
            .attr("class", "line") // Assign a class for styling
            .attr("d", line(dataValues)) // 11. Calls the line generator
            .attr("stroke", d3colorPalette[0])
            .attr("stroke-width", lineStroke)
            .attr("fill", fill)
            .attr("transform", "translate(0,0)");
    }
    function drawD3FCLineCharts() {
        // d3fc

        var el = document.createElement("div");
        var body = document.getElementsByTagName("body");
        el.innerHTML =
            '<d3fc-canvas use-device-pixel-ratio set-webgl-viewport style="position:absolute;height: 70%;width: 882.46px;top: 20px;left: 334px;"></d3fc-canvas>';
        // height: 366.67px;width: 882.46px;
        document.getElementById("chart").appendChild(el);
        

        console.log("rawdata",dataValues)
        // console.log(dataValues.map(b=>b[1]));
        console.log("transformeddata",datad3fc)

        const extent = fc.extentLinear();

        const xScaled3fc = d3.scaleLinear().domain([0, datad3fc.length - 1]);

        const yScaled3fc = d3.scaleLinear().domain(extent(datad3fc));
        const container = document.querySelector("d3fc-canvas");
        // document.querySelector(".grid").appendChild(container)
        // console.log("grid",document.querySelector(".grid"))

        const series = fc
            .seriesWebglLine()
            // .autoBandwidth(fc.seriesWebglLine())
            .xScale(xScaled3fc)
            .yScale(yScaled3fc)
            .crossValue((_, i) => i)
            .mainValue((d) => d)
            .lineWidth(4)
            .defined(() => true)
            .equals((previousData) => previousData.length > 0)
            .decorate((program, index) => {
                fc
                    .webglStrokeColor()
                    .value(() => {
                        // const { r, g, b, opacity } = d3.color(d3colorPalette[0]);
                        // return [r / 255, g / 255, b / 255, 0.1];
                        const { r, g, b, opacity } = "red";
                        return [122 / 145, 2 / 255, 3 / 255, 1];
                    })
                    .data(datad3fc)(program);
            });

        let pixels = null;
        let frame = 0;
        let gl = null;

        d3.select(container)
            // .on("click", () => {
            //     const domain = xScale.domain();
            //     const max = Math.round(domain[1] / 2);
            //     xScale.domain([0, max]);
            //     container.requestRedraw();
            // })
            .on("measure", (event) => {
                const { width, height } = event.detail;
                xScaled3fc.range([0, width]);
                yScaled3fc.range([height, 0]);

                gl = container.querySelector("canvas").getContext("webgl");
                series.context(gl);
            })
            .on("draw", () => {
                if (pixels == null) {
                    pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
                }
                performance.mark(`draw-start-${frame}`);
                series(datad3fc);
                // Force GPU to complete rendering to allow accurate performance measurements to be taken
                gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                performance.measure(`draw-duration-${frame}`, `draw-start-${frame}`);
                frame++;
            });

        container.requestRedraw();
    }
    function drawD3AreaCharts() {
        line = d3
            .area()
            .x(function (d, i) {
                // this.setAttribute("data-value-x", d[0]);
                // this.setAttribute("data-value-y", d[1]);
                // console.log(d);
                return xScale(d[0]) + xScale.bandwidth() / 2;
            })
            .y1(function (d) {
                return yScale(d[1]);
            })
            .y0(function (d) {
                return yScale(0);
            });

        fill = d3colorPalette[0];
        svg.append("path")
            .attr("class", "line") // Assign a class for styling
            .attr("d", line(dataValues)) // 11. Calls the line generator
            .attr("stroke", d3colorPalette[0])
            .attr("stroke-width", lineStroke)
            .attr("fill", fill)
            .attr("transform", "translate(0,0)");
    }
    function drawD3FCAreaCharts() {
        // d3fc

        var el = document.createElement("div");
        var body = document.getElementsByTagName("body");
        el.innerHTML =
            '<d3fc-canvas use-device-pixel-ratio set-webgl-viewport style="position:absolute;height: 70%;width: 882.46px;top: 20px;left: 334px;"></d3fc-canvas>';
        // height: 366.67px;width: 882.46px;
        document.getElementById("chart").appendChild(el);

        const extent = fc.extentLinear();

        const xScaled3fc = d3.scaleLinear().domain([0, datad3fc.length - 1]);

        const yScaled3fc = d3.scaleLinear().domain(extent(datad3fc));
        const container = document.querySelector("d3fc-canvas");
        // document.querySelector(".grid").appendChild(container)
        // console.log("grid",document.querySelector(".grid"))

        const series = fc
            .seriesWebglArea()
            // .autoBandwidth(fc.seriesWebglLine())
            .xScale(xScaled3fc)
            .yScale(yScaled3fc)
            .crossValue((_, i) => i)
            .mainValue((d) => d)
            // .lineWidth(4)
            
            .defined(() => true)
            .equals((previousData) => previousData.length > 0)
            .decorate((program, index) => {
                fc
                    .webglFillColor()
                    .value(() => {
                        // const { r, g, b, opacity } = d3.color(d3colorPalette[0]);
                        // return [r / 255, g / 255, b / 255, 0.1];
                        const { r, g, b, opacity } = "red";
                        return [122 / 145, 2 / 255, 3 / 255, 1];
                    })
                    .data(datad3fc)(program);
            });

        let pixels = null;
        let frame = 0;
        let gl = null;

        d3.select(container)
            // .on("click", () => {
            //     const domain = xScale.domain();
            //     const max = Math.round(domain[1] / 2);
            //     xScale.domain([0, max]);
            //     container.requestRedraw();
            // })
            .on("measure", (event) => {
                const { width, height } = event.detail;
                xScaled3fc.range([0, width]);
                yScaled3fc.range([height, 0]);

                gl = container.querySelector("canvas").getContext("webgl");
                series.context(gl);
            })
            .on("draw", () => {
                if (pixels == null) {
                    pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
                }
                performance.mark(`draw-start-${frame}`);
                series(datad3fc);
                // Force GPU to complete rendering to allow accurate performance measurements to be taken
                gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                performance.measure(`draw-duration-${frame}`, `draw-start-${frame}`);
                frame++;
            });

        container.requestRedraw();
    }
    // end
    return svg;
};
module.exports = chartGeneration;
