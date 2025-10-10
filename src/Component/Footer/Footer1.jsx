import React from "react";
import { Truck, Headphones, ShieldCheck, Mail } from "lucide-react";

export default function Footer1() {
  return (
    <footer className="bg-black text-gray-100 mt-4">
      <div className="max-w-8xl mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-lg bg-gray-800 mb-4 sm:mb-6">
              <Truck size={32} />
            </div>
            <h3 className="text-lg font-semibold">Free Shipping</h3>
            <p className="text-sm text-gray-300">
              On all orders over ₹999 — fast & tracked
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-3 rounded-lg bg-gray-800 mb-4 sm:mb-6">
              <Headphones size={32} />
            </div>
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <p className="text-sm text-gray-300">
              Mon–Fri: 10am–6pm • Live chat & phone
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-3 rounded-lg bg-gray-800 mb-4 sm:mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-lg font-semibold">Secure Payments</h3>
            <p className="text-sm text-gray-300">
              PCI-compliant payment gateway & encryption
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-3 rounded-lg bg-gray-800 mb-4 sm:mb-6">
              <Mail size={32} />
            </div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="text-sm text-gray-300">
              Email: <a href="mailto:support@example.com" className="underline">contact@navdana.com</a>
            </p>
            <p className="text-sm text-gray-300">
              Phone: <a href="tel:+919311120477" className="underline">+91 9311120477</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
