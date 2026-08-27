export const utils = {
    notDom(array = []) {
        return array.filter(item => !!item).length !== array.length
    }
}