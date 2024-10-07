const d3 = require("d3");
const CONSTANTS = require("../constants");
const { isHorizontalGraph, getDateFormattedData } = require("../utils");

const isDateFormat = (itemType) => {
    if (itemType === "Date") {
        return true;
    }
    return false;
};

function sortByMonth(arr, dateFormat) {
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (dateFormat == "%b") {
        months = shortMonths;
    }

    return arr.sort(function (a, b) {
        return months.indexOf(a) - months.indexOf(b);
    });
}

const sortDates = (datesArray, dateFormat) => {
    if (dateFormat == "%b" || dateFormat == "%B") {
        return sortByMonth(datesArray, dateFormat);
    }
    datesArray.sort(function (a, b) {
        if (dateFormat == "%d") {
            // Setting date value in accending order
            return +a - +b;
        }
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a) - new Date(b);
    });
    return datesArray;
};

const transformData = () => {
    const grafieks = window.grafieks;

    const { chartName, dataColumns: { xAxisColumnDetails = [], yAxisColumnDetails = [] } = {} } =
        grafieks.plotConfiguration;

    grafieks.flags.isDataTransformed = true;

    const excludedCharts = [CONSTANTS.PIVOT];

    if (excludedCharts.indexOf(chartName) > -1) {
        return;
    }

    const data = grafieks.dataUtils.rawData;
    const { dataValues } = data;

    let transformedData, timeFormat, dates, xAxisData, yAxisData;
    let newDataSet = {};
    let dateFormat = "%Y";
    let sortedDates = [];
    let itemType = "";

    switch (chartName) {
        case CONSTANTS.HORIZONTAL_BAR_CHART:
        case CONSTANTS.BAR_CHART:
            itemType = xAxisColumnDetails[0].itemType;
            dateFormat = xAxisColumnDetails[0].dateFormat;

            if (isHorizontalGraph()) {
                itemType = yAxisColumnDetails[0].itemType;
                dateFormat = yAxisColumnDetails[0].dateFormat;
            }
            if (!isDateFormat(itemType)) {
                return;
            }

            // // timeFormat = d3.timeFormat(dateFormat);

            // // // [xAxisData, yAxisData] = dataValues;
            // // const xAxisData = dataValues.map(item => item[0]);
            // // const yAxisData = dataValues.map(item => item[1]);

            // // // console.warn("dataValues",dataValues[0])

            // // console.warn("xAxisData",xAxisData)
            // // xAxisData.forEach((d, i) => {
            // //     const dateValue = timeFormat(new Date(d));
            // //     if (!newDataSet[dateValue]) {
            // //         newDataSet[dateValue] = 0;
            // //     }
            // //     newDataSet[dateValue] += yAxisData[i];
            // // });

            // // dates = Object.keys(newDataSet);
            // // console.warn("dates",dates)
            // // sortedDates = sortDates(dates, dateFormat);
            // // exp
            // var dataTemp = dataValues
            // console.warn("dataTemp",dataTemp)
            // // for (let i = 0; i < dataValues.length; i++) {
            // //     // Assuming sortDates function returns the desired result
            // //     dataTemp[i][0] = sortDates(dataValues[i][0], dateFormat);
            // // }
            // console.warn("dataTemp",dataTemp)
            // // exp

            // // const values = sortedDates.map((d) => newDataSet[d]);

            // // // transformedData = [sortedDates, values];
            // // transformedData = [sortedDates, yAxisData];
            // // console.warn("transformedData",transformedData)
            // // const dataCombined = sortedDates.map((item, index) => [item, values[index]]);
            // // console.warn("dataCombined",dataCombined)
            // // grafieks.dataUtils.dataCombined = dataCombined;
            // ------

            // if (isHorizontalGraph()) {
            //     itemType = yAxisColumnDetails[0].itemType;
            //     dateFormat = yAxisColumnDetails[0].dateFormat;
            // }
            // if (!isDateFormat(itemType)) {
            //     return;
            // }

            timeFormat = d3.timeFormat(dateFormat);

            // [xAxisData, yAxisData] = dataValues || [];
            // xAxisData.forEach((d, i) => {
            //     const dateValue = timeFormat(new Date(d));
            //     if (!newDataSet[dateValue]) {
            //         newDataSet[dateValue] = 0;
            //     }
            //     newDataSet[dateValue] += yAxisData[i];
            // });

            // dates = Object.keys(newDataSet);
            // sortedDates = sortDates(dates, dateFormat);

            // const values = sortedDates.map((d) => newDataSet[d]);

            // transformedData = [sortedDates, values];
            const xAxisData = dataValues.map((item) => item[0]);
            const yAxisData = dataValues.map((item) => item[1]);

            timeFormat = d3.timeFormat(dateFormat);
            xAxisData.forEach((d, i) => {
                const dateValue = timeFormat(new Date(d));
                if (!newDataSet[dateValue]) {
                    newDataSet[dateValue] = 0;
                }
                // console.log("number",newDataSet[dateValue])
                newDataSet[dateValue] += Number(yAxisData[i]);
            });
            dates = Object.keys(newDataSet);
            sortedDates = sortDates(dates, dateFormat);
            const values = sortedDates.map((d) => newDataSet[d]);
            const dataCombined = sortedDates.map((item, index) => [item, values[index]]);
            grafieks.dataUtils.dataCombined = dataCombined;

            // grafieks.dataUtils.rawData["dataValues"] = dataCombined

            // console.log("sortedDates", sortedDates);
            // console.log("values", values);
            // console.log("xAxisData", xAxisData);
            // console.log("yAxisData", yAxisData);

            // grafieks.dataUtils.rawData[0] = transformedData;

            // ------
            return;
        case CONSTANTS.STACKED_BAR_CHART:
        case CONSTANTS.HORIZONTAL_STACKED_BAR_CHART:
            itemType = xAxisColumnDetails[0].itemType;
            dateFormat = xAxisColumnDetails[0].dateFormat;
            console.log("data in data transformation func", dataValues);
            if (isHorizontalGraph()) {
                itemType = yAxisColumnDetails[0].itemType;
                dateFormat = yAxisColumnDetails[0].dateFormat;
            }
            console.log("xAxisColumnDetails", xAxisColumnDetails);
            if (!isDateFormat(itemType)) {
                return;
            }
            // Function to sort the data by year
            const sortedDataValues = Object.fromEntries(
                Object.entries(dataValues).sort(([date1], [date2]) => date1.localeCompare(date2))
            );

            // if (!isDateFormat(itemType)) {
            //     return;
            // }

            // Function to process the data
            // const processData = (data) => {
            //     const result = {};

            //     // Loop through each date in the data
            //     for (const date in data) {
            //         if (data.hasOwnProperty(date)) {
            //             // alert(dateFormat);
            //             // console.log({ dateFormat });
            //             let year = date.split("-")[0];
            //             if (dateFormat == "%Y") {
            //                 year = date.split("-")[0];
            //             } else if (dateFormat == "%b") {
            //                 year = date.split("-")[1];
            //             } else if (dateFormat == "%d") {
            //                 year = date.split("-")[2];
            //             } else {
            //                 year = date;
            //             }

            //             const shipments = data[date];

            //             // If the year key doesn't exist in the result, create it
            //             if (!result[year]) {
            //                 result[year] = {};
            //             }

            //             // Loop through each status in the shipments for the date
            //             for (const status in shipments) {
            //                 if (shipments.hasOwnProperty(status)) {
            //                     const amount = shipments[status];

            //                     // If the status key doesn't exist in the result, create it
            //                     if (!result[year][status]) {
            //                         result[year][status] = 0;
            //                     }

            //                     // Add the amount to the corresponding status in the result
            //                     result[year][status] += amount;
            //                 }
            //             }
            //         }
            //     }
            //     // const sortedResult = {};
            //     // Object.keys(result)
            //     //     .sort()
            //     //     .forEach((year) => {
            //     //         sortedResult[year] = result[year];
            //     //     });
            //     return result;
            // };
            function sumDataByDateAndStatus(data, dateFormat) {
                // alert(dateFormat)
                const result = {};

                for (const date in data) {
                    const formattedDate = new Date(date);
                    let formattedDateString = "";

                    switch (dateFormat) {
                        case "%Y":
                            formattedDateString = formattedDate.getFullYear().toString();
                            break;
                        case "month-num":
                            formattedDateString = (formattedDate.getMonth() + 1).toString();
                            break;
                        case "%b":
                            formattedDateString = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                                formattedDate
                            );
                            break;
                        case "%d":
                            formattedDateString = formattedDate.getDate().toString();
                            break;
                        case "%b %Y":
                            const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                                formattedDate
                            );
                            const year = formattedDate.getFullYear().toString();
                            formattedDateString = `${monthName}-${year}`;
                            break;
                        default:
                            throw new Error("Invalid date format specified");
                    }

                    for (const status in data[date]) {
                        if (!result[formattedDateString]) {
                            result[formattedDateString] = {};
                        }
                        if (!result[formattedDateString][status]) {
                            result[formattedDateString][status] = 0;
                        }
                        result[formattedDateString][status] += data[date][status];
                    }
                }
                console.log("result", result);

                return result;
            }

            // console.log("result", processData(sortedDataValues));
            if (dateFormat == "%d %b %Y") {
                grafieks.dataUtils.dataCombined = sortedDataValues;
            } else {
                // grafieks.dataUtils.dataCombined = processData(sortedDataValues);
                // grafieks.dataUtils.dataCombined = sumDataByDateAndStatus(dataValues, 'year');
                // grafieks.dataUtils.dataCombined = sumDataByDateAndStatus(dataValues, 'month-word');
                console.log("formatting by date", dateFormat);
                grafieks.dataUtils.dataCombined = sumDataByDateAndStatus(sortedDataValues, dateFormat);
            }
            return;
        case CONSTANTS.MULTIPLE_LINE_CHART:
        case CONSTANTS.MULTIPLE_AREA_CHART:
        // console.log("data transform in line chart", dataValues);
        // console.log("dateFormat", dateFormat);
        // const xAxisDataMultiline = dataValues.map((item) => item[0]);
        // const yAxisDataMultiline = dataValues.map((item) => item[2]);
        // timeFormat = d3.timeFormat(dateFormat);
        // xAxisDataMultiline.forEach((d, i) => {
        //     const dateValue = timeFormat(new Date(d));
        //     if (!newDataSet[dateValue]) {
        //         newDataSet[dateValue] = 0;
        //     }
        //     // console.log("number",newDataSet[dateValue])
        //     newDataSet[dateValue] += Number(yAxisDataMultiline[i]);
        // });
        // dates = Object.keys(newDataSet);
        // sortedDates = sortDates(dates, dateFormat);
        // const valuesmultiline = sortedDates.map((d) => newDataSet[d]);
        // const dataCombinedMultiline = sortedDates.map((item, index) => [item, valuesmultiline[index]]);
        // console.log("dataCombinedMultiline",dataCombinedMultiline)
        // grafieks.dataUtils.dataCombined = dataCombined;

        case CONSTANTS.LINE_CHART:
        case CONSTANTS.AREA_CHART:
        case CONSTANTS.HORIZONTAL_LINE_CHART:
        case CONSTANTS.HORIZONTAL_AREA_CHART:
        case CONSTANTS.WATERFALL_CHART:
            let itemTypeLine = xAxisColumnDetails[0].itemType;
            dateFormat = xAxisColumnDetails[0].dateFormat;

            if (isHorizontalGraph()) {
                itemTypeLine = yAxisColumnDetails[0].itemType;
                dateFormat = yAxisColumnDetails[0].dateFormat;
            }
            console.log("yAxisColumnDetails", itemTypeLine);
            if (!isDateFormat(itemTypeLine)) {
                return;
            }

            // debugger;

            // dateFormat = xAxisColumnDetails[0].dateFormat;

            const xAxisDataLineChart = dataValues.map((d) => d[0]);
            const yAxisDataLIneChart = dataValues.map((d) => d[1]);
            // dateFormat = xAxisColumnDetails[0].dateFormat;
            timeFormat = d3.timeFormat(dateFormat);
            xAxisDataLineChart.forEach((d, i) => {
                const dateValue = timeFormat(new Date(d));
                if (!newDataSet[dateValue]) {
                    newDataSet[dateValue] = 0;
                }
                newDataSet[dateValue] += Number(yAxisDataLIneChart[i]);
            });

            dates = Object.keys(newDataSet);
            sortedDates = sortDates(dates, dateFormat);
            const valuesLineChart = sortedDates.map((d) => newDataSet[d]);
            const dataCombinedLineChart = sortedDates.map((item, index) => [item, valuesLineChart[index]]);
            grafieks.dataUtils.dataCombined = dataCombinedLineChart;

            // transformedData = sortedDates.map((d) => [d, newDataSet[d]]);

            // grafieks.dataUtils.rawData[0] = transformedData;

            return;
        case CONSTANTS.FUNNEL_CHART:
            if (!isDateFormat(xAxisColumnDetails[0].itemType)) {
                return;
            }
            dateFormat = xAxisColumnDetails[0].dateFormat;
            timeFormat = d3.timeFormat(dateFormat);

            xAxisData = dataValues.map((d) => d.label || d.key);
            yAxisData = dataValues.map((d) => d.value);

            xAxisData.forEach((d, i) => {
                const dateValue = timeFormat(new Date(d));
                if (!newDataSet[dateValue]) {
                    newDataSet[dateValue] = 0;
                }
                newDataSet[dateValue] += yAxisData[i];
            });

            dates = Object.keys(newDataSet);
            sortedDates = sortDates(dates, dateFormat);

            transformedData = sortedDates.map((key) => {
                return { label: key, value: newDataSet[key] };
            });

            grafieks.dataUtils.rawData[0] = transformedData;
            return;
        case CONSTANTS.PIE_CHART:
            if (!isDateFormat(xAxisColumnDetails[0].itemType)) {
                return;
            }
            dateFormat = xAxisColumnDetails[0].dateFormat;
            timeFormat = d3.timeFormat(dateFormat);

            const json = {};
            const uniqueKey = [];
            Object.keys(dataValues).forEach((d) => {
                const key = getDateFormattedData(d, dateFormat);
                if (!uniqueKey.includes(key)) {
                    uniqueKey.push(key);
                }

                if (!json[key]) {
                    json[key] = 0;
                }

                json[key] += dataValues[d];
            });

            transformedData = {};
            Object.keys(json).forEach((d) => {
                if (json[d] < 0) {
                    return;
                }
                transformedData[d] = json[d];
            });

            grafieks.dataUtils.rawData[0] = transformedData;
            return;
        default:
            return;
    }
};

module.exports = {
    transformData,
    sortDates,
    isDateFormat
};
