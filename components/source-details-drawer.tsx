"use client";

import { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Search,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  FileText,
  Globe,
  Copy,
  MessageSquare,
  RefreshCw,
  Trash2,
  XCircle,
  Shield,
  Calendar,
  Link as LinkIcon,
  Tag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { SourceRow } from "@/lib/types";
import { useSourceDetails } from "@/hooks/use-source-details";

interface SourceDetailsDrawerProps {
  source: SourceRow | null;
  open: boolean;
  onClose: () => void;
  onOpenArtifact?: (artifact: { name: string; type: string; date: string }) => void;
}

const DRAWER_WIDTH_KEY = "user_drawer_width";

const widthOptions = [
  { label: "Auto", value: "auto" },
  { label: "30%", value: "30%" },
  { label: "50%", value: "50%" },
  { label: "80%", value: "80%" },
  { label: "100%", value: "100%" },
];

function getDrawerWidth(value: string): string {
  if (value === "auto") return "680px";
  return value;
}


function ConfidenceRingLarge({ score }: { score: number }) {
  const size = 48;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#00802b" : score >= 50 ? "#D4A373" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm font-bold text-gray-700 z-10">{score}%</span>
    </div>
  );
}

export function SourceDetailsDrawer({ source, open, onClose, onOpenArtifact }: SourceDetailsDrawerProps) {
  const { data: sourceDetails } = useSourceDetails(source?.id ?? null);
  const previewContent = sourceDetails?.content ?? "";
  const rawFiles = sourceDetails?.rawFiles ?? [];
  const sourceArtifacts = sourceDetails?.artifacts ?? [];

  const [drawerWidth, setDrawerWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(DRAWER_WIDTH_KEY) || "auto";
    }
    return "auto";
  });
  const [activeTab, setActiveTab] = useState("preview");
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(["summary"]));
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(DRAWER_WIDTH_KEY, drawerWidth);
    }
  }, [drawerWidth]);

  useEffect(() => {
    if (open) {
      setActiveTab("preview");
      setShowSearch(false);
      setSearchText("");
    }
  }, [open, source?.id]);

  if (!source) return null;

  const tabs = [
    { id: "preview", label: "Preview" },
    { id: "raw", label: "Deep Extract" },
    { id: "artifacts", label: "Artifacts: 2" },
    { id: "metadata", label: "Metadata" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
          onClick={onClose}
          data-testid="drawer-backdrop"
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 h-full z-[70] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-l border-gray-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{ width: getDrawerWidth(drawerWidth) }}
        data-testid="source-details-drawer"
      >
        {/* Status indicator vertical line */}
        <div 
          className={cn(
            "absolute left-0 top-0 bottom-0 w-[3px] z-10",
            source.included ? "bg-green-500" : "bg-orange-400"
          )}
        />
        {/* 1. Top System Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
          <span className="text-sm font-bold text-gray-900" data-testid="text-drawer-title">Source details</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Window width</span>
            <select
              value={drawerWidth}
              onChange={(e) => setDrawerWidth(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 cursor-pointer"
              data-testid="select-drawer-width"
            >
              {widthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="w-7 h-7 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
              data-testid="button-close-drawer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* 2. Source Identity & Action Toolbar (sticky) */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
          <div className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase shrink-0">
            {source.type === "pdf" ? "PDF" : source.type === "doc" ? "DOC" : "icon"}
          </div>
          <h2 className="text-sm font-bold text-gray-900 flex-1 min-w-0 truncate" data-testid="text-drawer-source-title">
            {source.title.replace("...", "")} - Full Document Title
          </h2>
          <div className="flex items-center gap-1 shrink-0">
            <button
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Open Original"
              onClick={() => window.open(`https://${source.domain}`, "_blank")}
              data-testid="button-drawer-open-original"
            >
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Download"
              onClick={() => { /* Download functionality placeholder */ }}
              data-testid="button-drawer-download"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors" data-testid="button-drawer-menu">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="gap-2">
                  <XCircle className="w-4 h-4" /> Exclude from context
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <MessageSquare className="w-4 h-4" /> Start chat session
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <RefreshCw className="w-4 h-4" /> Refresh Source Data
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-red-600">
                  <Trash2 className="w-4 h-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search bar (toggled) */}
        {showSearch && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50 shrink-0">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in document..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
              autoFocus
              data-testid="input-drawer-search"
            />
            <button onClick={() => { setShowSearch(false); setSearchText(""); }} className="p-1 hover:bg-gray-200 rounded">
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        )}

        {/* 3. Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-1.5 border-b border-gray-200 bg-white shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-sm transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[#008DA8] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              data-testid={`button-drawer-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Main Content Area */}
        <div className="flex-1 overflow-y-auto" data-testid="drawer-content-area">
          {activeTab === "preview" && (
            <div className="divide-y divide-gray-200">
              <div data-testid="accordion-summary">
                <button
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleAccordion("summary")}
                  data-testid="button-accordion-summary"
                >
                  <Sparkles className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 flex-1">Summary of the source</span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", openAccordions.has("summary") ? "" : "-rotate-90")} />
                </button>
                {openAccordions.has("summary") && (
                  <div className="px-4 pb-4">
                    <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
                      {previewContent.split("\n\n").map((paragraph, i) => {
                        if (i === 0) {
                          return <h3 key={i} className="text-base font-bold text-gray-900 mb-1">{paragraph}</h3>;
                        }
                        if (paragraph.startsWith("Founding") || paragraph.startsWith("Features") || paragraph.startsWith("Challenges") || paragraph.startsWith("Co-Founders") || paragraph.startsWith("Initial Funding") || paragraph.startsWith("Platform Availability") || paragraph.startsWith("User Adoption") || paragraph.startsWith("Competitive Market") || paragraph.startsWith("Business Model") || paragraph.startsWith("Technological")) {
                          return <h4 key={i} className="text-sm font-bold text-gray-900 mt-4 mb-1">{paragraph}</h4>;
                        }
                        return <p key={i} className="text-sm text-gray-700 mb-3 leading-relaxed">{paragraph}</p>;
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {["Startup Analysis", "Location Services", "Venture Capital", "Mobile Networking"].map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium truncate max-w-[180px]" data-testid={`tag-summary-${tag}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div data-testid="accordion-full">
                <button
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleAccordion("full")}
                  data-testid="button-accordion-full"
                >
                  <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 flex-1">Full Extracted Text</span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", openAccordions.has("full") ? "" : "-rotate-90")} />
                </button>
                {openAccordions.has("full") && (
                  <div className="px-4 pb-4">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">
                      {previewContent}
                    </div>
                  </div>
                )}
              </div>

              <div data-testid="accordion-json">
                <button
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleAccordion("json")}
                  data-testid="button-accordion-json"
                >
                  <Copy className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 flex-1">Structured JSON Data</span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", openAccordions.has("json") ? "" : "-rotate-90")} />
                </button>
                {openAccordions.has("json") && (
                  <div className="px-4 pb-4">
                    <pre className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md overflow-x-auto font-mono">
{JSON.stringify({
  title: source.title,
  domain: source.domain,
  date: source.date,
  language: source.language,
  location: source.location,
  confidence_score: source.confidenceScore,
  type: source.type,
  included: source.included,
  content_length: previewContent.length,
  word_count: previewContent.split(/\s+/).length,
  extracted_entities: ["Sam Altman", "Loopt", "Y Combinator", "Sequoia Capital", "Stanford University"],
  topics: ["startup", "location-based services", "mobile networking", "venture capital"]
}, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "raw" && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Extracted Data Points</p>
                <span className="text-[10px] text-gray-400">Last extracted: 2 hours ago</span>
              </div>

              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 py-2 text-[11px] font-bold text-gray-500 uppercase">Field</th>
                      <th className="text-left px-3 py-2 text-[11px] font-bold text-gray-500 uppercase">Value</th>
                      <th className="text-left px-3 py-2 text-[11px] font-bold text-gray-500 uppercase">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-700">Company Name</td>
                      <td className="px-3 py-2 text-xs text-gray-900">Loopt Inc.</td>
                      <td className="px-3 py-2"><span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">98%</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-700">Founded</td>
                      <td className="px-3 py-2 text-xs text-gray-900">2005</td>
                      <td className="px-3 py-2"><span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">95%</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-700">CEO / Founder</td>
                      <td className="px-3 py-2 text-xs text-gray-900">Sam Altman</td>
                      <td className="px-3 py-2"><span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">97%</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-700">Total Funding</td>
                      <td className="px-3 py-2 text-xs text-gray-900">$30M (Series A-C)</td>
                      <td className="px-3 py-2"><span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">82%</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-700">Industry</td>
                      <td className="px-3 py-2 text-xs text-gray-900">Location-Based Social Networking</td>
                      <td className="px-3 py-2"><span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">93%</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-700">Headquarters</td>
                      <td className="px-3 py-2 text-xs text-gray-900">Mountain View, CA</td>
                      <td className="px-3 py-2"><span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">90%</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-700">Acquisition</td>
                      <td className="px-3 py-2 text-xs text-gray-900">Green Dot Corp. (2012, $43.4M)</td>
                      <td className="px-3 py-2"><span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">96%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Key Entities</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Sam Altman", "Nick Sivo", "Alok Deshpande", "Y Combinator", "Sequoia Capital", "New Enterprise Associates", "Stanford University", "Green Dot Corp."].map((entity) => (
                    <span key={entity} className="px-2 py-1 bg-[#008DA8]/10 text-[#008DA8] rounded text-[11px] font-medium" data-testid={`entity-tag-${entity}`}>
                      {entity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Timeline Events</p>
                <div className="space-y-2">
                  {[
                    { year: "2005", event: "Loopt founded by Sam Altman, Nick Sivo, and Alok Deshpande" },
                    { year: "2006", event: "Accepted into Y Combinator's inaugural batch" },
                    { year: "2007", event: "Launched on Sprint and Boost Mobile networks" },
                    { year: "2009", event: "Expanded to AT&T, Verizon; reached 4M users" },
                    { year: "2012", event: "Acquired by Green Dot Corporation for $43.4M" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 px-3 py-2 border border-gray-100 rounded-md" data-testid={`timeline-event-${i}`}>
                      <span className="text-[11px] font-bold text-[#008DA8] bg-[#008DA8]/10 px-2 py-0.5 rounded shrink-0">{item.year}</span>
                      <span className="text-xs text-gray-700">{item.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attached Files</p>
                {rawFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    data-testid={`raw-file-${i}`}
                  >
                    <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-[11px] text-gray-500">{file.type} - {file.size}</p>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "artifacts" && (
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Generated artifacts from this source:</p>
              <div className="space-y-2">
                {sourceArtifacts.map((artifact, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#008DA8]/40 hover:bg-[#F0F9FB] cursor-pointer transition-all group"
                    onClick={() => onOpenArtifact?.(artifact)}
                    data-testid={`artifact-${i}`}
                  >
                    <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-[#E0F4F7] transition-colors">
                      <FileText className="w-4.5 h-4.5 text-[#008DA8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{artifact.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{artifact.type} &middot; {artifact.date}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              {sourceArtifacts.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No artifacts generated from this source yet
                </div>
              )}
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="p-6 space-y-5">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verification</h4>
                <div className="flex items-center gap-4">
                  <ConfidenceRingLarge score={source.confidenceScore} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Confidence Score</p>
                    <p className="text-xs text-gray-500">Based on source reliability analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Usage Count:</span>
                  <span className="font-medium text-gray-900">12 references</span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-200" />

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Context</h4>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Main Language:</span>
                  <span className="font-medium text-gray-900">{source.language === "En" ? "English" : source.language}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Geo Scope:</span>
                  <span className="font-medium text-gray-900">{source.location}</span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-200" />

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Technical</h4>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Date Added:</span>
                  <span className="font-medium text-gray-900">{source.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">File Format:</span>
                  <span className="font-medium text-gray-900">{source.type === "web" ? "HTML" : source.type.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Original URL:</span>
                  <span className="font-medium text-[#008DA8] truncate">https://{source.domain}/...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
