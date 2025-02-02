import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ImageMetadata } from "astro";
import { WaveBackground } from "./WaveBackground";

// Import images
import litzWireImage from "@/assets/litz-wire-removebg-preview.png";
import singleInsulatedImage from "@/assets/single_insulated-removebg-preview.png";
import doubleInsulatedImage from "@/assets/double_insulated-removebg-preview.png";
import tripleInsulatedImage from "@/assets/triple_insulated-removebg-preview.png";

const features = [
  {
    name: "Single Insulated",
    description:
      "Rubadue wire manufactures several wire with a single layer of insulation.",
    image: singleInsulatedImage,
  },
  {
    name: "Double Insulated",
    description:
      "Rubadue wire manufactures several double insulated wires to be used in supplementary isolation applications",
    image: doubleInsulatedImage,
  },
  {
    name: "Triple Insulated",
    description:
      "Rubadue wire was the first company to design and manufacture triple insulated wires.",
    image: tripleInsulatedImage,
  },
  {
    name: "Bare Litz",
    description:
      "Litz wire is made of several strands of enameled magnet wire that are bunched or stranded together.",
    image: litzWireImage,
  },
];

const variants = {
  enter: {
    x: 1000,
    opacity: 0,
    scale: 0.9,
  },
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    x: 1000,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export default function CableSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="relative overflow-hidden bg-background py-24 sm:py-32">
      <WaveBackground opacity={20} rotate={-10} />
      <div className="mx-auto container relative">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="">
              <h2 className="text-xl font-display  text-accent-foreground">
                Wire <span className="text-primary">Types</span>
              </h2>
              <p className="mt-2 text-pretty text-4xl  font-semibold  text-foreground sm:text-5xl">
                Cables to Meet Your Needs.
              </p>
              <p className="mt-6 text-lg/8 text-muted-foreground">
                Browse a wide variety of specialty cables. All cable components
                can be adapted to meet your requirements.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-muted-foreground lg:max-w-none">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    className="relative cursor-pointer select-none"
                    onHoverStart={() => setActiveFeature(index)}
                    animate={{
                      color:
                        activeFeature === index
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted-foreground))",
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <dt className="inline font-semibold text-foreground">
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
          <div className="relative w-[48rem] aspect-[16/10] sm:w-[57rem] overflow-hidden">
            <div className="absolute inset-0">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeFeature}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <img
                    src={features[activeFeature].image.src}
                    alt={`${features[activeFeature].name} product image`}
                    width={2432}
                    height={1442}
                    className="w-full h-full object-contain "
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
