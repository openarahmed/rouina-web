import CoreFeatures from "../components/CoreFeeature";
import Hero from "../components/Hero";
import ProductShowcase from "../components/ProductShowcase";
import PricingPage from "../components/PricingPage";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import FeaturesSection from "../components/Features";


export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection></FeaturesSection>
      <Testimonials></Testimonials>
      <FAQ></FAQ>

      <PricingPage></PricingPage>
      {/* <CoreFeatures></CoreFeatures> */}
      {/* <ProductShowcase></ProductShowcase> */}
      {/* You can add other sections like Features, Testimonials, etc., here later */}
      {/* For example: <FeaturesSection /> */}
    </>
  );
}