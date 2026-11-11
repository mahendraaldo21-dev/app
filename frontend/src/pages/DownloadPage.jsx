import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Info, Smartphone } from "lucide-react";
import { STORE_INFO } from "@/lib/api";

// Opsional: isi dengan kode SHA-256 file APK agar pengunjung bisa memeriksa keasliannya.
// Kosongkan ("") kalau belum ada, bagian ini otomatis tidak tampil.
const APK_SHA256 = "";

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
          Aplikasi Android untuk belanja di {STORE_INFO.name}. Kalau tidak ingin memasang
          aplikasi, Anda tetap bisa belanja langsung lewat website ini.
        </p>
      </div>

      {/* Download card */}
      <div className="mt-10 rounded-3xl border border-[#E2E8F0] bg-white soft-shadow p-6 sm:p-10 text-center">
        <div>
          <a
            href="/assets/lawanglimo-1.1.apk"
            download="lawanglimo-1.1.apk"
            data-testid="download-apk-btn"
          >
            <Button
              size="lg"
              className="rounded-full h-14 px-8 bg-brand hover:bg-[#172554] text-white text-base font-semibold soft-shadow"
            >
              <Download className="h-5 w-5 mr-2" />
              Unduh APK Lawanglimo 1.1
            </Button>
          </a>
          <p className="mt-3 text-xs text-[#4A5568]">
            Ukuran file ~9,48 MB · Android 6.0 atau lebih baru
          </p>
          <p className="mt-1 text-xs text-[#4A5568]">
            Unduh hanya dari website resmi ini.
          </p>
        </div>

        <div
          data-testid="apk-unverified-notice"
          className="mt-8 mx-auto max-w-lg rounded-2xl bg-[#FAF9F6] border border-[#E2E8F0] p-4 text-left"
        >
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-[#4A5568] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#4A5568] leading-relaxed">
              <p className="font-semibold text-[#1A202C]">Tentang peringatan keamanan</p>
              <p className="mt-1">
                Aplikasi ini dibagikan di luar Google Play Store dan belum terdaftar di
                Google. Karena itu, Android atau Play Protect bisa menampilkan peringatan
                seperti "aplikasi tidak dikenal", atau bahkan menghentikan pemasangan.
                Itu adalah perilaku normal untuk aplikasi seperti ini. Pasang hanya jika
                Anda mempercayai sumbernya, dan Anda bisa tetap berbelanja lewat website
                tanpa memasang aplikasi.
              </p>
            </div>
          </div>
        </div>

        {APK_SHA256 && (
          <div data-testid="apk-sha256" className="mt-6 mx-auto max-w-lg text-left">
            <div className="text-xs uppercase tracking-widest text-[#4A5568]">
              Sidik jari file (SHA-256)
            </div>
            <p className="mt-1 break-all rounded-xl bg-[#FAF9F6] border border-[#E2E8F0] px-3 py-2 font-mono text-[11px] text-[#1A202C]">
              {APK_SHA256}
            </p>
            <p className="mt-1 text-[11px] text-[#4A5568]">
              Bagi yang paham teknis, bandingkan dengan kode SHA-256 file yang Anda unduh.
            </p>
          </div>
        )}
      </div>

      {/* Install instructions */}
      <div className="mt-10">
        <h2 className="font-heading text-xl font-semibold">Cara Install</h2>
        <ol className="mt-3 space-y-2 text-sm text-[#4A5568] list-decimal pl-5">
          <li>Klik tombol <strong>Unduh APK Lawanglimo</strong> di atas.</li>
          <li>Buka file APK yang sudah terunduh di HP Anda.</li>
          <li>
            Jika Android meminta izin instal dari sumber tidak dikenal atau menampilkan
            peringatan, baca pesannya dengan teliti, lalu lanjutkan hanya jika Anda yakin.
            Pada sebagian HP, pemasangan bisa diblokir sepenuhnya.
          </li>
          <li>Selesai. Buka aplikasi Lawanglimo dan mulai belanja.</li>
        </ol>
      </div>

      {/* Alternative */}
      <div className="mt-8 rounded-2xl bg-[#FAF9F6] border border-[#E2E8F0] p-4">
        <h3 className="font-semibold text-sm text-[#1A202C]">Tidak ingin memasang APK?</h3>
        <p className="mt-1 text-sm text-[#4A5568] leading-relaxed">
          Buka <strong>lawanglimo.shop</strong> di Chrome, ketuk menu titik tiga di kanan
          atas, lalu pilih <strong>Tambahkan ke layar utama</strong>. Pintasan toko akan
          muncul di HP Anda tanpa perlu memasang file apa pun.
        </p>
      </div>
    </div>
  );
}
