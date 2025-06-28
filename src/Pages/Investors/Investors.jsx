import React from "react";
import InvestorsHero from "../../Components/Investor/InvestorsHero";
import bg from "../../assets/footer-bg.svg";

const Investors = () => {
  return (
    <div className="relative" style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white absolute h-full w-full z-0 bg-opacity-90"></div>
      <InvestorsHero />
    </div>
  );
};

export default Investors;
