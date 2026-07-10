import { useEffect, useState } from "react";
import { Video, RefreshCw, Eye, EyeOff, Loader } from "lucide-react";
import useVideoStore from "../store/videoStore.js";
import toast from "react-hot-toast";

export default function Videos() {
  const { videos, loading, error, fetchVideos, syncYouTube, toggleVisibility } = useVideoStore();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleSync = async () => {
    setSyncing(true);
    const res = await syncYouTube();
    setSyncing(false);
    if (res.success) {
      toast.success("YouTube channel videos successfully synchronized!");
    } else {
      toast.error(`Sync failed: ${res.message}`);
    }
  };

  const handleToggleHide = async (id, currentHiddenState) => {
    const res = await toggleVisibility(id, !currentHiddenState);
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(currentHiddenState ? "Video is now visible on frontend" : "Video is hidden from frontend");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Video className="h-6 w-6 text-red-600" />
            YouTube Video Feeds
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Synchronize uploads from your channel and control which ones are displayed on the public frontend.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={loading || syncing}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-5 py-3 shadow-md shadow-red-600/10 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing Channel..." : "Sync YouTube"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Grid items */}
      {loading && videos.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-350 bg-white text-slate-400">
          <Video className="h-12 w-12 text-slate-300 mb-2" />
          <p className="font-semibold text-sm">No videos synced yet</p>
          <p className="text-xs text-slate-400 mt-1">Click the Sync button above to fetch channel uploads.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div 
              key={video._id} 
              className={`rounded-2xl border bg-white overflow-hidden shadow-sm transition duration-300 ${
                video.isHidden ? "border-slate-200 opacity-60" : "border-slate-200"
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img 
                  src={video.thumbnail || "https://picsum.photos/seed/video/640/360"} 
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-semibold text-white tracking-wider">
                  {video.duration}
                </span>
                
                {/* Visibility overlay indicator */}
                {video.isHidden && (
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-white backdrop-blur-[1px]">
                    <div className="flex items-center gap-1.5 rounded-full bg-slate-900/85 px-3 py-1.5 text-xs font-bold border border-slate-750">
                      <EyeOff className="h-4 w-4 text-slate-400" />
                      Hidden from Site
                    </div>
                  </div>
                )}
              </div>

              {/* Info Details */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug" title={video.title}>
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span>{video.viewCount} views</span>
                    <span>&bull;</span>
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Visibility control toggle button */}
                <button
                  onClick={() => handleToggleHide(video._id, video.isHidden)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition duration-200 ${
                    video.isHidden
                      ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100/70"
                  }`}
                >
                  {video.isHidden ? (
                    <>
                      <Eye className="h-4 w-4" />
                      Show on Frontend
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hide from Frontend
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
