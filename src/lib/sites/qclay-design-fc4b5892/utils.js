import { screens } from "../../../components/sites/qclay-design-fc4b5892/root-8a5edab2/constants"
import { context } from "./Controller/utils/context"

export const transformLinkToId = (link) => {
    switch (link) {
        case '#home': return screens.MAIN
        case '#about': return screens.ABOUT
        case '#portfolio': return screens.PORTFOLIO
        case '#contacts': return screens.REQUESTFORM
    }
}

export const getScreen = (link) => {
    const id = transformLinkToId(link)
    if (!id) { return console.warn(`[Utils]: not correct id provided`) }
    const index = context.ids.indexOf(id)
    if (index === -1) { return console.warn(`[Utils]: id index not found in context`) }
    return index
}