"use client";

import { useAuth } from "@web3-university/uni-wallet-lib";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  CheckCircle2,
  Coins,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { registerUser } from "@/lib/api/user";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/navigation";

const benefitIcons: Record<string, LucideIcon> = {
  coins: Coins,
  award: Award,
  globe: Globe2,
  shield: ShieldCheck,
};

type InstructorFormData = {
  name: string;
  email: string;
  domains: string[];
  bio: string;
};

export default function BecomeInstructorView() {
  const { isAuthenticated, address } = useAuth();
  const t = useTranslations("instructor");
  const router = useRouter();
  const [formData, setFormData] = useState<InstructorFormData>({
    name: "",
    email: "",
    domains: [],
    bio: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const isFormComplete = useMemo(() => {
    return (
      formData.name.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      formData.domains.length > 0 &&
      agreed
    );
  }, [formData, agreed]);

  const canSubmit =
    isAuthenticated && Boolean(address) && isFormComplete && !isSubmitting;

  const updateField =
    (key: Exclude<keyof InstructorFormData, "domains">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const toggleDomain = useCallback((value: string) => {
    setFormData((prev) => {
      const exists = prev.domains.includes(value);
      return {
        ...prev,
        domains: exists
          ? prev.domains.filter((item) => item !== value)
          : [...prev.domains, value],
      };
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting || !isFormComplete) {
        return;
      }

      if (!isAuthenticated || !address) {
        setSubmitState({
          status: "error",
          message: t("form.errors.connectWallet"),
        });
        return;
      }

      setIsSubmitting(true);
      setSubmitState(null);

      const trimmedName = formData.name.trim();
      const trimmedEmail = formData.email.trim();
      const trimmedBio = formData.bio.trim();
      const selectedDomains = formData.domains;

      try {
        await registerUser({
          walletAddress: address,
          username: trimmedName,
          email: trimmedEmail,
          bio: trimmedBio,
          specializations: selectedDomains,
          isInstructorRegistered: true, // 标记为已注册讲师
        });

        setSubmitState({
          status: "success",
          message: t("formMessages.success"),
        });
        router.push("/course-create");
      } catch (error) {
        console.error("instructor registration failed", error);
        setSubmitState({
          status: "error",
          message: t("formMessages.failure"),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      address,
      formData,
      isAuthenticated,
      isFormComplete,
      isSubmitting,
      router,
      registerUser,
    ],
  );

  const specializationOptions = useMemo(
    () => [
      { value: "blockchain", label: t("specializations.blockchain") },
      { value: "defi", label: t("specializations.defi") },
      { value: "nft", label: t("specializations.nft") },
      { value: "security", label: t("specializations.security") },
      { value: "dao", label: t("specializations.dao") },
      { value: "metaverse", label: t("specializations.metaverse") },
      { value: "ai", label: t("specializations.ai") },
    ],
    [t],
  );

  const benefits = useMemo(
    () => [
      {
        icon: benefitIcons.coins,
        title: t("benefits.items.0.title"),
        tag: t("benefits.items.0.tag"),
        tagClassName: "bg-emerald-100 text-emerald-600",
        description: t("benefits.items.0.description"),
      },
      {
        icon: benefitIcons.award,
        title: t("benefits.items.1.title"),
        tag: t("benefits.items.1.tag"),
        tagClassName: "bg-amber-100 text-amber-600",
        description: t("benefits.items.1.description"),
      },
      {
        icon: benefitIcons.globe,
        title: t("benefits.items.2.title"),
        tag: t("benefits.items.2.tag"),
        tagClassName: "bg-sky-100 text-sky-600",
        description: t("benefits.items.2.description"),
      },
      {
        icon: benefitIcons.shield,
        title: t("benefits.items.3.title"),
        tag: t("benefits.items.3.tag"),
        tagClassName: "bg-indigo-100 text-indigo-600",
        description: t("benefits.items.3.description"),
      },
    ],
    [t],
  );

  const requirements = useMemo(
    () => [
      t("requirements.items.0"),
      t("requirements.items.1"),
      t("requirements.items.2"),
    ],
    [t],
  );

  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-[#edf1ff] via-[#f7faff] to-[#fff6f9] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#c9d6ff]/60 blur-3xl" />
        <div className="absolute right-0 top-48 h-96 w-96 rounded-full bg-[#ffd7e9]/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#c9f1ff]/50 blur-3xl" />
      </div>

      <section className="relative z-10 pt-32 pb-24">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6">
          <header className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-indigo-100/80">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              {t("hero.badge")}
            </div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              {t("hero.description")}
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
            <div className="space-y-8">
              <div className="rounded-3xl border border-indigo-100/80 bg-white/80 p-8 shadow-[0_30px_80px_-35px_rgba(78,114,225,0.35)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {t("form.sectionTitle")}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {t("form.sectionSubtitle")}
                    </p>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-indigo-400" />
                </div>
                <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">
                        {t("form.fields.nameLabel")}
                      </span>
                      <input
                        type="text"
                        placeholder={t("form.fields.namePlaceholder")}
                        className="mt-2 w-full rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/80"
                        value={formData.name}
                        onChange={updateField("name")}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">
                        {t("form.fields.emailLabel")}
                      </span>
                      <input
                        type="email"
                        placeholder={t("form.fields.emailPlaceholder")}
                        className="mt-2 w-full rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/80"
                        value={formData.email}
                        onChange={updateField("email")}
                      />
                      <span className="mt-2 block text-xs text-slate-500">
                        {t("form.fields.emailHint")}
                      </span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        {t("form.fields.domainsLabel")}
                      </span>
                      <span className="text-xs text-slate-400">
                        {t("form.fields.domainsHint")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {specializationOptions.map((option) => {
                        const selected = formData.domains.includes(
                          option.value,
                        );
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleDomain(option.value)}
                            aria-pressed={selected}
                            className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                              selected
                                ? "border-indigo-300 bg-indigo-500/90 text-white shadow-sm shadow-indigo-500/30"
                                : "border-indigo-100 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    {formData.domains.length === 0 && (
                      <p className="text-xs text-rose-400">
                        {t("form.fields.domainsWarning")}
                      </p>
                    )}
                  </div>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      {t("form.fields.bioLabel")}
                    </span>
                    <textarea
                      rows={4}
                      placeholder={t("form.fields.bioPlaceholder")}
                      className="mt-2 w-full rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/80"
                      value={formData.bio}
                      onChange={updateField("bio")}
                    />
                  </label>

                  <div className="flex items-center gap-4 rounded-2xl border border-indigo-100 bg-white p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-indigo-50 bg-indigo-50">
                      <Image
                        src="/window.svg"
                        alt={t("form.tipImageAlt")}
                        fill
                        className="object-contain p-4"
                        priority
                      />
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>{t("form.tipMain")}</p>
                      <p className="text-xs text-slate-500">
                        {t("form.tipSub")}
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-white p-4 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition checked:border-indigo-400/80 checked:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200/80"
                    />
                    <span>
                      {t("form.agreementPrefix")}{" "}
                      <Link
                        href="#"
                        className="text-indigo-500 underline decoration-indigo-300 decoration-dashed underline-offset-4 hover:text-indigo-400"
                      >
                        {t("form.agreementTeacher")}
                      </Link>{" "}
                      {t("form.agreementConnector")}{" "}
                      <Link
                        href="#"
                        className="text-indigo-500 underline decoration-indigo-300 decoration-dashed underline-offset-4 hover:text-indigo-400"
                      >
                        {t("form.agreementPlatform")}
                      </Link>
                    </span>
                  </label>

                  <div className="flex flex-col gap-3 rounded-2xl bg-indigo-50/70 p-4 text-xs text-slate-600">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <p>{t("form.submitNote")}</p>
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className="inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500/90 disabled:cursor-not-allowed disabled:border-indigo-200 disabled:bg-white disabled:text-slate-400 disabled:shadow-none"
                      >
                        {isSubmitting
                          ? t("form.buttons.submitting")
                          : t("form.buttons.submit")}
                      </button>
                    </div>

                    {(!isAuthenticated || !address) && (
                      <div className="rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs text-indigo-500">
                        {t("form.connectWalletNotice")}
                      </div>
                    )}

                    {submitState && (
                      <div
                        className={`rounded-xl border px-3 py-2 text-xs ${
                          submitState.status === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : "border-rose-200 bg-rose-50 text-rose-600"
                        }`}
                      >
                        {submitState.message}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-indigo-100/80 bg-gradient-to-br from-[#edf0ff] via-[#e8f4ff] to-[#ffeafd] p-8 shadow-[0_25px_80px_-45px_rgba(78,114,225,0.55)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-lg font-semibold">
                    {t("benefits.title")}
                  </h3>
                </div>
                <div className="mt-6 space-y-5">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="flex gap-4 rounded-2xl border border-white/70 bg-white/80 p-4"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">
                            {benefit.title}
                          </p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${benefit.tagClassName}`}
                          >
                            {benefit.tag}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-indigo-100/80 bg-white/80 p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-lg font-semibold">
                    {t("requirements.title")}
                  </h3>
                </div>
                <ul className="mt-6 space-y-4">
                  {requirements.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-600">
                  {t("requirements.highlight")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
