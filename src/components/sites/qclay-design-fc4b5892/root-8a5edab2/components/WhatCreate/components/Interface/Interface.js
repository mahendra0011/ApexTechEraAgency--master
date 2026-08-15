import { useRef } from 'react'

import { ServiceSlider, ServiceTag } from "./ServiceSlider"
import Animate from "./Animate"
import './ApexDashboard.css'

const Interface = ({ parent, parentRefs }) => {

    const interfaceInterface = useRef()

    const interfaceContainer = useRef()
    const interfaceContent = useRef()
    const interfaceStage1 = useRef()
    const interfaceStage2 = useRef()
    const interfaceStage3 = useRef()

    const interfaceTagContainer = useRef()

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
                        && tagContainer 
                        && mode && modeTrX
                        && dHeader && sidebar && otherOps
                        && row && title && tasks && mOps && mHeader && logo
                        && slot && mainInterface
                        && cursor1 && cursor2 && cursor3 && cursor4 && cursor5 && cursor6
        return { 
            mounted, slider, container, content, 
            view, stage1, stage2, stage3, grid, 
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
                                <div ref={interfaceStage1} className='interface__stage-1'>
                                    <div className='object apex-stage1-wrap'>
                                        {/* Header */}
                                        <div className='apex-stage1-header'>
                                            <div className='apex-stage1-brand'>
                                                <img 
                                                    src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/interface/apex-logo.png'} 
                                                    alt="ApexTechEra" 
                                                    style={{ width: '22px', height: '22px', borderRadius: '4px', position: 'static' }}
                                                />
                                                <span>ApexTechEra Agency</span>
                                            </div>
                                            <div className='apex-dheader-nav'>
                                                <span className='active'>Services</span>
                                                <span>Work</span>
                                                <span>About</span>
                                            </div>
                                            <div className='apex-dheader-right'>
                                                <button type="button" className='apex-btn-add'>+ Build With Us</button>
                                            </div>
                                        </div>

                                        {/* Title Row */}
                                        <div className='apex-stage1-title-row'>
                                            <div>
                                                <span className='apex-dep-label'>Agency: ApexTechEra</span>
                                                <div className='apex-main-title'>What Services We Provide</div>
                                            </div>
                                            <div className='apex-options-inner'>
                                                <div className='apex-opt-pill active'>All 6 Services</div>
                                                <div className='apex-opt-pill'>Development</div>
                                                <div className='apex-opt-pill'>Design &amp; AI</div>
                                            </div>
                                        </div>

                                        {/* 6 Grid Cards */}
                                        <div className='apex-stage1-grid-6'>
                                            <div className='apex-stage1-card'>
                                                <div className='apex-stage1-card-head'>
                                                    <span>● Web Development</span>
                                                    <span>01</span>
                                                </div>
                                                <span className='apex-stage1-card-title'>Full Stack Web Development</span>
                                                <p className='apex-stage1-card-desc'>Next.js • React • Node • Full-Stack</p>
                                            </div>

                                            <div className='apex-stage1-card'>
                                                <div className='apex-stage1-card-head'>
                                                    <span>● UI / UX</span>
                                                    <span>02</span>
                                                </div>
                                                <span className='apex-stage1-card-title'>UI / UX Design</span>
                                                <p className='apex-stage1-card-desc'>Figma • Design Systems • Wireframes</p>
                                            </div>

                                            <div className='apex-stage1-card active-slot'>
                                                <div className='apex-stage1-card-head'>
                                                    <span>● Mobile Apps</span>
                                                    <span>03</span>
                                                </div>
                                                <span className='apex-stage1-card-title'>Android &amp; iOS App Development</span>
                                                <p className='apex-stage1-card-desc'>React Native • iOS/Android • Mobile</p>
                                            </div>

                                            <div className='apex-stage1-card'>
                                                <div className='apex-stage1-card-head'>
                                                    <span>● Software</span>
                                                    <span>04</span>
                                                </div>
                                                <span className='apex-stage1-card-title'>Custom Software Development</span>
                                                <p className='apex-stage1-card-desc'>Enterprise • APIs • Cloud Backend</p>
                                            </div>

                                            <div className='apex-stage1-card'>
                                                <div className='apex-stage1-card-head'>
                                                    <span>● AI &amp; ML</span>
                                                    <span>05</span>
                                                </div>
                                                <span className='apex-stage1-card-title'>Build AI / ML Models</span>
                                                <p className='apex-stage1-card-desc'>Machine Learning • LLMs • Python</p>
                                            </div>

                                            <div className='apex-stage1-card'>
                                                <div className='apex-stage1-card-head'>
                                                    <span>● Cloud &amp; DevOps</span>
                                                    <span>06</span>
                                                </div>
                                                <span className='apex-stage1-card-title'>Cloud &amp; DevOps Architecture</span>
                                                <p className='apex-stage1-card-desc'>Docker • CI/CD • AWS/GCP</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                                <p className='apex-card-desc'>
                                                    Scalable web applications, modern SaaS platforms &amp; custom web portals.
                                                </p>
                                                <div className='apex-card-foot'>
                                                    <span style={{ fontSize: '0.6rem', color: '#64748b' }}>Active</span>
                                                    <button type="button" className='apex-btn-open'>Explore</button>
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
                                                <p className='apex-card-desc'>
                                                    Intuitive user experiences, modern interfaces &amp; interactive prototypes.
                                                </p>
                                                <div className='apex-card-foot'>
                                                    <span style={{ fontSize: '0.6rem', color: '#10b981' }}>Live</span>
                                                    <button type="button" className='apex-btn-open'>Review</button>
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
                                                <p className='apex-card-desc'>
                                                    Cross-platform &amp; native mobile apps built for performance and scale.
                                                </p>
                                                <div className='apex-card-foot'>
                                                    <span style={{ fontSize: '0.6rem', color: '#06b6d4' }}>Active</span>
                                                    <button type="button" className='apex-btn-open'>Explore</button>
                                                </div>
                                            </div>

                                            {/* Card 4: Custom Software */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-purple' />Software</span>
                                                    <span>04</span>
                                                </div>
                                                <span className='apex-card-main-title'>Custom Software Development</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-purple'>Enterprise</span>
                                                    <span className='apex-service-tag tag-blue'>APIs</span>
                                                    <span className='apex-service-tag tag-green'>Backend</span>
                                                </div>
                                                <p className='apex-card-desc'>
                                                    Robust custom software, backend architectures &amp; integrated APIs.
                                                </p>
                                                <div className='apex-card-foot'>
                                                    <span style={{ fontSize: '0.6rem', color: '#8b5cf6' }}>Ready</span>
                                                    <button type="button" className='apex-btn-open'>Launch</button>
                                                </div>
                                            </div>

                                            {/* Card 5: AI / ML Models */}
                                            <div className='apex-grid-card'>
                                                <div className='apex-card-top-head'>
                                                    <span><span className='dot dot-amber' />AI &amp; ML</span>
                                                    <span>05</span>
                                                </div>
                                                <span className='apex-card-main-title'>Build AI / ML Models</span>
                                                <div className='apex-card-tags'>
                                                    <span className='apex-service-tag tag-amber'>AI/ML</span>
                                                    <span className='apex-service-tag tag-purple'>LLMs</span>
                                                    <span className='apex-service-tag tag-cyan'>Python</span>
                                                </div>
                                                <p className='apex-card-desc'>
                                                    Intelligent machine learning models, automation &amp; custom AI solutions.
                                                </p>
                                                <div className='apex-card-foot'>
                                                    <span style={{ fontSize: '0.6rem', color: '#f59e0b' }}>Production</span>
                                                    <button type="button" className='apex-btn-open'>Explore</button>
                                                </div>
                                            </div>

                                            {/* Card 6: Cloud & DevOps */}
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
                                                <p className='apex-card-desc'>
                                                    High-availability cloud infrastructure, security &amp; automated deployments.
                                                </p>
                                                <div className='apex-card-foot'>
                                                    <span style={{ fontSize: '0.6rem', color: '#f43f5e' }}>Secured</span>
                                                    <button type="button" className='apex-btn-open'>Deploy</button>
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

                    {/* Video Slot: 6-service MorphSlider preview */}
                    <div ref={interfaceSlot} className='interface__slot'>
                        <ServiceSlider />
                    </div>
                </div>

                {/* Animated Service Tags at Bottom (white card - synced to active video) */}
                <div ref={interfaceTagContainer} className='interface__tag'>
                    <ServiceTag />
                </div>
            </div>
        </Animate>
    )
}

export default Interface