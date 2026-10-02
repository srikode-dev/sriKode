import { useState, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { 
  X, 
  Check, 
  Crop as CropIcon, 
  Maximize2, 
  Square, 
  RectangleHorizontal, 
  Sparkles,
  Loader
} from "lucide-react";

/**
 * Generates an initial centered crop box based on image dimensions and aspect ratio
 */
function getInitialCrop(mediaWidth, mediaHeight, aspect) {
  if (!aspect) {
    return centerCrop(
      {
        unit: "%",
        width: 90,
        height: 90,
      },
      mediaWidth,
      mediaHeight
    );
  }

  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

/**
 * Converts a cropped HTMLImageElement region into a compressed WebP File
 */
async function generateWebpFile(image, crop, originalFileName) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Real pixel values of cropped area
  const pixelX = Math.round(crop.x * scaleX);
  const pixelY = Math.round(crop.y * scaleY);
  const pixelWidth = Math.round(crop.width * scaleX);
  const pixelHeight = Math.round(crop.height * scaleY);

  canvas.width = pixelWidth;
  canvas.height = pixelHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not initialize 2D canvas context");

  // High quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    pixelX,
    pixelY,
    pixelWidth,
    pixelHeight,
    0,
    0,
    pixelWidth,
    pixelHeight
  );

  return new Promise((resolve, reject) => {
    // Export directly as webp with 0.88 quality
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to export image as WebP"));
          return;
        }

        const baseName = (originalFileName || "image").replace(/\.[^/.]+$/, "");
        const webpFile = new File([blob], `${baseName}.webp`, {
          type: "image/webp",
          lastModified: Date.now(),
        });

        resolve({
          file: webpFile,
          pixelWidth,
          pixelHeight,
          blobSize: blob.size,
        });
      },
      "image/webp",
      0.88
    );
  });
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  fileName = "image.png",
  defaultAspect = 16 / 9,
  recommendedDimensions = "1200 × 630 px",
  onClose,
  onCropComplete,
  isUploading = false,
}) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspect, setAspect] = useState(defaultAspect);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef(null);

  // Setup initial crop when the image finishes loading in the browser DOM
  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const initialCrop = getInitialCrop(width, height, aspect);
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }, [aspect]);

  // Handle changing aspect ratio presets
  const handleAspectChange = (newAspect) => {
    setAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const updatedCrop = getInitialCrop(width, height, newAspect);
      setCrop(updatedCrop);
      setCompletedCrop(updatedCrop);
    }
  };

  // Compute live pixel dimensions for the size indicator
  let currentWidth = 0;
  let currentHeight = 0;
  if (imgRef.current && completedCrop?.width && completedCrop?.height) {
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    currentWidth = Math.round(completedCrop.width * scaleX);
    currentHeight = Math.round(completedCrop.height * scaleY);
  }

  // Handle the save and upload process
  const handleSaveCrop = async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      setIsProcessing(true);
      const { file, pixelWidth, pixelHeight, blobSize } = await generateWebpFile(
        imgRef.current,
        completedCrop,
        fileName
      );

      await onCropComplete(file, { pixelWidth, pixelHeight, blobSize });
    } catch (err) {
      console.error("Error cropping image:", err);
      alert("Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CropIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Crop & Optimize Image</h3>
              <p className="text-xs text-slate-500">
                Adjust cropping frame and auto-convert to lightweight WebP format.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing || isUploading}
            className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition disabled:opacity-50"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar: Aspect Ratios & Dimension Indicators */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-400 uppercase text-[10px] mr-1">Aspect:</span>
            <button
              type="button"
              onClick={() => handleAspectChange(16 / 9)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition ${
                aspect === 16 / 9
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <RectangleHorizontal className="h-3.5 w-3.5" />
              16:9 (Cover)
            </button>
            <button
              type="button"
              onClick={() => handleAspectChange(1)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition ${
                aspect === 1
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Square className="h-3.5 w-3.5" />
              1:1 (Square)
            </button>
            <button
              type="button"
              onClick={() => handleAspectChange(4 / 3)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition ${
                aspect === 4 / 3
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              4:3
            </button>
            <button
              type="button"
              onClick={() => handleAspectChange(undefined)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition ${
                aspect === undefined
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Free
            </button>
          </div>

          {/* Live Resolution Badges */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {recommendedDimensions && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200/60">
                Recommended: <strong className="text-amber-900">{recommendedDimensions}</strong>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/70">
              Current: <strong className="text-blue-900 font-mono">{currentWidth && currentHeight ? `${currentWidth} × ${currentHeight} px` : "—"}</strong>
            </span>
          </div>
        </div>

        {/* Cropper Viewport */}
        <div className="flex-1 overflow-auto bg-slate-950/90 p-4 sm:p-6 flex items-center justify-center min-h-[300px] max-h-[55vh]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className="max-h-[50vh] rounded-lg shadow-lg border border-slate-700/50"
          >
            <img
              ref={imgRef}
              alt="Crop target"
              src={imageSrc}
              onLoad={onImageLoad}
              className="max-h-[50vh] w-auto max-w-full object-contain select-none"
            />
          </ReactCrop>
        </div>

        {/* Footer info & Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200/70 px-3 py-1.5 rounded-xl">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Format: <strong>WebP (lossy compression ~88%)</strong> for minimal cloud storage.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing || isUploading}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCrop}
              disabled={isProcessing || isUploading || !currentWidth}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
            >
              {isProcessing || isUploading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {isUploading ? "Uploading to Cloud..." : "Optimizing WebP..."}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Crop & Save WebP
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
