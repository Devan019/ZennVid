"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function VideoPreviewDialog({
  open,
  onClose,
  videoUrl,
}: {
  open: boolean;
  onClose: any;
  videoUrl: string;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "output_video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
    setDownloading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-6 flex flex-col items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700">
        <AnimatePresence>
          <motion.div
            key="dialog-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <DialogHeader className="w-full text-center mb-4">
              <DialogTitle className="text-2xl font-bold text-white">
                Video Preview
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Preview and download your generated video.
              </DialogDescription>
            </DialogHeader>

            <motion.div
              key="video-preview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full flex flex-col items-center"
            >
              <video
                src={videoUrl}
                className="rounded-xl shadow-lg max-h-[500px] w-full border border-slate-700"
                controls
                autoPlay
              />

              <div className="flex gap-4 w-full mt-6">
                <Button
                  variant="secondary"
                  className="flex-1 bg-slate-700 text-white hover:bg-slate-600"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white relative"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                      Downloading...
                    </>
                  ) : (
                    "Download"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
