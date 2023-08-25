import { badRequest, success, failure } from "../lib/responses.js"


// function returnIntervalsObject(arr) {
//   let ranges = arr.map(interval => {
//     const [start, end] = interval.split('-').map((i) => { return Number(i) })
//     return { start, end }
//   })
//   return ranges.sort((a, b) => a.start - b.start)
// }

function returnMultiDimensionArray(intervalStrings) {
    const intervals = intervalStrings.map(intervalString => {
        const [start, end] = intervalString.split('-').map(Number)
        return [start, end]
    })
    return intervals
}

//Sorting the firnal array using 0th elem of final array
function sortArray(intervals) {
    return intervals.sort((a, b) => a[0] - b[0])
}

// Create an array with intervals and taking the exclude chunks out
function createIntervalArray(includes, excludes) {
    const intervals = includes.slice()

    let intervalArray = []
    for (const exclude of excludes) {
        intervals.forEach((interval) => {
            if (interval[1] <= exclude[0] || interval[0] >= exclude[1]) {
                intervalArray.push(interval)
            } else if (interval[0] < exclude[0] && interval[1] > exclude[1]) {
                intervalArray.push([interval[0], exclude[0] - 1])
                intervalArray.push([exclude[1] + 1, interval[1]])
            } else if (interval[0] < exclude[0]) {
                intervalArray.push([interval[0], exclude[0] - 1])
            } else if (interval[1] > exclude[1]) {
                intervalArray.push([exclude[1] + 1, interval[1]])
            }
        })
        intervals.length = 0
        intervals.push(...intervalArray)
        intervalArray.length = 0
    }

    console.log(intervals)
    return sortArray(intervals)
}


export const handler = async (event) => {
    try {
        let { includes, excludes } = JSON.parse(event.body)

        if (typeof (includes) !== "object" || typeof (excludes) !== 'object') {
            return badRequest({ message: "Body Invalid" })
        }

        //Making making single dimensional array into multi dimensional array
        let includeRanges = returnMultiDimensionArray(includes)
        let excludeRanges = returnMultiDimensionArray(excludes)
        console.log(includeRanges, excludeRanges)

        let finalRange = createIntervalArray(includeRanges, excludeRanges)

        // converting multidimension array to flat array for desired output as a string
        let desiredOutput = finalRange.map(interval => `${interval[0]}-${interval[1]}`)

        return success({
            message: "Result Fetched Successfully",
            data: desiredOutput
        })

    } catch (error) {
        console.log(error)
        return failure({ message: "Internal Server Error!" })
    }
}