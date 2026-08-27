import { screens } from "../../../components/sites/apextechera-design-fc4b5892/root-8a5edab2/constants"
import { context } from "./Controller/utils/context"

export const transformLinkToId = (link) => {
    switch (link) {
        case '#home': return screens.MAIN
        case '#about': return screens.ABOUT
        case '#services': return screens.WHATCREATE
        case '#design': return screens.DESIGNTYPES
        case '#designs': return screens.DESIGNTYPES
        case '#types': return screens.WEBSITETYPES
        case '#websitetypes': return screens.WEBSITETYPES
        case '#process': return screens.COURSES
        case '#portfolio': return screens.PORTFOLIO
        case '#contacts': return screens.PORTFOLIO
        default: return null
    }
}

export const getScreen = (link) => {
    const id = transformLinkToId(link)
    if (!id) { return console.warn(`[Utils]: not correct id provided: ${link}`) }
    const index = context.ids.indexOf(id)
    if (index === -1) { return console.warn(`[Utils]: id ${id} index not found in context`) }
    return index
}