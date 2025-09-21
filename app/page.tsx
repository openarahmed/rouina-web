import CoreFeatures from "./components/CoreFeeature";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CoreFeatures></CoreFeatures>
      <ProductShowcase></ProductShowcase>
      {/* You can add other sections like Features, Testimonials, etc., here later */}
      {/* For example: <FeaturesSection /> */}
    </>
  );
}