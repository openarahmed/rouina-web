import Hero from "../components/Hero";
import PricingPage from "../components/PricingPage";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import FeaturesSection from "../components/Features";


export default function HomePage() {
    return (
        <>
            <Hero />
            <FeaturesSection></FeaturesSection>
            <PricingPage></PricingPage>
            <Testimonials></Testimonials>
            <FAQ></FAQ>

         
        </>
    );
}
