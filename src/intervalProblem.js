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

function joinIntervalsArray(intervals) {
    intervals.sort((a, b) => a[0] - b[0])

    const merged = [intervals[0]]

    for (let i = 1;i < intervals.length;i++) {
        const current = intervals[i]
        const lastMerged = merged[merged.length - 1]

        if (current[0] <= lastMerged[1]) {
            lastMerged[1] = Math.max(lastMerged[1], current[1])
        } else {
            merged.push(current)
        }
    }

    // joining the overlapping array objects
    for (let i = 0;i < merged.length - 1;i++) {
        const current = merged[i]
        const next = merged[i + 1]

        if (current[1] >= next[0]) {
            current[1] = Math.max(current[1], next[1])
            merged.splice(i + 1, 1)
            i--
        }
    }
    return merged
}


function createIntervalArray(includes, excludes) {
    const intervals = includes.slice()

    let intervalArray = []
    for (const exclude of excludes) {
        intervals.forEach((interval, index) => {
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
    return joinIntervalsArray(intervals)
}


export const handler = async (event) => {
    try {

        let { includes, excludes } = JSON.parse(event.body)

        if (!includes instanceof Array && !excludes instanceof Array) {
            return badRequest({ message: "Body Invalid" })
        }

        //Making making single dimensional array into multi dimensional array
        let includeRanges = returnMultiDimensionArray(includes)
        let excludeRanges = returnMultiDimensionArray(excludes)

        console.log(includeRanges, excludeRanges)


        let finalRange = []
        finalRange = createIntervalArray(includeRanges, excludeRanges)


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