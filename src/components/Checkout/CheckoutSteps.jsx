import React from "react";
import "./CheckoutSteps.css";

const steps = ["Carrito", "Información", "Pago"];

const CheckoutSteps = ({ currentStep }) => {
  return (
    <div className="checkout-steps-bar">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <React.Fragment key={index}>
            <div
              className={`step-item ${isActive ? "active" : ""} ${
                isCompleted ? "completed" : ""
              }`}
            >
              <div className="step-circle">
                {isCompleted ? "✓" : stepNumber}
              </div>
              <span className="step-label">{label}</span>
            </div>
            {stepNumber !== steps.length && <div className="step-line" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;