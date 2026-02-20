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

interface SourceDetailsDrawerProps {
  source: SourceRow | null;
  open: boolean;
  onClose: () => void;
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

const mockPreviewContent = `Startup Obituary : Loopt
Sam Altman's First Startup Venture and the Rise and Fall of Early Days of Location-Based Social Networking
Ram Gangisetty February 26, 2025

Loopt, co-founded in 2005 by Sam Altman, Nick Sivo, and Alok Deshpande, was one of the earliest startups to explore the potential of location-based social networking. Designed to answer a simple yet powerful question—"Where are my friends right now?"—Loopt Included users to share their real-time location with friends through their mobile devices.
Though it never reached the commercial heights of later social media giants, Loopt played a pioneering role in mobile networking technology and served as the launching pad for Altman's influential career in Silicon Valley.

Founding and Early Days

Origin: Founded while Altman was a sophomore at Stanford University, Loopt was born from the desire to help people discover the real-time locations of their friends. Altman dropped out of Stanford after joining the first batch of Y Combinator (YC) startups, receiving $6,000 per founder in funding.

Co-Founders:
Sam Altman: CEO and visionary behind the product's design and functionality.
Nick Sivo: Technical co-founder and primary software engineer.
Alok Deshpande: Helped with early product development and partnerships.

Initial Funding:
Loopt quickly attracted attention from venture capitalists, raising:
$5 million Series A funding from Sequoia Capital and New Enterprise Associates (NEA) in 2006.
Additional funding rounds pushed total venture capital to over $30 million by 2009.

Features and Innovations

Real-Time Location Sharing: Loopt allowed users to share their live location with a select list of friends, offering a way to facilitate spontaneous meetups.
Privacy Controls: A major concern with location-sharing apps, Loopt provided customizable privacy settings to let users control who could see their location at any given time.

Platform Availability:
Loopt launched across major U.S. carriers including Boost Mobile, Sprint, and Verizon. Later, it expanded to popular platforms like:
iOS (featured at Apple's WWDC 2008)
BlackBerry and Android

Social Network Integrations: Integrated with platforms like Facebook and Twitter to allow seamless sharing across multiple apps.
Loopt Pulse (2010): An iPad-specific product that offered recommendations for local events, restaurants, and entertainment based on user pReferences & Citations and location.
GraffitiGeo Acquisition (2009): This acquisition added location-based reviews and social gaming features to Loopt's platform.

Challenges and Shortcomings

Despite early enthusiasm and solid funding, Loopt faced several obstacles:

User Adoption Struggles
While innovative, users were hesitant to share their location data in real-time, limiting Loopt's ability to gain mass adoption.

Competitive Market
The rise of competitors like Foursquare and Gowalla siphoned off potential users. Later, Facebook Places entered the market, leveraging its massive user base to dominate location-based services.

Business Model Flaws
Loopt's monetization strategy relied on targeted advertising and partnerships, but it struggled to convert user data into meaningful revenue streams.

Technological Shifts
The evolution of user pReferences & Citations, from real-time location sharing to check-in models (popularized by Foursquare), made Loopt's core offering feel outdated.`;

const mockRawFiles = [
  { name: "loopt_financial_data.csv", size: "245 KB", type: "CSV" },
  { name: "screenshot_homepage.png", size: "1.2 MB", type: "Image" },
  { name: "press_release_2008.pdf", size: "890 KB", type: "PDF" },
];

const mockArtifacts = [
  { name: "Executive Summary - Loopt Analysis", type: "PDF", date: "10.05.2025" },
  { name: "Competitor Comparison Matrix", type: "XLSX", date: "10.05.2025" },
];

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

export function SourceDetailsDrawer({ source, open, onClose }: SourceDetailsDrawerProps) {
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
    { id: "raw", label: "Extracted data" },
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
                      {mockPreviewContent.split("\n\n").map((paragraph, i) => {
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
                      {mockPreviewContent}
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
  content_length: mockPreviewContent.length,
  word_count: mockPreviewContent.split(/\s+/).length,
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
                {mockRawFiles.map((file, i) => (
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
            <div className="p-6 space-y-3">
              <p className="text-xs text-gray-500 mb-4">Generated artifacts from this source:</p>
              {mockArtifacts.map((artifact, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                  data-testid={`artifact-${i}`}
                >
                  <FileText className="w-5 h-5 text-[#008DA8] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{artifact.name}</p>
                    <p className="text-[11px] text-gray-500">{artifact.type} - {artifact.date}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              ))}
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
