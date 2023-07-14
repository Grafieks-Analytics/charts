// const data12 = [
//     {
//         State: 'AL',
//         'Under 5 Years': '310',
//         '5 to 13 Years': '552',
//         '14 to 17 Years': '259',
//         '18 to 24 Years': '450',
//         '25 to 44 Years': '1215',
//         '45 to 64 Years': '641'
//     },
//     {
//         State: 'AK',
//         'Under 5 Years': '52',
//         '5 to 13 Years': '85',
//         '14 to 17 Years': '42',
//         '18 to 24 Years': '74',
//         '25 to 44 Years': '183',
//         '45 to 64 Years': '50'
//     },
//     {
//         State: 'AZ',
//         'Under 5 Years': '515',
//         '5 to 13 Years': '828',
//         '14 to 17 Years': '362',
//         '18 to 24 Years': '601',
//         '25 to 44 Years': '1804',
//         '45 to 64 Years': '1523'
//     },
//     {
//         State: 'AR',
//         'Under 5 Years': '202',
//         '5 to 13 Years': '343',
//         '14 to 17 Years': '157',
//         '18 to 24 Years': '264',
//         '25 to 44 Years': '754',
//         '45 to 64 Years': '727'
//     }
// ];
// let data1 = [
//     {
//         "Central": 163797.1638,
//         "East": 208291.204,
//         "South": 117298.684,
//         "West": 252612.7435,
//         "group": "Furniture"
//     },
//     {
//         "Central": 167026.415,
//         "East": 205516.055,
//         "South": 125651.313,
//         "West": 220853.249,
//         "group": "Office Supplies"
//     },
//     {
//         "Central": 170416.312, "East": 264973.981, "South": 148771.908, "West": 251991.832,
//         "group": "Technology"
//     }
// ]
// let data1 = window.sampleData,
let data1 = {
    Furniture: { Central: 163797.1638, East: 208291.204, South: 117298.684, West: 252612.7435 },
    "Office Supplies": {
        Central: 167026.415,
        East: 205516.055,
        South: 125651.313,
        West: 220853.249
    },

    Technology: { Central: 170416.312, East: 264973.981, South: 148771.908, West: 251991.832 }
},

dataTransformed = transformData(data1)

const domain = dataTransformed.reduce((acc, curr) => [...acc, ...curr.group], []);

const stack = d3.stack().keys(Object.keys(dataTransformed[0]).filter(k => k !== 'group'));
const series = stack(dataTransformed);

console.log("dataa", dataTransformed)
const container = document.querySelector('d3fc-canvas');

const xScale = d3
    .scalePoint()
    .domain(dataTransformed.map(d => d.group))
    .padding(1);

const yExtent = fc
    .extentLinear()
    .accessors([a => a.map(d => d[0])])
    .include([0]);

const yScale = d3.scaleLinear().domain(yExtent(series));

// const color = d3.scaleOrdinal(d3.schemeCategory10);
const color = d3.scaleOrdinal(d3.schemeAccent);

const ctx = container.querySelector('canvas').getContext('webgl');

const barSeries = fc
    .seriesWebglBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(d => d.data.group)
    .mainValue(d => d[1])
    .baseValue(d => d[0])
    .bandwidth(8)
    .context(ctx);

let pixels = null;
let frame = 0;
let gl = null;

const bandScale = d3.scaleBand().domain(domain);


const bandAxis = fc.axisOrdinalBottom(bandScale).tickPadding(5);
const bandContainer = document.querySelector('#band-container');


d3.select(container)
    .on('measure', event => {
        // console.log("detail", event.detail)
        // event.detail.height = 500;
        const { width, height } = event.detail;
        // const height =500
        xScale.range([0, width]);
        yScale.range([height, 0]);
        bandScale.range([0, width]);

        gl = container.querySelector('canvas').getContext('webgl');
        barSeries.context(gl);
        // const { width } = event.detail;
        // bandScale.range([0, width]);

    })
    .on('draw', () => {
        d3.select(bandContainer)
            .select('svg')
            .call(bandAxis);
        if (pixels == null) {
            pixels = new Uint8Array(
                gl.drawingBufferWidth * gl.drawingBufferHeight * 4
            );
        }
        const context = barSeries.context();
        performance.mark(`draw-start-${frame}`);
        series.forEach((s, i) => {
            barSeries.decorate(program => {
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
        gl.readPixels(
            0,
            0,
            gl.drawingBufferWidth,
            gl.drawingBufferHeight,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            pixels
        );
        performance.measure(`draw-duration-${frame}`, `draw-start-${frame}`);
        frame++;
    });

function transformData(data) {
    var subgroups = [];
    var groups = Object.keys(data).map((d) => {
        subgroups.push(...Object.keys(data[d]));
    });
    subgroups = Array.from(new Set(subgroups));
    subgroups = Array.from(new Set(subgroups))
    console.log(subgroups)

    var mainGroups = Object.keys(data);

    // debugger;
    var finalData = mainGroups.map((mainGroup) => {
        var subGroup = data[mainGroup];
        var dataV = subgroups.map(subgroup => subGroup[subgroup] || 0);
        dataV.group = mainGroup;
        return dataV;
    });
    return finalData
}

container.requestRedraw();