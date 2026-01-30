"use client";
import { faqs, trustLogos } from "@/lib/constant";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-black mb-12">
            Trusted by millions since 2010
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {trustLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-16 text-black font-medium text-sm opacity-60 hover:opacity-80 transition-opacity duration-200"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ section */}

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card border border-border">
                <CardContent className="p-0">
                  <button
                    className="w-full px-6 py-4 text-left text-black flex items-center justify-between hover:bg-accent/50 transition-colors duration-200"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span className="text-lg font-medium text-black pr-4">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-black transform transition-transform duration-200 flex-shrink-0 ${
                        openFAQ === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {openFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;