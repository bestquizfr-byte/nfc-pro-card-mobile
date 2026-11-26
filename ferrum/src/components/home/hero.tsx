"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { btn } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/lifestyle/hero-deadlift.webp"
        alt="Athlète en position de départ au soulevé de terre, genouillères aux genoux"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-[60%_50%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-iron-950 via-iron-950/80 to-iron-950/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-iron-950 to-transparent" />
      <div className="mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <motion.h1
          className="display max-w-3xl text-[clamp(3.6rem,11vw,8.5rem)] font-extrabold"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          Forgé pour
          <br />
          la charge.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
        >
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-chalk/85 sm:text-xl">
            Ceintures à levier, sangles, genouillères 7 mm. L&apos;équipement qui tient quand tu passes au-dessus de ton record.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className={btn.primary}>
              Voir la boutique
            </Link>
            <Link href="/product/pack-full-pr" className={btn.secondary}>
              Pack Full PR · −19 %
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
