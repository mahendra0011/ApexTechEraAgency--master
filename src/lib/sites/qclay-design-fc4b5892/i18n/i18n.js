import en from './en.json'

const $t = (id = '') => {
  return id.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), en)
}

export { $t }
