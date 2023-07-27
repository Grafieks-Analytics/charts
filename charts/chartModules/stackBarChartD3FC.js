const drawD3FCCharts = (data) => {

    console.log("datafrom d3fc",grafieks.dataUtils.dataValues)
    dataValues=grafieks.dataUtils.dataValues
   
    var el = document.createElement("div");
    var body = document.getElementsByTagName("body");
    // var heightGrid = document.getElementsByClassName("grid")[0].getBBox().height;
    var heightGrid = document.getElementsByClassName("domain")[2].getBBox().height;
    // var widthGrid = document.getElementsByClassName("grid")[0].getBBox().width;
    var widthGrid = document.getElementsByClassName("x-axis")[0].getBBox().width-10;
    el.innerHTML =
        // '<d3fc-canvas use-device-pixel-ratio set-webgl-viewport style="position:absolute;height: 70%;width: 882.46px;top: 20px;left: 334px;"></d3fc-canvas>';
        '<d3fc-canvas use-device-pixel-ratio set-webgl-viewport style="position:absolute;height:'+heightGrid+'px;width:'+widthGrid+'px;top:20px;right: 20px;"></d3fc-canvas>';
    // height: 366.67px;width: 882.46px;
    document.getElementById("chart").appendChild(el);
    dataTransformed = transformData(dataValues);

    const domain = dataTransformed.reduce((acc, curr) => [...acc, ...curr.group], []);

    const stack = d3.stack().keys(Object.keys(dataTransformed[0]).filter((k) => k !== "group"));
    const series = stack(dataTransformed);

    console.log("dataa", dataTransformed);
    const container = document.querySelector("d3fc-canvas");

    const xScale = d3
        .scalePoint()
        .domain(dataTransformed.map((d) => d.group))
        .padding(1-(window.wdd/1000));

    const yExtent = fc
        .extentLinear()
        .accessors([(a) => a.map((d) => d[0])])
        .include([0]);

    const yScale = d3.scaleLinear().domain(yExtent(series));

    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    const color = d3.scaleOrdinal(d3.schemeAccent);

    const ctx = container.querySelector("canvas").getContext("webgl");

    const barSeries = fc
        .seriesWebglBar()
        .xScale(xScale)
        .yScale(yScale)
        .crossValue((d) => d.data.group)
        .mainValue((d) => d[1])
        .baseValue((d) => d[0])
        .bandwidth(Math.max(1,window.wdd))
        .context(ctx);

    let pixels = null;
    let frame = 0;
    let gl = null;

    const bandScale = d3.scaleBand().domain(domain);

    const bandAxis = fc.axisOrdinalBottom(bandScale).tickPadding(5);
    const bandContainer = document.querySelector("#band-container");

    d3.select(container)
        .on("measure", (event) => {
            // console.log("detail", event.detail)
            // event.detail.height = 500;
            const { width, height } = event.detail;
            // const height =500
            xScale.range([0, width]);
            yScale.range([height, 0]);
            bandScale.range([0, width]);

            gl = container.querySelector("canvas").getContext("webgl");
            barSeries.context(gl);
            // const { width } = event.detail;
            // bandScale.range([0, width]);
        })
        .on("draw", () => {
            d3.select(bandContainer).select("svg").call(bandAxis);
            if (pixels == null) {
                pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
            }
            const context = barSeries.context();
            performance.mark(`draw-start-${frame}`);
            series.forEach((s, i) => {
                barSeries.decorate((program) => {
                    fc
                        .webglFillColor()
                        .value(() => {
                            const { r, g, b, opacity } = d3.color(color(i));
                            return [r / 255, g / 255, b / 255, opacity];
                        })
                        .data(dataTransformed)(program);
                })(s);
            });

            // Force GPU to complete rendering to allow accurate performance measurements to be taken
            gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            performance.measure(`draw-duration-${frame}`, `draw-start-${frame}`);
            frame++;
        });

    function transformData(data) {
        var subgroups = [];
        var groups = Object.keys(data).map((d) => {
            subgroups.push(...Object.keys(data[d]));
        });
        subgroups = Array.from(new Set(subgroups));
        subgroups = Array.from(new Set(subgroups));
        console.log(subgroups);

        var mainGroups = Object.keys(data);

        // debugger;
        var finalData = mainGroups.map((mainGroup) => {
            var subGroup = data[mainGroup];
            var dataV = subgroups.map((subgroup) => subGroup[subgroup] || 0);
            dataV.group = mainGroup;
            return dataV;
        });
        return finalData;
    }

    container.requestRedraw();
}

module.exports = drawD3FCCharts;