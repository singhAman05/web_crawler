"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Play,
  RefreshCw,
  XCircle,
  Clock,
  Globe,
  Layers,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import React from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

interface Job {
  id: string;
  url: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  lastUpdated: string;
  pagesCrawled?: number;
  startedAt?: string | null;
  completedAt?: string | null;
  error?: string | null;
}

export default function WebCrawlerPage() {
  const [seedUrl, setSeedUrl] = useState("");
  const [maxPages, setMaxPages] = useState(20);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]); // Removed hardcoded values
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const startCrawl = async () => {
    if (!seedUrl) {
      toast.error("Seed URL is required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Initializing mission...");

    try {
      const res = await fetch(`${API_BASE_URL}/crawl/startJob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seedUrl, maxPages }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      setJobs((prev) => [
        {
          id: data.job_id,
          url: seedUrl,
          status: "PENDING",
          lastUpdated: new Date().toISOString(),
        },
        ...prev,
      ]);

      toast.success("Crawl mission dispatched", { id: toastId });
      setSeedUrl("");
    } catch (error: any) {
      toast.error("Job failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (jobId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/crawl/${jobId}`);
      const data = await res.json();

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: data.status,
                pagesCrawled: data.pagesCrawled || 0,
                startedAt: data.startedAt || null,
                completedAt: data.completedAt || null,
                error: data.error || null,
                lastUpdated: new Date().toISOString(),
              }
            : j,
        ),
      );
    } catch {
      toast.error("Sync link severed");
    }
  };

  const toggleExpand = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
    // Always check status when expanding to get latest data
    checkStatus(jobId);
  };

  const getStatusBadge = (status: Job["status"]) => {
    const styles = {
      PENDING: {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Clock size={12} className="animate-spin" />,
      },
      RUNNING: {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Loader2 size={12} className="animate-spin" />,
      },
      COMPLETED: {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle2 size={12} />,
      },
      FAILED: {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <XCircle size={12} />,
      },
      CANCELLED: {
        bg: "bg-gray-100 text-gray-600 border-gray-200",
        icon: <XCircle size={12} />,
      },
    };

    const style = styles[status] || styles.PENDING;

    return (
      <Badge
        variant="outline"
        className={`${style.bg} capitalize font-medium px-2.5 py-1 shadow-sm flex items-center gap-1.5 w-fit transition-all hover:scale-105`}
      >
        {style.icon}
        {status}
      </Badge>
    );
  };

  const getStatusDotClass = (status: Job["status"]) => {
    switch (status) {
      case "RUNNING":
        return "bg-blue-600 animate-pulse";
      case "PENDING":
        return "bg-yellow-500 animate-pulse";
      case "COMPLETED":
        return "bg-emerald-600";
      case "FAILED":
        return "bg-red-600";
      case "CANCELLED":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50/50">
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gray-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-8">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#fff",
              border: "1px solid #e2e8f0",
              color: "#0f172a",
            },
            className: "shadow-lg border-gray-200",
          }}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-linear-to-br from-gray-800 to-black p-3 rounded-2xl shadow-lg"
            >
              <Globe className="text-white" size={28} strokeWidth={2} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                Web Intelligence
                <Badge className="bg-linear-to-r from-gray-800 to-black text-white border-0 shadow-lg shadow-gray-300">
                  v2.0
                </Badge>
              </h1>
              <p className="text-gray-600 text-sm font-medium mt-1">
                Advanced automated indexing and content discovery engine
              </p>
            </div>
          </div>
        </motion.div>

        {/* Control Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-xl border-gray-300 overflow-hidden backdrop-blur-sm bg-white/95 hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-4 border-b border-gray-200">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-800 flex items-center gap-2">
                <Zap size={14} className="fill-gray-800" />
                Initiate Discovery
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-7 space-y-2">
                  <Label
                    htmlFor="url"
                    className="text-gray-800 text-xs font-bold ml-1 uppercase tracking-wide"
                  >
                    Target Seed URL
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className="relative group"
                  >
                    <Globe
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gray-800 transition-all duration-300"
                      size={18}
                    />
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={seedUrl}
                      onChange={(e) => setSeedUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && startCrawl()}
                      className="pl-11 h-12 bg-white border-gray-300 focus:border-gray-800 focus:ring-2 ring-gray-300 transition-all rounded-xl text-gray-900 placeholder:text-gray-500"
                    />
                  </motion.div>
                </div>

                <div className="md:col-span-3 space-y-2">
                  <Label
                    htmlFor="pages"
                    className="text-gray-800 text-xs font-bold ml-1 uppercase tracking-wide"
                  >
                    Max Pages
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className="relative group"
                  >
                    <Layers
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gray-800 transition-all duration-300"
                      size={16}
                    />
                    <Input
                      id="pages"
                      type="number"
                      value={maxPages}
                      onChange={(e) => setMaxPages(Number(e.target.value))}
                      className="pl-11 h-12 bg-white border-gray-300 focus:border-gray-800 focus:ring-2 ring-gray-300 rounded-xl font-mono transition-all"
                    />
                  </motion.div>
                </div>

                <div className="md:col-span-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={startCrawl}
                      disabled={loading}
                      className="w-full h-12 bg-linear-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:shadow-gray-300 font-bold relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {loading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Play size={16} />
                        )}
                        {loading ? "Deploying..." : "Launch"}
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-lg border-gray-300 overflow-hidden rounded-2xl backdrop-blur-sm bg-white/95">
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-300">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-35 pl-6 font-bold text-gray-800 text-xs uppercase tracking-wide">
                    Agent ID
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 text-xs uppercase tracking-wide">
                    Target Resource
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 text-center text-xs uppercase tracking-wide">
                    Status
                  </TableHead>
                  <TableHead className="text-right pr-6 font-bold text-gray-800 text-xs uppercase tracking-wide">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {jobs.map((job, index) => (
                    <React.Fragment key={job.id}>
                      <motion.tr
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        className="group hover:bg-gray-50/50 transition-all duration-200 border-b border-gray-200 last:border-0"
                      >
                        <TableCell className="font-mono text-[11px] text-gray-600 pl-6 font-medium">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(job.status)}`}
                            />
                            {job.id.slice(0, 12).toUpperCase()}
                          </motion.div>
                        </TableCell>

                        <TableCell className="max-w-75">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col gap-1"
                          >
                            <span className="font-semibold text-gray-900 truncate group-hover:text-gray-800 transition-colors">
                              {job.url}
                            </span>
                            <span className="text-[10px] text-gray-500 flex items-center gap-1.5 uppercase tracking-tight font-medium">
                              <Clock size={10} />
                              Last sync:{" "}
                              {new Date(job.lastUpdated).toLocaleTimeString()}
                            </span>
                          </motion.div>
                        </TableCell>

                        <TableCell className="text-center">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center"
                          >
                            {getStatusBadge(job.status)}
                          </motion.div>
                        </TableCell>

                        <TableCell className="text-right pr-6">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center justify-end gap-2"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => checkStatus(job.id)}
                                className="h-8 w-8 p-0 rounded-full border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
                              >
                                <RefreshCw size={14} />
                              </Button>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleExpand(job.id)}
                                className="px-3 h-8 rounded-lg border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 font-bold text-[11px] uppercase tracking-wide"
                              >
                                {expandedJobId === job.id ? (
                                  <ChevronUp size={14} className="mr-1" />
                                ) : (
                                  <ChevronDown size={14} className="mr-1" />
                                )}
                                Details
                              </Button>
                            </motion.div>

                            {!["completed", "failed", "cancelled"].includes(
                              job.status,
                            ) && (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 rounded-full border-red-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                >
                                  <XCircle size={14} />
                                </Button>
                              </motion.div>
                            )}
                          </motion.div>
                        </TableCell>
                      </motion.tr>

                      {/* Expandable Content - Now shows for all jobs when expanded */}
                      <AnimatePresence>
                        {expandedJobId === job.id && (
                          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableCell colSpan={4} className="p-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden border-t border-gray-300"
                              >
                                <div className="p-6">
                                  <motion.div
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                  >
                                    <DetailCard
                                      label="Pages Crawled"
                                      value={`${job.pagesCrawled || 0} Pages`}
                                      icon={
                                        <Layers
                                          className="text-gray-700"
                                          size={18}
                                        />
                                      }
                                      delay={0.1}
                                    />
                                    <DetailCard
                                      label="Started At"
                                      value={
                                        job.startedAt
                                          ? new Date(
                                              job.startedAt,
                                            ).toLocaleString()
                                          : "Not started"
                                      }
                                      icon={
                                        <Calendar
                                          className="text-gray-700"
                                          size={18}
                                        />
                                      }
                                      delay={0.15}
                                    />
                                    <DetailCard
                                      label="Status Report"
                                      value={
                                        job.error
                                          ? "Error"
                                          : job.status === "COMPLETED"
                                            ? "Completed Successfully"
                                            : job.status === "RUNNING"
                                              ? "In Progress"
                                              : job.status
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                job.status.slice(1)
                                      }
                                      icon={
                                        job.error ? (
                                          <AlertCircle
                                            size={18}
                                            className="text-red-600"
                                          />
                                        ) : job.status === "COMPLETED" ? (
                                          <CheckCircle2
                                            size={18}
                                            className="text-emerald-600"
                                          />
                                        ) : (
                                          <Clock
                                            size={18}
                                            className="text-gray-700"
                                          />
                                        )
                                      }
                                      delay={0.2}
                                    />
                                  </motion.div>

                                  {job.error && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.25 }}
                                      className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-xs font-mono"
                                    >
                                      <div className="font-bold mb-1 flex items-center gap-2">
                                        <AlertCircle size={14} />
                                        Error Trace:
                                      </div>
                                      {job.error}
                                    </motion.div>
                                  )}

                                  {job.completedAt && !job.error && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.3 }}
                                      className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-700 text-xs"
                                    >
                                      <div className="font-bold mb-1 flex items-center gap-2">
                                        <CheckCircle2 size={14} />
                                        Completed at:{" "}
                                        {new Date(
                                          job.completedAt,
                                        ).toLocaleString()}
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>

            {jobs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center py-24 bg-linear-to-b from-transparent to-gray-50/30"
              >
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="bg-linear-to-br from-gray-100 to-gray-200 shadow-2xl p-8 rounded-3xl mb-6 relative"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Search
                      size={48}
                      className="text-gray-400"
                      strokeWidth={1.5}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-linear-to-br from-gray-400/20 to-gray-500/20"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
                <h3 className="text-gray-900 font-bold text-xl tracking-tight">
                  System Idle
                </h3>
                <p className="text-gray-600 text-sm max-w-70 text-center mt-2 leading-relaxed">
                  Ready to deploy. Enter target parameters to initiate discovery
                  protocol.
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced DetailCard component
function DetailCard({
  label,
  value,
  icon,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm flex items-center gap-4 hover:border-gray-400 hover:shadow-md transition-all duration-300"
    >
      <div className="bg-linear-to-br from-gray-50 to-gray-100 p-3 rounded-xl transition-colors duration-300">
        {icon}
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-sm font-bold text-gray-900 tracking-tight mt-0.5">
          {value}
        </span>
      </div>
    </motion.div>
  );
}
