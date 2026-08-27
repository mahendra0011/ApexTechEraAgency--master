import React from 'react';
import './Jumper.css';

const Jumper = () => {
    return (
        <div className='jumper'>
            <div className='jumper__circle'>
                <div className='jumper-wrapper'>
                    {/* Ambient Glow */}
                    <div className='jumper-ambient-glow' />

                    {/* Concentric Luxury Orbit Rings */}
                    <div className='jumper-ring jumper-ring--outer' />
                    <div className='jumper-ring jumper-ring--inner' />

                    {/* Central 3D Metallic Emblem */}
                    <div className='jumper-logo-container'>
                        <img
                            src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/apextechera-logo.png"
                            alt="ApexTechEra Agency"
                            className='jumper-brand-image'
                        />
                        <div className='jumper-line-accent' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jumper;