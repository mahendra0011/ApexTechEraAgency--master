// const itl = (timeline, time) => {

//     if ( timeline.length < 2 ) { return console.error('[itl]: Minimum count of points "2"') }
//     if ( timeline.length === 2 ) { return calc(timeline[0], timeline[1]) }

//     for (let i = 1; i < timeline.length - 1; i++) {
//         if ( time >= timeline[i].$TIME && time < timeline[i + 1].$TIME ) {
//             return calc(timeline[i], timeline[i + 1])
//         }
//         if ( i + 1 === timeline.length - 1 && time >= timeline[i + 1].$TIME ) {
//             return calc(timeline[i], timeline[i + 1])
//         }
//     }
//     return calc(timeline[0], timeline[1])

//     function calc(A, B) {
//         const object = {}
//         const t = Math.max(Math.min(time, B.time), A.time)
//         deepObject(A, B, object, t)
//         return timeline

//         function deepObject(pointA, pointB, object, t) {
//             Object.keys(pointA).forEach(key => {
//                 if ( key === '$TIME' ) { return }
//                 if ( typeof pointA[key] === 'number' ) {
//                     object[key] = (t - A.time) / (B.time - A.time) * (pointB[key] - pointA[key]) + pointA[key]
//                 } else {
//                     object[key] = {}
//                     deepObject(pointA[key], pointB[key], object[key], t)
//                 }
//             })
//         }
//     } 
// }

// todo: сделать чтобы на каждом временном промежутке был каждый ключ + значение нужное
// бля решил что ну его нахуй)
// const mergeTimeline = (config) => {
//     const timeline = config.timeline
//     const tInterface = config.interface

//     const newTimeline = timeline.map(_ => {
//         const object = {}
//         deepObject(_, tInterface, object, _.$TIME)
//         return object
//     })
//     console.log('timeline', timeline)
//     console.log('newTimeline', newTimeline)

//     function deepObject(current, tInterface, object, time) {
//         Object.keys(tInterface).forEach(key => {
//             if ( typeof current[key] === 'undefined'  ) {
//                 if ( typeof tInterface[key] === 'number' ) {
//                     object[key] = -1
//                 } else {
//                     object[key] = JSON.parse(JSON.stringify(tInterface[key]))
//                     if ( typeof object[key] === 'number' ) {

//                     } else {
//                         deepInsert(object[key])
//                     }
//                 }
//             } 
//             else if ( typeof current[key] === 'number' ) {
//                 object[key] = current[key]
//             }
//             else {
//                 object[key] = { ...current[key] }
//                 deepObject(current[key], tInterface[key], object[key], time)
//             }
//         })
//     }

//     function deepInsert(current) {

//         if ( typeof current === 'number' ) {

//         } else {
//             Object.keys(current).forEach(key => {
//                 if (typeof current[key] === 'number') {

//                 } else {

//                 }
//             })
//         }
//     }

//     function insert(key) {
//         const { top, bottom } = deepSearch(timeline, key)
//         if ( typeof top === 'number' && typeof bottom === 'number') {

//         }
//         else if (typeof top === 'number') {
//             object[key]
//         }
//         else {

//         }
//     }

//     function deepSearch(items, id) {
//         var i = 0, o;
//         for (i = 0, len = items.length; i < len; i++) {
//             o = items[i];
//             if (o[id] && o.id == id) {
//                 return o;
//             } else if (o['items'] && Array.isArray(o.items) && o.items.length){
//                 return deepSearch(o.items, id);
//             }
//         }     
//       }

//     return timeline
// }

const itl = (config, time) => {

    const timeline = config.timeline
    const tInterface = config.interface


    if ( timeline.length < 2 ) { return console.error('[itl]: Minimum count of points "2"') }
    fillInterface()
    return tInterface

    function fillInterface() {
        for ( let key in tInterface ) {
            const times = tInterface[key].$TIME
            if ( time < times.at(0) ) {
                calc(key, [times.at(0)])
            } else
            if ( time >= times.at(-1) ) {
                calc(key, [times.at(-1)])
            } else {
                for ( let i = 0; i < times.length - 1; i++ ) {
                    if ( time >= times.at(i) && time < times.at(i + 1) ) {
                        calc(key, [times.at(i), times.at(i+1)])
                    }
                }
            }
        }

        function calc(key, times) {
            if ( times.length === 1 ) {
                return tInterface[key] = { ...timeline.filter(_ => _.$TIME === times[0])[0][key], $TIME: tInterface[key].$TIME  }
            }
            const tA = times[0]
            const tB = times[1]
            const pA = timeline.filter(_ => _.$TIME === tA)[0][key]
            const pB = timeline.filter(_ => _.$TIME === tB)[0][key]
            if ( pA === undefined || pB === undefined ) { 
                console.error(`[ITL]: invalid $TIME in Interface "${key}, ${tA}, ${tB}"`) 
                return
            }
            const t = Math.max(Math.min(time, tB), tA)
            Object.keys(tInterface[key]).forEach(innerKey => {
                if ( key === '$TIME' || innerKey === '$TIME' ) { return }
                tInterface[key][innerKey] = (t - tA) / (tB - tA) * (pB[innerKey] - pA[innerKey]) + pA[innerKey]
            })
        }
    }
}


export { itl }