import { ShieldCheck, RefreshCcw, Headphones, Truck } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: "Secure Checkout",
    description: "Your payment is protected with top-grade encryption.",
  },
  {
    icon: <RefreshCcw className="w-8 h-8 text-white" />,
    title: "30-Day Guarantee",
    description: "Not satisfied? Return it within 30 days, hassle-free.",
  },
  {
    icon: <Headphones className="w-8 h-8 text-white" />,
    title: "Always Here for You",
    description: "Our support team is available 24/7 to help you.",
  },
  {
    icon: <Truck className="w-8 h-8 text-white" />,
    title: "Free Shipping",
    description: "Enjoy free delivery on all orders over $80.",
  },
];

export default function FeatureHighlights() {
  return (
    <div className="bg-gradient-to-r from-[#1F2937] via-[#3B82F6] to-[#1F2937] p-10 rounded-2xl shadow-xl text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <AnimatedFeatureCard key={index} index={index} {...feature} />
        ))}
      </div>
    </div>
  );
}

// Reusable animated card component
function AnimatedFeatureCard({ icon, title, description, index }: any) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: index * 0.2 },
      });
    }
  }, [controls, inView, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      className="flex items-start gap-4"
    >
      <div className="p-3 bg-white/10 rounded-full shadow-inner backdrop-blur-sm">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-sm text-gray-200">{description}</p>
      </div>
    </motion.div>
  );
}
