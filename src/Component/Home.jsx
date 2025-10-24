import React from "react";
import OfferZone from "./Offerzone";  
import Collection from "./Collection";
import SuitSet from "./SuitSet";
import ExploreAndBuy from "./ExploreAndBuy";
import Footer1 from "./Footer/Footer1";
import About from "./Information/About";
import BlogPage from "./Information/BlogPage";

const Home = () => {
  return (
    <div className="bg-gray-50">
      <OfferZone />
      <Collection />
      <SuitSet />
      <ExploreAndBuy />
      <Footer1 />
      <BlogPage />
    </div>
  );
};

export default Home;
