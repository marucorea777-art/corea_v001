import React, { useState, useRef } from "react";
import { Upload, Link2, Image as ImageIcon, Check, X, Sparkles, RefreshCw } from "lucide-react";
import { Translate, useTranslation } from "../context/LanguageContext";

export interface ImagePreset {
  url: string;
  label: string;
  koreanLabel?: string;
}

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  presets?: ImagePreset[];
  label?: string;
  recommendedAspect?: string;
}

export default function ImageUploader({
  value,
  onChange,
  presets = [],
  label = "고화질 실사 사진 (Photorealistic Image)",
  recommendedAspect = "16:9 권장",
}: ImageUploaderProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "presets">(value?.startsWith("data:") ? "upload" : "presets");
  const [urlInput, setUrlInput] = useState(value?.startsWith("http") ? value : "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compress & convert file to clean photorealistic base64
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(t("이미지 파일만 업로드할 수 있습니다. (JPG, PNG, WebP)") || "Please select an image file (JPG, PNG, WebP).");
      return;
    }

    setIsProcessing(true);
    setImageError(null);

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Optimize resolution: max width/height 1280px to preserve sharpness without bloating storage
        const maxDim = 1280;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Export as JPEG with 0.85 quality for crisp photo fidelity
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          onChange(dataUrl);
        } else {
          onChange(readerEvent.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setIsProcessing(false);
        setImageError("이미지를 불러오는데 실패했습니다.");
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setImageError("파일을 읽는 중 오류가 발생했습니다.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleClearImage = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Label and policy notification */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-stone-700 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
          <span><Translate>{label}</Translate> *</span>
        </label>
        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full font-medium">
          <Translate>고화질 실사 사진만 허용</Translate> ({recommendedAspect})
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "upload"
              ? "bg-white text-stone-900 shadow-2xs font-semibold"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-amber-600" />
          <span><Translate>직접 사진 업로드</Translate></span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "url"
              ? "bg-white text-stone-900 shadow-2xs font-semibold"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Link2 className="w-3.5 h-3.5 text-amber-600" />
          <span><Translate>사진 웹 URL 입력</Translate></span>
        </button>
        {presets.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("presets")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "presets"
                ? "bg-white text-stone-900 shadow-2xs font-semibold"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span><Translate>실사 프리셋 선택</Translate></span>
          </button>
        )}
      </div>

      {/* Tab 1: Upload from device */}
      {activeTab === "upload" && (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-amber-500 bg-amber-50/50"
                : "border-stone-200 hover:border-amber-400 bg-stone-50 hover:bg-stone-100/50"
            }`}
          >
            {isProcessing ? (
              <div className="py-4 flex flex-col items-center justify-center gap-2 text-stone-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
                <span><Translate>고화질 사진 최적화 처리 중...</Translate></span>
              </div>
            ) : (
              <div className="py-3 flex flex-col items-center justify-center gap-1.5 text-stone-600">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-1">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-stone-800">
                  <Translate>내 컴퓨터/기기에서 사진 파일 선택</Translate>
                </p>
                <p className="text-[11px] text-stone-400">
                  <Translate>또는 이곳으로 사진을 드래그 앤 드롭하세요 (JPG, PNG, WebP)</Translate>
                </p>
              </div>
            )}
          </div>
          {imageError && (
            <p className="text-[11px] text-red-600">{imageError}</p>
          )}
        </div>
      )}

      {/* Tab 2: URL input */}
      {activeTab === "url" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/... or https://..."
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-mono"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              <Translate>적용</Translate>
            </button>
          </div>
          <p className="text-[10px] text-stone-400">
            <Translate>고해상도 실사 사진(Unsplash, Wikimedia 등)의 이미지 주소를 붙여넣으세요.</Translate>
          </p>
        </div>
      )}

      {/* Tab 3: Curated Presets */}
      {activeTab === "presets" && presets.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-0.5">
            {presets.map((preset, idx) => {
              const isSelected = value === preset.url;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    onChange(preset.url);
                    setUrlInput(preset.url);
                  }}
                  className={`text-left p-2 rounded-xl border text-[11px] transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-amber-50 border-amber-500 font-semibold text-amber-900 ring-1 ring-amber-500"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate flex-1">
                    <span className="block truncate font-medium">{preset.koreanLabel || preset.label}</span>
                    <span className="text-[9px] text-stone-400 block truncate">{preset.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Photo Preview Banner */}
      {value && (
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 group">
          <div className="h-36 w-full overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={() => setImageError("이미지를 불러올 수 없습니다. 유효한 실사 이미지인지 확인해 주세요.")}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 pointer-events-none" />

          {/* Badge & Clear Button */}
          <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between text-white text-[10px]">
            <span className="bg-stone-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full font-mono font-medium border border-white/20">
              <Translate>실제 카드 적용 미리보기</Translate>
            </span>
            <button
              type="button"
              onClick={handleClearImage}
              className="p-1 rounded-full bg-red-600/80 hover:bg-red-700 text-white transition-colors cursor-pointer"
              title="사진 제거"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-sans">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <Translate>고화질 실사 이미지 적용됨</Translate>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
