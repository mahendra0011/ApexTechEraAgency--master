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
                                                {/* Skeleton Card 1: Full Stack Web */}
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
                                                        <video autoPlay muted loop playsInline preload="metadata">
                                                            <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-1-fullstack.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>

                                                {/* Skeleton Card 2 */}
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
                                                        <video autoPlay muted loop playsInline preload="metadata">
                                                            <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-2-uiux.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>

                                                {/* Skeleton Card 3 */}
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
                                                        <video autoPlay muted loop playsInline preload="metadata">
                                                            <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-3-mobileapps.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>

                                                {/* Skeleton Card 4: AI & ML */}
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
                                                        <video autoPlay muted loop playsInline preload="metadata">
                                                            <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-5-aiml.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>

                                                {/* Skeleton Card 5: Cloud & DevOps */}
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
                                                    <div className='apex-skel-video-box'>
                                                        <video autoPlay muted loop playsInline preload="metadata">
                                                            <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-6-clouddevops.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>

                                                {/* Skeleton Card 6 */}
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
                                                        <video autoPlay muted loop playsInline preload="metadata">
                                                            <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-4-customsoftware.mp4' type='video/mp4' />
                                                        </video>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* STAGE 2: Real Live 6-Card Dashboard */}
                                <div ref={interfaceStage2} className='interface__stage-2'>
                                    {/* 6 Core Service Cards Grid */}
                                    <div ref={interfaceTasks} className='object tasks'>
                                        <div className='apex-tasks-grid-6'>
                                            {/* Card 1: Full Stack Web */}
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
                                                    <video autoPlay muted loop playsInline preload="metadata">
                                                        <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-1-fullstack.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>

                                            {/* Card 2: UI/UX Design */}
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
                                                    <video autoPlay muted loop playsInline preload="metadata">
                                                        <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-2-uiux.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>

                                            {/* Card 3: Mobile Apps */}
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
                                                    <video autoPlay muted loop playsInline preload="metadata">
                                                        <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-3-mobileapps.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>

                                            {/* Card 4: AI / ML Models */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-amber' />AI &amp; ML</span>
                                                    <span>04</span>
                                                </div>
                                                <span className='apex-card-main-title'>Build AI / ML Models</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-amber'>AI/ML</span>
                                                    <span className='apex-service-tag tag-purple'>LLMs</span>
                                                    <span className='apex-service-tag tag-cyan'>Python</span>
                                                </div>
                                                <div className='apex-card-video-box'>
                                                    <video autoPlay muted loop playsInline preload="metadata">
                                                        <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-5-aiml.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>

                                            {/* Card 5: Cloud & DevOps */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-rose' />Cloud &amp; DevOps</span>
                                                    <span>05</span>
                                                </div>
                                                <span className='apex-card-main-title'>Cloud &amp; DevOps Architecture</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-rose'>Cloud</span>
                                                    <span className='apex-service-tag tag-blue'>Docker</span>
                                                    <span className='apex-service-tag tag-green'>CI/CD</span>
                                                </div>
                                                <div className='apex-card-video-box'>
                                                    <video autoPlay muted loop playsInline preload="metadata">
                                                        <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-6-clouddevops.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>

                                            {/* Card 6: Custom Software */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-purple' />Software</span>
                                                    <span>06</span>
                                                </div>
                                                <span className='apex-card-main-title'>Custom Software Development</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-purple'>Enterprise</span>
                                                    <span className='apex-service-tag tag-blue'>APIs</span>
                                                    <span className='apex-service-tag tag-green'>Backend</span>
                                                </div>
                                                <div className='apex-card-video-box'>
                                                    <video autoPlay muted loop playsInline preload="metadata">
                                                        <source src='/sites/qclay-design-fc4b5892/root-8a5edab2/video/services/service-4-customsoftware.mp4' type='video/mp4' />
                                                    </video>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Header */}
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

                                    {/* Main Title Area */}
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

                                {/* Mobile Stage */}
                                <div ref={interfaceStage3} className='interface__stage-3'>
                                    <div ref={interfaceMOps} className='object options'>
                                        <div className='apex-col-card' style={{ height: '100%' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>ApexTechEra Mobile</span>
                                            <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>iOS &amp; Android Apps • UI/UX Design</span>
                                        </div>
                                    </div>
                                    <div ref={interfaceMHeader} className='object m-header'>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', height: '100%' }}>
                                            <img 
                                                src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/interface/apex-logo.png'} 
                                                alt="Logo" 
                                                style={{ width: '18px', height: '18px', borderRadius: '4px', position: 'static' }} 
                                            />
                                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>ApexTechEra</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Left Brand Logo */}
                                <div ref={interfaceLogo} className='logo'>
                                    <img 
                                        src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/interface/apex-logo.png'} 
                                        width={34} 
                                        height={34} 
                                        alt="ApexTechEra Logo" 
                                        style={{ borderRadius: '6px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*
                        The slot is the single, persistent video surface.  Its
                        position/size is still driven by the original timeline,
                        while scrolling through it swaps the six service videos.
                    */}
                    <div ref={interfaceSlot} className='interface__slot'>
                        <ServiceSlider />
                    </div>
                </div>
            </div>
        </Animate>
    )
}

export default Interface
