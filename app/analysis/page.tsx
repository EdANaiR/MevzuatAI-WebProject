"use client";

import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Scale,
  FileText,
  BookOpen,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const steps = [
  {
    number: "01",
    title: "Noterden İhtarname Çekin",
    description:
      "Kiracınıza noter aracılığıyla resmi bir ihtarname gönderin. Bu, yasal sürecin ilk ve zorunlu adımıdır.",
    detail:
      "İhtarname, kiracıya borcunu ödemesi için resmi olarak 30 günlük süre tanır. Noterden gönderilmesi, ileride açılacak davada ispat kolaylığı sağlar. İhtarname masrafı yaklaşık 300–600 TL arasındadır.",
    tag: "1. Adım",
    tagColor: "bg-amber-100 text-amber-700 border-amber-200",
    icon: AlertTriangle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    number: "02",
    title: "Arabulucuya Başvurun",
    description:
      "İhtarname sonuç vermezse zorunlu arabuluculuk sürecini başlatın. 2024 itibarıyla kira uyuşmazlıklarında arabuluculuk zorunludur.",
    detail:
      "Arabuluculuk süreci ortalama 3 hafta sürer. Adliyedeki arabuluculuk merkezine bizzat başvurabilirsiniz. Anlaşma sağlanamazsa, arabuluculuk tutanağı ile mahkemeye gidebilirsiniz. Arabuluculuk ücretsiz başlar.",
    tag: "2. Adım",
    tagColor: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Scale,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    number: "03",
    title: "Tahliye Davası Açın",
    description:
      "Arabuluculuk anlaşmazlıkla sonuçlanırsa, sulh hukuk mahkemesinde tahliye davası açabilirsiniz.",
    detail:
      "Sulh Hukuk Mahkemesi'ne tahliye ve kira alacağı davası açılır. Dava süreci 3–8 ay sürebilir. Avukat tutmak zorunlu değildir ancak önerilir. Mahkeme kararı kesinleşince icra yoluyla tahliye sağlanır.",
    tag: "3. Adım",
    tagColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: FileText,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const laws = [
  {
    code: "TBK",
    article: "Madde 315",
    maddeNo: "315",
    title: "Kiracının Temerrüdü",
    summary:
      "Kiracı kira bedelini ödemezse kiraya veren yazılı bildirimle süre tanıyarak sözleşmeyi feshedebilir.",
    full: `Kiracı, kiralananın tesliminden sonra muaccel olan kira bedelini veya yan gideri ödeme borcunu ifa etmezse, kiraya veren kiracıya yazılı olarak bir süre verip bu süre içinde de ifa etmeme hâlinde sözleşmeyi feshedeceğini bildirebilir.

Kiracıya verilecek süre en az on gün, konut ve çatılı işyeri kiralarında ise en az otuz gündür.

Bu süre, kiracıya yazılı bildirimin yapıldığı tarihi izleyen günden itibaren işlemeye başlar.`,
    source: "mevzuat.gov.tr",
    sourceUrl:
      "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6098&MevzuatTur=1&MevzuatTertip=5",
    apiParams: "?code=TBK&madde=315",
  },
  {
    code: "TBK",
    article: "Madde 352",
    maddeNo: "352",
    title: "Dava Yoluyla Tahliye",
    summary:
      "Kiracı, kira sözleşmesini ihlal ederse kiraya veren belirli süreler içinde tahliye davası açabilir.",
    full: `Kiracı, bir yıldan kısa süreli kiralarda kira süresi içinde; bir yıl ve daha uzun süreli kiralarda ise bir kira yılı veya bir kira yılını aşan süre içinde kira bedelini ödemediği için kendisine yazılı olarak iki haklı ihtarda bulunulmasına sebep olmuşsa kiraya veren, kira süresinin ve bir yıldan uzun süreli kiralarda ihtarların yapıldığı kira yılının bitiminden başlayarak bir ay içinde dava açmak suretiyle kira sözleşmesini sona erdirebilir.`,
    source: "mevzuat.gov.tr",
    sourceUrl:
      "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6098&MevzuatTur=1&MevzuatTertip=5",
    apiParams: "?code=TBK&madde=352",
  },
  {
    code: "HMK",
    article: "Madde 18/A",
    maddeNo: "18",
    title: "Arabuluculuk Şartı",
    summary:
      "Kira uyuşmazlıklarında dava açmadan önce arabulucuya başvurmak zorunludur.",
    full: `İlama ilişkin icra takipleri hariç olmak üzere, kira ilişkisinden kaynaklanan uyuşmazlıklarda dava açılmadan önce arabulucuya başvurulmuş olması şarttır.

Arabuluculuk faaliyeti sonunda anlaşmaya varılamaması hâlinde, son tutanağın dava dilekçesine eklenmesi zorunludur.

Bu şartın yerine getirilmemesi durumunda mahkemece dava usulden reddedilir.`,
    source: "mevzuat.gov.tr",
    sourceUrl:
      "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6100&MevzuatTur=1&MevzuatTertip=5",
    apiParams: "?code=HMK&madde=18",
  },
];

// Renk map — Gemini'den gelen renk adını Tailwind class'ına çevir
const colorMap: Record<
  string,
  { tag: string; iconBg: string; iconColor: string }
> = {
  amber: {
    tag: "bg-amber-100 text-amber-700 border-amber-200",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  blue: {
    tag: "bg-blue-100 text-blue-700 border-blue-200",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  emerald: {
    tag: "bg-emerald-100 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  red: {
    tag: "bg-red-100 text-red-700 border-red-200",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
};

const stepIcons = [AlertTriangle, Scale, FileText, Shield];

type LiveContent = {
  content: string | null;
  loading: boolean;
  error: string | null;
  fetchedAt: string | null;
};

// Gemini'den gelen analiz tipi
type AnalizSonucu = {
  konu: string;
  hukukAlanı: string;
  ozet: string;
  adimlar: {
    numara: string;
    baslik: string;
    aciklama: string;
    detay: string;
    etiket: string;
    renk: string;
  }[];
  mevzuat: {
    kod: string;
    madde: string;
    maddeNo: string;
    baslik: string;
    ozet: string;
    apiParams: string;
  }[];
  uyari: string | null;
};

const AnalysisResult = () => {
  const router = useRouter();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [expandedLaw, setExpandedLaw] = useState<number | null>(null);
  const [liveContent, setLiveContent] = useState<Record<number, LiveContent>>(
    {},
  );
  const [analiz, setAnaliz] = useState<AnalizSonucu | null>(null);
  const [soru, setSoru] = useState<string>("");

  // sessionStorage'dan analiz sonucunu oku
  useEffect(() => {
    const saved = sessionStorage.getItem("analiz_sonucu");
    const savedSoru = sessionStorage.getItem("analiz_soru");
    if (saved) {
      try {
        setAnaliz(JSON.parse(saved));
      } catch {}
    }
    if (savedSoru) setSoru(savedSoru);
  }, []);

  // Kullanıcı bir maddeyi açtığında canlı veri çek
  const fetchLiveContent = async (index: number, apiParams: string) => {
    if (liveContent[index]?.content || liveContent[index]?.loading) return;

    setLiveContent((prev) => ({
      ...prev,
      [index]: { content: null, loading: true, error: null, fetchedAt: null },
    }));

    try {
      const res = await fetch(`/api/mevzuat${apiParams}`);
      const data = await res.json();
      setLiveContent((prev) => ({
        ...prev,
        [index]: {
          content: data.content || null,
          loading: false,
          error: data.success === false ? data.error : null,
          fetchedAt: data.fetchedAt || null,
        },
      }));
    } catch {
      setLiveContent((prev) => ({
        ...prev,
        [index]: {
          content: null,
          loading: false,
          error: "API'ye bağlanılamadı.",
          fetchedAt: null,
        },
      }));
    }
  };

  // Analiz yüklenmediyse skeleton göster
  if (!analiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            Analiz yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  // Dinamik veriyi hazırla
  const dynamicSteps = analiz.adimlar.map((a, i) => ({
    number: a.numara,
    title: a.baslik,
    description: a.aciklama,
    detail: a.detay,
    tag: a.etiket,
    tagColor: colorMap[a.renk]?.tag || colorMap.blue.tag,
    icon: stepIcons[i] || FileText,
    iconBg: colorMap[a.renk]?.iconBg || colorMap.blue.iconBg,
    iconColor: colorMap[a.renk]?.iconColor || colorMap.blue.iconColor,
  }));

  const dynamicLaws = analiz.mevzuat.map((m) => ({
    code: m.kod,
    article: m.madde,
    maddeNo: m.maddeNo,
    title: m.baslik,
    summary: m.ozet,
    full: "",
    source: "mevzuat.gov.tr",
    sourceUrl: `https://www.mevzuat.gov.tr`,
    apiParams: m.apiParams,
  }));

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Aramaya Dön
          </button>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            <span className="font-serif text-base font-bold text-foreground">
              MevzuatAI
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 bg-linear-to-br from-primary/4 to-transparent">
            <CardHeader className="flex-row items-start gap-4 space-y-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-serif text-xl font-bold sm:text-2xl">
                  Hukuki Durum Analizi
                </CardTitle>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {analiz.konu}
                  </span>{" "}
                  konusundaki durumunuz analiz edildi. {analiz.ozet}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary">
                  {analiz.hukukAlanı}
                </span>
                <span className="rounded-full border border-border bg-card px-3 py-1 font-medium text-muted-foreground">
                  {dynamicSteps.length} Adım Önerildi
                </span>
                <span className="rounded-full border border-border bg-card px-3 py-1 font-medium text-muted-foreground">
                  {dynamicLaws.length} Dayanak Madde
                </span>
              </div>
              {analiz.uyari && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600" />
                  <p className="text-[11px] font-medium text-amber-800">
                    {analiz.uyari}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Columns */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left — Strategy Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <h2 className="font-serif text-lg font-bold text-foreground mb-5">
              Önerilen Yol Haritası
            </h2>
            <div className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[21px] top-6 bottom-6 w-px bg-border" />

              {dynamicSteps.map((step, i) => (
                <div
                  key={step.number}
                  className="relative flex gap-4 pb-5 last:pb-0"
                >
                  {/* Circle */}
                  <div
                    className={`relative z-10 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-background ${step.iconBg}`}
                  >
                    <step.icon className={`h-4 w-4 ${step.iconColor}`} />
                  </div>

                  {/* Content */}
                  <Card
                    className="flex-1 cursor-pointer transition-all hover:border-primary/30 hover:shadow-sm"
                    onClick={() =>
                      setExpandedStep(expandedStep === i ? null : i)
                    }
                  >
                    <CardContent className="p-4 sm:p-5">
                      {/* Top row */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold tracking-widest text-muted-foreground">
                            {step.number}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${step.tagColor}`}
                          >
                            {step.tag}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                            expandedStep === i ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg font-extrabold text-foreground">
                        {step.title}
                      </h3>

                      {/* Description — always visible */}
                      <p className="mt-1.5 text-sm font-medium leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>

                      {/* Expanded detail */}
                      <AnimatePresence initial={false}>
                        {expandedStep === i && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <Separator className="my-3" />
                            <div className="flex gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                              <p className="text-sm leading-relaxed text-foreground font-medium">
                                {step.detail}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Legal Basis */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Dayanak Mevzuat
              </h2>
            </div>

            {/* Doğruluk notu */}
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
              <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600" />
              <p className="text-[11px] font-medium leading-relaxed text-amber-800">
                Madde metinleri{" "}
                <span className="font-bold">mevzuat.gov.tr</span> resmi
                kaynağına dayanmaktadır. Güncel değişiklikler için tıklayarak
                doğrulayın.
              </p>
            </div>

            <div className="space-y-3">
              {dynamicLaws.map((law, i) => (
                <Card
                  key={i}
                  className="group cursor-pointer transition-all hover:shadow-sm hover:border-primary/30"
                  onClick={() => {
                    const newIndex = expandedLaw === i ? null : i;
                    setExpandedLaw(newIndex);
                    if (newIndex !== null) fetchLiveContent(i, law.apiParams);
                  }}
                >
                  <CardContent className="p-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                          {law.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={law.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                        </a>
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                            expandedLaw === i ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Article title */}
                    <p className="font-serif text-base font-extrabold text-foreground">
                      {law.article} — {law.title}
                    </p>

                    <Separator className="my-2.5" />

                    {/* Summary — always visible */}
                    <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                      {law.summary}
                    </p>

                    {/* Expanded full text */}
                    <AnimatePresence initial={false}>
                      {expandedLaw === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <Separator className="my-2.5" />

                          {/* Yükleniyor */}
                          {liveContent[i]?.loading && (
                            <div className="flex items-center gap-2 py-2">
                              <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
                              <span className="text-xs font-medium text-muted-foreground">
                                mevzuat.gov.tr'den yükleniyor...
                              </span>
                            </div>
                          )}

                          {/* Canlı içerik başarıyla geldi */}
                          {!liveContent[i]?.loading &&
                            liveContent[i]?.content && (
                              <>
                                <div className="mb-2 flex items-center gap-1.5">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-[10px] font-semibold text-emerald-700">
                                    Resmi kaynaktan alındı
                                  </span>
                                </div>
                                <p className="text-xs leading-relaxed text-foreground font-medium italic whitespace-pre-line">
                                  {liveContent[i].content}
                                </p>
                              </>
                            )}

                          {/* API başarısız → hardcode fallback */}
                          {!liveContent[i]?.loading &&
                            !liveContent[i]?.content && (
                              <>
                                {liveContent[i]?.error && (
                                  <div className="mb-2 flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    <span className="text-[10px] font-semibold text-amber-700">
                                      Önbellek gösteriliyor — canlı veri
                                      alınamadı
                                    </span>
                                  </div>
                                )}
                                <p className="text-xs leading-relaxed text-foreground font-medium italic whitespace-pre-line">
                                  {law.full}
                                </p>
                              </>
                            )}

                          {/* Kaynak linki */}
                          <div className="mt-3 flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-muted-foreground">
                              Kaynak:
                            </span>
                            <a
                              href={law.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                            >
                              {law.source}
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <p className="hidden text-xs font-medium text-muted-foreground sm:block">
            Analiz tamamlandı • Dilekçenizi oluşturmaya hazırsınız
          </p>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 rounded-full sm:flex-none font-semibold"
            >
              Uzmana Danış
            </Button>
            <Button
              onClick={() => router.push("/create")}
              className="relative flex-1 rounded-full sm:flex-none animate-pulse-subtle font-semibold"
            >
              Dilekçe Oluştur
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
