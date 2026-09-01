// Android/mobile-responsive poster images (used INSTEAD of <video> — see
// CardMedia in Interface.js and renderVideo in ServiceSlider.jsx). Desktop/
// Windows responsive is untouched and always plays the real .mp4 videos.
//
// Self-hosted locally (client-provided images, fitted to 800x450) — no
// external hotlinking, so these can't break if a third-party site removes
// the file or blocks hotlinking.
const POSTERS_PATH = '/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/posters'

export const MOBILE_POSTERS = {
  "service-0-brand-intro": `${POSTERS_PATH}/service-0-brand-intro.jpg`,
  "service-1-fullstack": `${POSTERS_PATH}/service-1-fullstack.jpg`,
  "service-2-uiux": `${POSTERS_PATH}/service-2-uiux.jpg`,
  "service-3-mobileapps": `${POSTERS_PATH}/service-3-mobileapps.jpg`,
  "service-4-customsoftware": `${POSTERS_PATH}/service-4-customsoftware.jpg`,
  "service-5-aiml": `${POSTERS_PATH}/service-5-aiml.jpg`,
  "service-6-clouddevops": `${POSTERS_PATH}/service-6-clouddevops.jpg`,
};
