"use client";
import { MessageCircle, Sparkles, FileText } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Sorunu Anlat",
    description:
      "Hukuki sorununuzu günlük dilde yazmanız yeterli. Teknik terim bilmenize gerek yok.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Yapay Zeka Analiz Etsin",
    description:
      "AI, binlerce kanun maddesini tarayarak sorununuza en uygun çözümü bulur.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Dilekçeni İndir",
    description:
      "Hazırlanan resmi dilekçeyi indirip doğrudan kullanabilirsiniz.",
    highlight: true,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="nasil-calisir"
      className="border-t border-border py-24 px-4 bg-background"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent mb-3">
            Süreç
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Nasıl Çalışır?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Üç basit adımda hukuki çözümünüze ulaşın.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className={`group relative rounded-xl border p-8 transition-all ${
                step.highlight
                  ? "border-primary/20 bg-primary/[0.03]"
                  : "border-border bg-card hover:border-primary/10"
              }`}
            >
              <span className="text-xs font-medium text-accent tracking-wider">
                {step.step}
              </span>
              <div className="mt-4 mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
