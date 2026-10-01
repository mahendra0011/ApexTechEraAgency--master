// Android/mobile-responsive poster images (used INSTEAD of <video> — see
// CardMedia in Interface.js and renderVideo in ServiceSlider.jsx). Desktop/
// Windows responsive is untouched and always plays the real .mp4 videos.
//
// Self-hosted locally (client-provided images) — no external hotlinking, so
// these can't break if a third-party site removes the file or blocks
// hotlinking. The service posters are the full, uncropped illustrations
// (client-supplied in public/images) shown with object-fit: contain, so
// nothing gets cut off the way the old pre-cropped 800x450 posters did.
const POSTERS_PATH = '/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/posters'

export const MOBILE_POSTERS = {
  "service-0-brand-intro": `${POSTERS_PATH}/service-0-brand-intro.jpg`,
  "service-1-fullstack": '/images/fullstackwebdevlopment.jpeg',
  "service-2-uiux": '/images/uianduxdesign.jpg',
  "service-3-mobileapps": '/images/androidand%20iosdevelopment.jpg',
  "service-4-customsoftware": '/images/customsoftwaredevelopment.jpg',
  "service-5-aiml": '/images/aimodels.jpg',
  "service-6-clouddevops": '/images/cloudanddevopsdevelopment.jpg',
};
