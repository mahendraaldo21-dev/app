import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, Info, Smartphone } from "lucide-react";
import { STORE_INFO } from "@/lib/api";

export default function DownloadPage() {
  return (
    <div data-testid="download-page" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white mx-auto">
          <Smartphone className="h-6 w-6" />
        </div>
        <div className="mt-4 text-xs uppercase tracking-widest text-[#4A5568]">
          Aplikasi Android
        </div>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#1A202C] leading-tight">
          Unduh Aplikasi {STORE_INFO.name}
        </h1>
        <p className="mt-4 text-[#4A5568] leading-relaxed max-w-xl mx-auto">
          Belanja lebih cepat dan praktis lewat aplikasi Android resmi kami.
        </p>
      </div>

      {/* Safe banner + download card */}
      <div className="mt-10 rounded-3xl border border-[#E2E8F0] bg-white soft-shadow p-6 sm:p-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-1.5">
          <ShieldCheck className="h-4 w-4 text-green-700" />
          <span
            data-testid="apk-safe-text"
            className="font-bold text-green-800 text-sm sm:text-base"
          >
            apk ini sangat AMAN!!
          </span>
        </div>

        <div className="mt-6">
          <a
            href="/assets/lawanglimo-1.1.apk"
            download="lawanglimo-1.1.apk"
            data-testid="download-apk-btn"
          >
            <Button
              size="lg"
              className="rounded-full h-14 px-8 bg-brand hover:bg-[#C9302C] text-white text-base font-semibold soft-shadow"
            >
              <Download className="h-5 w-5 mr-2" />
              Unduh APK Lawanglimo 1.1
            </Button>
          </a>
          <p className="mt-3 text-xs text-[#4A5568]">
            Ukuran file ~9,48 MB · Android 6.0 atau lebih baru
          </p>
        </div>

        <div
          data-testid="apk-unverified-notice"
          className="mt-8 mx-auto max-w-lg rounded-2xl bg-[#FAF9F6] border border-[#E2E8F0] p-4 text-left"
        >
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-[#4A5568] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#4A5568] leading-relaxed">
              APK ini <strong>belum terverifikasi</strong> karena butuh waktu dan
              persetujuan dari Google Play Store. Anda bisa tetap menginstalnya
              dengan aman langsung dari sini.
            </p>
          </div>
        </div>
      </div>

      {/* Install instructions */}
      <div className="mt-10">
        <h2 className="font-heading text-xl font-semibold">Cara Install</h2>
        <ol className="mt-3 space-y-2 text-sm text-[#4A5568] list-decimal pl-5">
          <li>Klik tombol <strong>Unduh APK Lawanglimo1.1</strong> di atas.</li>
          <li>Buka file APK yang sudah terunduh di HP Anda.</li>
          <li>
            Jika muncul peringatan, pilih <strong>Izinkan / Install anyway</strong>
            (Android akan meminta izin instal dari sumber tidak dikenal — ini normal
            untuk aplikasi di luar Play Store).
          </li>
          <li>Selesai! Buka aplikasi Lawanglimo dan mulai belanja.</li>
        </ol>
      </div>
    </div>
  );
}
