import React, { useState } from 'react';
import '../styles/PricingComponent.css'; // Assuming you have the CSS in this file

const PricingComponent = () => {
  // State for switching between monthly and yearly plans
  const [isMonthly, setIsMonthly] = useState(true);

  // Function to toggle between monthly and yearly
  const togglePlanDuration = () => {
    setIsMonthly(!isMonthly);
  };

  return (
    <div>
    
      {/* Pricing Section */}
      <section className="pricing">
        <header className="pricing__header">
          <h1 className="pricing__title">Pricing plans</h1>
          <h5 className="pricing__subtitle">
            First 30 days absolutely <span className="accent-1">free</span> for any plan, no credit card required to get started.
          </h5>

          
        </header>

        {/* Plan Options */}
        <article className="plans">
          <div className="plans__list">
            <PlanItem
              title="Freelance"
              price={isMonthly ? 5 : 50}
              features={['Assistance with stopping your addiction and more', 'Limited access']}
            />
            <PlanItem
              title="Teams"
              price={isMonthly ? 20 : 200}
              features={['Faster and more data updated', 'Collaboration mode', 'Up to 10 users', 'file uploads, vision, web browsing, and image generation']}
              isActive
            />
            <PlanItem
              title="Enterprise"
              price={isMonthly ? 80 : 800}
              features={['Team space', 'Unlimited users', 'All features']}
            />
          </div>

          
        </article>

      </section>
    </div>
  );
};

// PlanItem component
const PlanItem = ({ title, price, features, isActive }) => (
  <article className={`plan__item ${isActive ? 'plan__item--active' : ''}`}>
    <div className="plan__header">
      <h2 className="plan__title">{title}</h2>
      <h1 className="plan__price">{price}</h1>
    </div>
    <ul className="plan__feature-list">
      {features.map((feature, index) => (
        <li key={index} className="plan__feature-item">
          {feature}
        </li>
      ))}
    </ul>
    <a href="#" className={`plan__cta-link ${isActive ? 'plan__cta-link--active' : ''}`}>
      Get Started
    </a>
  </article>
);

export default PricingComponent;
