import dynamic from "next/dynamic"
import Header from "../shared/Header/Header"
import Main from "./components/Main/Main"
import { HeroSection } from "../../www.apextechera.com-e7b86841/root-8a5edab2/HeroSection"

import Modal from "../shared/Modal/Modal"

import Create from "./components/Create/Create"
import Cursor from "../shared/Cursor/Cursor"

import Jumper from "../shared/Jumper/Jumper"

import Controller from "../../../../lib/sites/apextechera-design-fc4b5892/Controller/Controller"
import Sections from "../../../../lib/sites/apextechera-design-fc4b5892/Controller/Sections" 
import { screens } from "./constants"

import FormBlock from "./components/RequestForm/components/FormBlock"
import { useContext, useEffect } from "react";
import { BreakpointsContext } from "../../../../lib/sites/apextechera-design-fc4b5892/context/breakpointsContext"
import renderer from "../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/renderer"
import { startVideoGate } from "../../../../lib/sites/apextechera-design-fc4b5892/utils/videoGate"
import { FixedControls } from "../shared/FixedControls/fixed-controls"

const load = (loader) => dynamic(loader, { ssr: false })

const About = load(() => import("./components/About/About"))
const Following = load(() => import("./components/Following/Following"))
const Startups = load(() => import("./components/Startups/Startups"))
const SkillJourney = load(() => import("./components/SkillJourney/SkillJourney"))
const WhatCreate = load(() => import("./components/WhatCreate/WhatCreate"))
const TechReelGallery = load(() => import("./components/TechReelGallery/TechReelGallery"))
const TechStackBreakdown = load(() => import("./components/TechStackBreakdown/TechStackBreakdown"))
const Designers = load(() => import("./components/Designers/Designers"))
const MeetFounder = load(() => import("./components/MeetFounder/MeetFounder"))
const FocusSection = load(() => import("./components/FocusSection/FocusSection"))
const DesignTypes = load(() => import("./components/DesignTypes/DesignTypes"))
const WebsiteTypes = load(() => import("./components/WebsiteTypes/WebsiteTypes"))
const Courses = load(() => import("./components/Courses/Courses"))
const Portfolio = load(() => import("./components/Portfolio/Portfolio"))
const Footer = load(() => import("../shared/Footer/Footer"))

const Home = () => {
  useEffect(() => {
      renderer.startRender();
      renderer.subscribeMouse();
      startVideoGate();

      // Empty deps: must only mount/unmount once. Re-running this effect on
      // every render used to add extra render loops (see renderer.js guard).
      return () => {
          renderer.stopRender();
          renderer.unsubscribeMouse();
      };
  }, []);

  const { isMaxWidth } = useContext(BreakpointsContext)

  return (
    <>
      <Controller 
        duration={700} 
        externalDelay={500} 
        externalDuration={400} 
      >
        <Header/>
        <Sections>
          <Main id={screens.MAIN} />
          <HeroSection id={screens.APEXTECHERA} />
          <About id={screens.ABOUT} />
          <Following id={screens.FOLLOWED} />
          <Startups id={screens.STARTUPS} />
          <SkillJourney id={screens.SKILLJOURNEY} />
          <WhatCreate id={screens.WHATCREATE} />
          <TechReelGallery />
          <TechStackBreakdown id={screens.TECHBREAKDOWN} />
          <MeetFounder id={screens.FOUNDER} />
          <FocusSection id={screens.FOCUS} />
          <DesignTypes id={screens.DESIGNTYPES} />
          <WebsiteTypes id={screens.WEBSITETYPES} />
          <Courses id={screens.COURSES} />
          <Designers id={screens.DESIGNERS} />
          <Portfolio id={screens.PORTFOLIO} />
          <Footer id={screens.FOOTER} />
        </Sections>
        <Create />
        <Jumper />
        <Cursor />
        <Modal />
      { isMaxWidth.mobile && <FormBlock fixed={true} />}
      </Controller>
      <FixedControls />
    </>
  );
};

export default Home;
