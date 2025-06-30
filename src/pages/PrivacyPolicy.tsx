import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
          <h1 className="text-4xl font-serif font-bold">Privacy Policy</h1>
          <p className="text-primary-foreground/80 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4">
              At Tiffany Sparkles, we collect information you provide directly
              to us, such as when you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Subscribe to our newsletter</li>
              <li>Contact us through our contact form</li>
              <li>Follow us on social media</li>
              <li>Visit our store locations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Send you newsletters and promotional materials</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our products and services</li>
              <li>Communicate with you about our products and services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Information Sharing
            </h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this privacy policy. We may share your information
              with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                Service providers who assist us in operating our website and
                conducting our business
              </li>
              <li>
                Legal authorities when required by law or to protect our rights
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Data Security
            </h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Cookies
            </h2>
            <p className="text-muted-foreground">
              Our website may use cookies to enhance your experience. You can
              choose to disable cookies through your browser settings, but this
              may affect the functionality of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Your Rights
            </h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Unsubscribe from our newsletters at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Contact Information
            </h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-foreground font-medium">Tiffany Sparkles</p>
              <p className="text-muted-foreground">
                Email: info@tiffany-sparkles.com
              </p>
              <p className="text-muted-foreground">
                Phone: +254 718 151 622 || +447933901040
              </p>
              <p className="text-muted-foreground">
                Address: Dinesh Gupta Limited
                
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
