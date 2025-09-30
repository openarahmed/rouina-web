import CoreFeatures from "./components/CoreFeeature";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";
import PricingPage from "./components/PricingPage";
import FAQ from "./components/FAQ";
import Testimonials from "./components/Testimonials";


export default function HomePage() {
  return (
    <>
      <Hero />
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