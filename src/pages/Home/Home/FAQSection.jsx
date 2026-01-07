import React from "react";

const FAQSection = () => {
  return (
    <section className="py-16 ">
      <div className="max-w-4xl mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-secondary mb-3">
            Frequently Asked Question (FAQ)
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Enhance posture, mobility, and well-being effortlessly with Posture Pro.
            Achieve proper alignment, reduce pain, and strengthen your body with ease!
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">

          <div className="collapse collapse-arrow bg-white shadow-md rounded-xl">
            <input type="radio" name="faq-accordion" defaultChecked />
            <div className="collapse-title text-base sm:text-lg font-medium text-secondary">
              How does this posture corrector work?
            </div>
            <div className="collapse-content text-gray-600 text-sm sm:text-base">
              <p>
                The posture corrector gently aligns your shoulders and spine into a
                natural position, training your muscles over time to maintain proper posture.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white shadow-md rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-base sm:text-lg font-medium text-secondary">
              Is it suitable for all ages and body types?
            </div>
            <div className="collapse-content text-gray-600 text-sm sm:text-base">
              <p>
                Yes, it is designed with adjustable straps to comfortably fit most body
                types and can be used by teenagers and adults alike.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white shadow-md rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-base sm:text-lg font-medium text-secondary">
              Does it really help with back pain and posture improvement?
            </div>
            <div className="collapse-content text-gray-600 text-sm sm:text-base">
              <p>
                Regular use helps reduce slouching, relieve back and shoulder strain,
                and gradually improves overall posture and comfort.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white shadow-md rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-base sm:text-lg font-medium text-secondary">
              Does it have smart features like vibration alerts?
            </div>
            <div className="collapse-content text-gray-600 text-sm sm:text-base">
              <p>
                Some models include smart vibration alerts that gently notify you when
                you slouch, helping you correct your posture in real time.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white shadow-md rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-base sm:text-lg font-medium text-secondary">
              How will I be notified when the product is back in stock?
            </div>
            <div className="collapse-content text-gray-600 text-sm sm:text-base">
              <p>
                You can sign up for notifications using your email, and we will alert
                you as soon as the product becomes available again.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;
