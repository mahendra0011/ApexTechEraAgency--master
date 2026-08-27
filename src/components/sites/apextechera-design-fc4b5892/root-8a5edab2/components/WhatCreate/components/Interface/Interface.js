import { useRef } from 'react'

import Animate from "./Animate"
import ServiceSlider from "./ServiceSlider"
import './ApexDashboard.css'

const Interface = ({ parent, parentRefs }) => {

    const interfaceInterface = useRef()

    const interfaceContainer = useRef()
    const interfaceContent = useRef()
    const interfaceStage1 = useRef()
    const interfaceStage2 = useRef()
    const interfaceStage3 = useRef()

    const interfaceTagContainer = useRef()
    const interfaceTag1 = useRef()
    const interfaceTag2 = useRef()
    const interfaceTag3 = useRef()
    const interfaceTag4 = useRef()

    const interfaceMode = useRef()
    const interfaceModeTrX = useRef()

    const interfaceDHeader = useRef()
    const interfaceSidebar = useRef()
    const interfaceOtherOps = useRef()
    const interfaceRow = useRef()
    const interfaceTitle = useRef()
    const interfaceTasks = useRef()
    const interfaceMOps = useRef()
    const interfaceMHeader = useRef()
    const interfaceLogo = useRef()
    const interfaceSlot = useRef()

    function initRefs() {
        const slider = parentRefs.target.current

        const mainInterface = interfaceInterface.current

        const container = interfaceContainer.current
        const content = interfaceContent.current
        const view = parentRefs.view.current
        const grid = parentRefs.grid.current
        const stage1 = interfaceStage1.current
        const stage2 = interfaceStage2.current
        const stage3 = interfaceStage3.current

        const mode = interfaceMode.current
        const modeTrX = interfaceModeTrX.current

        const tag1 = interfaceTag1.current
        const tag2 = interfaceTag2.current
        const tag3 = interfaceTag3.current
        const tag4 = interfaceTag4.current

        const tagContainer = interfaceTagContainer.current

        const dHeader = interfaceDHeader.current
        const sidebar = interfaceSidebar.current
        const otherOps = interfaceOtherOps.current

        const row = interfaceRow.current
        const title = interfaceTitle.current
        const tasks = interfaceTasks.current
        const mOps = interfaceMOps.current
        const mHeader = interfaceMHeader.current
        const logo = interfaceLogo.current

        const slot = interfaceSlot.current

        const cursor1 = parentRefs.cursor1.current
        const cursor2 = parentRefs.cursor2.current
        const cursor3 = parentRefs.cursor3.current
        const cursor4 = parentRefs.cursor4.current
        const cursor5 = parentRefs.cursor5.current
        const cursor6 = parentRefs.cursor6.current


        const mounted = slider && container && content && view && stage1 && stage2 && stage3 && grid
                        && mode && modeTrX
                        && dHeader && sidebar && otherOps
                        && row && title && tasks && mOps && mHeader && logo
                        && slot && mainInterface
                        && cursor1 && cursor2 && cursor3 && cursor4 && cursor5 && cursor6
        return { 
            mounted, slider, container, content, 
            view, stage1, stage2, stage3, grid, 
            tag1, tag2, tag3, tag4,
            tagContainer, mainInterface,
            mode, modeTrX,
            dHeader, sidebar, otherOps,
            row, title, tasks, mOps, mHeader, logo, slot,
            cursor1, cursor2, cursor3, cursor4, cursor5, cursor6
        }
    }

    return (
        <Animate parent={parent} target={interfaceInterface} initRefs={initRefs}>
            <div ref={interfaceInterface} className="interface">
                <div ref={interfaceContainer} className='interface__container'>
                    <div ref={interfaceContent} className='interface__content'>
                        <div ref={interfaceMode} className='interface__mode'>
                            <div ref={interfaceModeTrX} className='interface__trx'>
                                <div className='interface__background'>
                                    <div className='interface-apex-bg' />
                                </div>

                                {/* STAGE 1: 6-Card Wireframe Skeleton Prototype */}
                                <div ref={interfaceStage1} className='interface__stage-1'>
                                    <div className='apex-skeleton-root'>
                                        <div className='apex-skel-sidebar'>
                                            <div className='apex-skel-icons'>
                                                <div className='apex-skel-circle active' />
                                                <div className='apex-skel-circle' />
                                                <div className='apex-skel-circle' />
                                                <div className='apex-skel-circle' />
                                            </div>
                                            <div className='apex-skel-bottom-switch' />
                                        </div>
                                        <div className='apex-skel-header'>
                                            <div className='apex-skel-nav-pills'>
                                                <div className='apex-skel-pill' />
                                                <div className='apex-skel-pill' />
                                                <div className='apex-skel-pill' />
                                            </div>
                                            <div className='apex-skel-search' />
                                        </div>
                                        <div className='apex-skel-title-area'>
                                            <div className='apex-skel-dep-line' />
                                            <div className='apex-skel-title-line' />
                                        </div>
                                        <div className='apex-skel-options-area'>
                                            <div className='apex-skel-opt-pill active' />
                                            <div className='apex-skel-opt-pill' />
                                            <div className='apex-skel-opt-pill' />
                                        </div>
                                        <div className='apex-skel-tasks-area'>
                                            <div className='apex-skel-grid-6'>
                                                {/* Left Column - Card 1 (Top Left) */}
                                                <div className='apex-skel-card'>
                                                    <div className='apex-skel-card-head'>
                                                        <span className='apex-skel-dot dot-blue' />
                                                        <span className='apex-skel-line-short' />
                                                    </div>
                                                    <div className='apex-skel-line-title' />
                                                    <div className='apex-skel-tags'>
                                                        <div className='apex-skel-tag' />
                                                        <div className='apex-skel-tag' />
                                                    </div>
                                                    <div className='apex-skel-video-box'>
                                                        <video autoPlay muted loop playsInline preload="none" poster="/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/poster-1.webp">
                                                            <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-1-fullstack.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>

                                                {/* Middle Column - Card 2 (Top Middle) */}
                                                <div className='apex-skel-card'>
                                                    <div className='apex-skel-card-head'>
                                                        <span className='apex-skel-dot dot-green' />
                                                        <span className='apex-skel-line-short' />
                                                    </div>
                                                    <div className='apex-skel-line-title' />
                                                    <div className='apex-skel-tags'>
                                                        <div className='apex-skel-tag' />
                                                        <div className='apex-skel-tag' />
                                                    </div>
                                                    <div className='apex-skel-video-box'>
                                                        <video autoPlay muted loop playsInline preload="none">
                                                            <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-2-uiux.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>

                                                {/* Right Column - Card 3 (Top Right) */}
                                                <div className='apex-skel-card'>
                                                    <div className='apex-skel-card-head'>
                                                        <span className='apex-skel-dot dot-cyan' />
                                                        <span className='apex-skel-line-short' />
                                                    </div>
                                                    <div className='apex-skel-line-title' />
                                                    <div className='apex-skel-tags'>
                                                        <div className='apex-skel-tag' />
                                                        <div className='apex-skel-tag' />
                                                    </div>
                                                    <div className='apex-skel-video-box'>
                                                        <video autoPlay muted loop playsInline preload="none">
                                                            <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-3-mobileapps.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>

                                                {/* Left Column - Card 4 (Bottom Left) */}
                                                <div className='apex-skel-card'>
                                                    <div className='apex-skel-card-head'>
                                                        <span className='apex-skel-dot dot-amber' />
                                                        <span className='apex-skel-line-short' />
                                                    </div>
                                                    <div className='apex-skel-line-title' />
                                                    <div className='apex-skel-tags'>
                                                        <div className='apex-skel-tag' />
                                                        <div className='apex-skel-tag' />
                                                    </div>
                                                    <div className='apex-skel-video-box'>
                                                        <video autoPlay muted loop playsInline preload="none">
                                                            <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-5-aiml.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>

                                                {/* Middle Column - Card 5 (Slot Host: Single video rendered by ServiceSlider) */}
                                                <div className='apex-skel-card'>
                                                    <div className='apex-skel-card-head'>
                                                        <span className='apex-skel-dot dot-purple' />
                                                        <span className='apex-skel-line-short' />
                                                    </div>
                                                    <div className='apex-skel-line-title' />
                                                    <div className='apex-skel-tags'>
                                                        <div className='apex-skel-tag' />
                                                        <div className='apex-skel-tag' />
                                                    </div>
                                                    <div className='apex-skel-video-box' />
                                                </div>

                                                {/* Right Column - Card 6 (Bottom Right) */}
                                                <div className='apex-skel-card'>
                                                    <div className='apex-skel-card-head'>
                                                        <span className='apex-skel-dot dot-rose' />
                                                        <span className='apex-skel-line-short' />
                                                    </div>
                                                    <div className='apex-skel-line-title' />
                                                    <div className='apex-skel-tags'>
                                                        <div className='apex-skel-tag' />
                                                        <div className='apex-skel-tag' />
                                                    </div>
                                                    <div className='apex-skel-video-box'>
                                                        <video autoPlay muted loop playsInline preload="none">
                                                            <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-6-clouddevops.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* STAGE 2: Real Live 6-Card Dashboard */}
                                <div ref={interfaceStage2} className='interface__stage-2'>
                                    {/* 6 Core Service Cards Grid (In Android mode, middle column with 2 videos is centered, left & right are clipped) */}
                                    <div ref={interfaceTasks} className='object tasks'>
                                        <div className='apex-tasks-grid-6'>
                                            {/* Column 1 (Left) - Card 1 (Top Left) */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-blue' />Web Development</span>
                                                    <span>01</span>
                                                </div>
                                                <span className='apex-card-main-title'>Full Stack Web Development</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-blue'>Next.js</span>
                                                    <span className='apex-service-tag tag-cyan'>React</span>
                                                    <span className='apex-service-tag tag-purple'>Node</span>
                                                </div>
                                                <div className='apex-card-video-box'>
                                                    <video autoPlay muted loop playsInline preload="none">
                                                        <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-1-fullstack.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>

                                            {/* Column 2 (Middle) - Card 2 (Top Middle Video) */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-green' />UI / UX</span>
                                                    <span>02</span>
                                                </div>
                                                <span className='apex-card-main-title'>UI / UX Design</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-green'>Figma</span>
                                                    <span className='apex-service-tag tag-cyan'>Design System</span>
                                                    <span className='apex-service-tag tag-amber'>Wireframes</span>
                                                </div>
                                                <div className='apex-card-video-box'>
                                                    <video autoPlay muted loop playsInline preload="none">
                                                        <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-2-uiux.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>

                                            {/* Column 3 (Right) - Card 3 (Top Right) */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-cyan' />Mobile Apps</span>
                                                    <span>03</span>
                                                </div>
                                                <span className='apex-card-main-title'>Android &amp; iOS App Development</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-cyan'>iOS / Android</span>
                                                    <span className='apex-service-tag tag-blue'>React Native</span>
                                                </div>
                                                <div className='apex-card-video-box'>
                                                    <video autoPlay muted loop playsInline preload="none">
                                                        <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-3-mobileapps.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>

                                            {/* Column 1 (Left) - Card 4 (Bottom Left) */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-amber' />AI &amp; Automation</span>
                                                    <span>04</span>
                                                </div>
                                                <span className='apex-card-main-title'>AI Models, Agents &amp; Automations</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-amber'>AI Models</span>
                                                    <span className='apex-service-tag tag-purple'>AI Agents</span>
                                                    <span className='apex-service-tag tag-cyan'>Automations</span>
                                                </div>
                                                <div className='apex-card-video-box'>
                                                    <video autoPlay muted loop playsInline preload="none">
                                                        <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-5-aiml.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>

                                            {/* Column 2 (Middle) - Card 5 (Slot Host: Single video rendered by ServiceSlider) */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-purple' />Software</span>
                                                    <span>05</span>
                                                </div>
                                                <span className='apex-card-main-title'>Custom Software Development</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-purple'>Enterprise</span>
                                                    <span className='apex-service-tag tag-blue'>APIs</span>
                                                    <span className='apex-service-tag tag-green'>Backend</span>
                                                </div>
                                                <div className='apex-card-video-box' />
                                            </div>

                                            {/* Column 3 (Right) - Card 6 (Bottom Right) */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-rose' />Cloud &amp; DevOps</span>
                                                    <span>06</span>
                                                </div>
                                                <span className='apex-card-main-title'>Cloud &amp; DevOps Architecture</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-rose'>Cloud</span>
                                                    <span className='apex-service-tag tag-blue'>Docker</span>
                                                    <span className='apex-service-tag tag-green'>CI/CD</span>
                                                </div>
                                                <div className='apex-card-video-box'>
                                                    <video autoPlay muted loop playsInline preload="none">
                                                        <source src='/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-6-clouddevops.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Header (Fades out when shrinking to mobile) */}
                                    <div ref={interfaceDHeader} className='object d-header'>
                                        <div className='apex-dheader-inner'>
                                            <div className='apex-dheader-nav'>
                                                <span className='active'>Services</span>
                                                <span>Work</span>
                                                <span>About</span>
                                            </div>
                                            <div className='apex-dheader-search'>
                                                <span>Search...</span>
                                            </div>
                                            <div className='apex-dheader-right'>
                                                <button type="button" className='apex-btn-add'>+ Build With Us</button>
                                                <div className='apex-user-avatar'>AT</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other Options / Filter Bar */}
                                    <div ref={interfaceOtherOps} className='object options'>
                                        <div className='apex-options-inner'>
                                            <div className='apex-opt-pill active'>All 6 Services</div>
                                            <div className='apex-opt-pill'>Development</div>
                                            <div className='apex-opt-pill'>Design &amp; AI</div>
                                        </div>
                                    </div>

                                    {/* Compatibility Ref Anchor for Upper Row (Hidden) */}
                                    <div ref={interfaceRow} className='object row' style={{ display: 'none' }} />

                                    {/* Main Title Area (Centers at top of phone in mobile mode) */}
                                    <div ref={interfaceTitle} className='object title'>
                                        <div className='apex-title-inner'>
                                            <span className='apex-dep-label'>Agency: ApexTechEra</span>
                                            <span className='apex-main-title'>What Services We Provide</span>
                                        </div>
                                    </div>

                                    {/* Sidebar */}
                                    <div ref={interfaceSidebar} className='object sidebar'>
                                        <div className='apex-sidebar-inner'>
                                            <div className='apex-sidebar-icons'>
                                                <div className='apex-side-icon active'>💻</div>
                                                <div className='apex-side-icon'>📱</div>
                                                <div className='apex-side-icon'>🎨</div>
                                                <div className='apex-side-icon'>⚙️</div>
                                            </div>
                                            <div className='apex-side-bottom'>✦</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Stage 3 Phone Screen Overlay */}
                                <div ref={interfaceStage3} className='interface__stage-3' style={{ pointerEvents: 'none' }}>
                                    <div className='apex-phone-notch-bar'>
                                        <div className='apex-phone-notch-pill'></div>
                                    </div>
                                    <div ref={interfaceMOps} className='object options' style={{ display: 'none' }} />
                                    <div ref={interfaceMHeader} className='object m-header'>
                                        <div className='apex-mheader-inner'>
                                            <div className='apex-mheader-logo'>
                                                <img 
                                                    src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/interface/apex-logo.png'} 
                                                    alt="Logo" 
                                                    className='apex-mheader-img'
                                                />
                                                <span className='apex-mheader-text'>ApexTechEra</span>
                                            </div>
                                            <span className='apex-mheader-badge'>Mobile</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Left Brand Logo (Desktop) */}
                                <div ref={interfaceLogo} className='logo'>
                                    <img 
                                        src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/interface/apex-logo.png'} 
                                        width={34} 
                                        height={34} 
                                        alt="ApexTechEra Logo" 
                                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Persistent slot for service video flow */}
                    <div ref={interfaceSlot} className='interface__slot'>
                        <ServiceSlider />
                    </div>
                </div>
            </div>
        </Animate>
    )
}

export default Interface
