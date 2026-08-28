import Header from "../shared/Header/Header"
import Main from "./components/Main/Main"
import { HeroSection } from "../../www.apextechera.com-e7b86841/root-8a5edab2/HeroSection"
import About from "./components/About/About"
import SkillJourney from "./components/SkillJourney/SkillJourney"
import WhatCreate from "./components/WhatCreate/WhatCreate"
import TechReelGallery from "./components/TechReelGallery/TechReelGallery"
import TechStackBreakdown from "./components/TechStackBreakdown/TechStackBreakdown"
import Designers from "./components/Designers/Designers"
import MeetFounder from "./components/MeetFounder/MeetFounder"
import FocusSection from "./components/FocusSection/FocusSection"
import DesignTypes from "./components/DesignTypes/DesignTypes"
import WebsiteTypes from "./components/WebsiteTypes/WebsiteTypes"

import Courses from "./components/Courses/Courses"
import Portfolio from "./components/Portfolio/Portfolio"
import Startups from "./components/Startups/Startups"
import Following from "./components/Following/Following"
import Footer from "../shared/Footer/Footer"
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
import { FixedControls } from "../shared/FixedControls/fixed-controls"

const Home = () => {
  useEffect(() => {
      renderer.startRender();
      renderer.subscribeMouse();

      return () => {
          renderer.stopRender();
          renderer.unsubscribeMouse();
      };
  });

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
