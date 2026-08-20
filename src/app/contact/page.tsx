import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="flex-1 w-full pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-deep mb-4">Contact Us</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            We are here to help. Reach out to us for appointments, general inquiries, or emergency assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="flex flex-col gap-8">
            <div className="bg-emerald-soft/30 p-8 rounded-[2rem] border border-emerald-teal/10">
              <h3 className="text-2xl font-serif text-emerald-deep mb-6">Get in Touch</h3>
              
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-emerald-teal flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-deep mb-1">Phone</h4>
                    <p className="text-text-muted">7889XXXXX (General)</p>
                    <p className="text-emerald-teal font-medium mt-1">7889XXXXX (Emergency 24/7)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-emerald-teal flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-deep mb-1">Email</h4>
                    <p className="text-text-muted">xyz@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-emerald-teal flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-deep mb-1">Address</h4>
                    <p className="text-text-muted">Haya Wellness Centre<br/>Demo Address, Demo City</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-emerald-teal flex items-center justify-center shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-deep mb-1">Working Hours</h4>
                    <p className="text-text-muted">Mon-Fri: 8:00 AM - 8:00 PM</p>
                    <p className="text-text-muted">Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-text-muted">Sunday: Emergency Only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-lg h-[500px] lg:h-auto border border-gray-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113926.85501831885!2d74.79737190000002!3d34.083652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e18f98f980142b%3A0x63321db8530fb106!2sSrinagar!5e0!3m2!1sen!2sin!4v1711234567890!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
}
