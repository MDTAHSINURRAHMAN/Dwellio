import React from "react";
import Navbar from "../../components/shared/Navbar";
import AdvertisementSection from "./AdvertisementSection";
import LatestReview from "./LatestReview";
import Banner from "../../components/Banner";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";
import AboutSection from "../../components/AboutSection";
import WhyChooseUs from "../../components/home/WhyChooseUs";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home | Dwellio</title>
      </Helmet>
      <Navbar />
      <Banner />
      <AboutSection />
      <AdvertisementSection />
      <LatestReview />
      <WhyChooseUs />
      <Footer></Footer>
    </>
  );
};

export default Home;
