import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Import New Modular Components
import { Navbar } from './Landing/navbar';
import { HeroSection } from './Landing/hero-section';
import { StatsSection } from './Landing/stats-section';
import { MultimodalSection } from './Landing/multimodal-section';
import { FeaturesSection } from './Landing/features-section';
import { HowItWorksSection } from './Landing/how-it-works-section';
import { TestimonialsSection } from './Landing/testimonials-section';
import { CTASection } from './Landing/cta-section';
import { Footer } from './Landing/footer';

const LandingPage = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/reviews`);
                setReviews(res.data);
            } catch (err) {
                console.error('Reviews loading error:', err);
            }
        };
        fetchReviews();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <HeroSection />
                <StatsSection />
                <MultimodalSection />
                <FeaturesSection />
                <HowItWorksSection />
                <TestimonialsSection reviews={reviews} />
                <CTASection />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;


