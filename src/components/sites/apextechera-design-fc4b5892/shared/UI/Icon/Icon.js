const Icon = ({id, onClick, className}) => {
  switch (id) {
    case "logo":
      return (
        <div
          className={className}
          onClick={onClick}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginLeft: '20px' }}
        >
          <img
            src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/apextechera-logo.png"
            alt="ApexTechEra Agency"
            style={{ height: '42px', width: 'auto' }}
          />
          <span className="header__logo-text" style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
            ApexTechEra Agency
          </span>
        </div>
      );

    default:
      break;
  }
};

export default Icon;
