"use client";

import { useState, useEffect } from "react";
import {
  X,
  Download,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ArtifactRow } from "@/lib/types";

interface ArtifactPreviewDrawerProps {
  artifact: ArtifactRow | null;
  open: boolean;
  onClose: () => void;
}

const ARTIFACT_SPREADSHEET_DATA: Record<string, string[][]> = {
  "Competitors_Comparison_v1.xlsx": [
    ["#", "Company", "Founded", "HQ", "Employees", "Revenue (FY2024)", "Market Share", "Funding", "Key Product", "Pricing (mo)", "NPS", "G2 Rating", "Churn Rate", "YoY Growth"],
    ["1", "Acuras AI", "2019", "San Francisco, CA", "320", "$48M", "4.2%", "$85M Series B", "Deep Research Engine", "$299", "71", "4.6", "3.8%", "+127%"],
    ["2", "Perplexity", "2022", "San Francisco, CA", "180", "$35M", "3.1%", "$165M Series B", "AI Search", "$20", "68", "4.4", "5.1%", "+340%"],
    ["3", "Elicit", "2021", "Oakland, CA", "45", "$8M", "0.7%", "$14M Series A", "Research Assistant", "$10", "62", "4.2", "6.3%", "+89%"],
    ["4", "Consensus", "2021", "New York, NY", "60", "$12M", "1.0%", "$20M Series A", "Science Search", "$9.99", "65", "4.3", "5.7%", "+112%"],
    ["5", "Semantic Scholar", "2015", "Seattle, WA", "90", "N/A (free)", "8.4%", "Allen Institute", "Academic Search", "Free", "74", "4.5", "2.1%", "+15%"],
    ["6", "Tavily", "2023", "Tel Aviv, IL", "25", "$3M", "0.3%", "$8M Seed", "AI Search API", "$50", "59", "4.0", "8.2%", "+210%"],
    ["7", "You.com", "2020", "Palo Alto, CA", "120", "$22M", "1.9%", "$99M Series B", "AI Search Engine", "$15", "63", "4.1", "6.8%", "+95%"],
    ["8", "Hebbia", "2020", "New York, NY", "75", "$18M", "1.5%", "$130M Series B", "AI Analyst", "$500", "70", "4.4", "3.2%", "+180%"],
    ["9", "Glean", "2019", "Palo Alto, CA", "500", "$120M", "10.5%", "$360M Series D", "Enterprise Search", "$15/user", "76", "4.7", "2.5%", "+78%"],
    ["10", "AlphaSense", "2011", "New York, NY", "1,500", "$250M", "22.0%", "$650M Series F", "Market Intelligence", "$100/user", "73", "4.5", "3.0%", "+45%"],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "Average", "", "", "292", "$51.6M", "5.4%", "", "", "", "68", "4.4", "4.7%", "+129%"],
    ["", "Median", "", "", "83", "$20M", "2.5%", "", "", "", "68", "4.4", "4.8%", "+104%"],
  ],
  "default_xlsx": [
    ["ID", "Metric", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "YTD Total", "vs. Target", "Status"],
    ["1", "Revenue ($K)", "1,240", "1,380", "1,510", "1,690", "5,820", "+8.2%", "On track"],
    ["2", "New Customers", "145", "163", "178", "201", "687", "+12.5%", "Ahead"],
    ["3", "Churn Rate (%)", "4.2", "3.8", "3.5", "3.1", "3.65 avg", "-1.1pp", "On track"],
    ["4", "MRR ($K)", "890", "945", "1,010", "1,085", "1,085", "+5.3%", "On track"],
    ["5", "CAC ($)", "320", "295", "280", "265", "290 avg", "-15.4%", "Ahead"],
    ["6", "LTV ($)", "4,800", "5,100", "5,350", "5,600", "5,600", "+10.2%", "Ahead"],
    ["7", "LTV/CAC Ratio", "15.0", "17.3", "19.1", "21.1", "19.3 avg", "+28.0%", "Ahead"],
    ["8", "NPS Score", "68", "71", "73", "76", "76", "+8pts", "On track"],
    ["9", "Support Tickets", "342", "298", "275", "251", "1,166", "-22.5%", "Ahead"],
    ["10", "Uptime (%)", "99.92", "99.95", "99.97", "99.98", "99.96 avg", "+0.06pp", "On track"],
  ],
  "default_csv": [
    ["source_url", "domain", "status", "tokens", "confidence", "language", "extracted_at"],
    ["https://techcrunch.com/2025/ai-market", "techcrunch.com", "success", "12,450", "94%", "en", "2025-05-10 09:12:34"],
    ["https://reuters.com/technology/ai-funding", "reuters.com", "success", "8,320", "91%", "en", "2025-05-10 09:12:41"],
    ["https://arxiv.org/abs/2505.01234", "arxiv.org", "success", "24,100", "88%", "en", "2025-05-10 09:13:02"],
    ["https://bloomberg.com/ai-enterprise", "bloomberg.com", "failed", "0", "0%", "en", "2025-05-10 09:13:15"],
    ["https://forbes.com/ai-startups-2025", "forbes.com", "success", "9,870", "86%", "en", "2025-05-10 09:13:28"],
    ["https://wired.com/deep-research-tools", "wired.com", "success", "11,200", "92%", "en", "2025-05-10 09:13:45"],
    ["https://nature.com/ai-science-review", "nature.com", "success", "31,400", "96%", "en", "2025-05-10 09:14:01"],
    ["https://hbr.org/ai-strategy-guide", "hbr.org", "success", "7,650", "83%", "en", "2025-05-10 09:14:18"],
    ["https://ft.com/ai-investment-trends", "ft.com", "timeout", "0", "0%", "en", "2025-05-10 09:14:35"],
    ["https://mckinsey.com/ai-report-2025", "mckinsey.com", "success", "18,900", "90%", "en", "2025-05-10 09:14:52"],
    ["https://venturebeat.com/ai-tools", "venturebeat.com", "success", "6,540", "79%", "en", "2025-05-10 09:15:08"],
    ["https://semafor.com/ai-industry", "semafor.com", "success", "5,230", "81%", "en", "2025-05-10 09:15:22"],
  ],
};

const ARTIFACT_DOCUMENT_DATA: Record<string, string> = {
  "Competitors_Comparison_v1.pdf": `# Competitors Comparison Report v1

## Executive Summary

This report provides a comprehensive analysis of 10 key competitors in the AI-powered research and search market as of Q2 2025. The analysis covers market positioning, revenue metrics, product capabilities, and strategic outlook.

## Market Overview

The AI research tools market reached $1.14B in 2024, growing at 67% CAGR. Enterprise adoption accelerated significantly, with 43% of Fortune 500 companies now using at least one AI research tool.

## Key Findings

1. **AlphaSense** dominates enterprise market intelligence with $250M revenue and 22% market share
2. **Glean** leads enterprise search with $120M revenue, backed by $360M in funding
3. **Perplexity** is the fastest-growing consumer player at +340% YoY
4. **Acuras AI** shows strongest unit economics with 3.8% churn and $299/mo ARPU
5. **Hebbia** targets high-value finance segment at $500/mo with $130M Series B

## Competitive Matrix

### Tier 1 - Enterprise Leaders (>$100M revenue)
- AlphaSense: Deep financial intelligence, 1,500 employees, dominant in hedge funds
- Glean: Unified enterprise search, strong Google pedigree, rapid expansion

### Tier 2 - Growth Stage ($20M-$100M revenue)
- Acuras AI: Differentiated deep research, best-in-class research quality
- Perplexity: Consumer AI search leader, massive user growth
- You.com: Developer-friendly AI search, strong API ecosystem

### Tier 3 - Early Stage (<$20M revenue)
- Hebbia: Premium AI analyst for finance, high ARPU model
- Consensus: Academic/science-focused, strong in pharma
- Elicit: Research workflow automation, strong in academia
- Tavily: API-first approach, developer ecosystem play

## Strategic Recommendations

1. Focus on enterprise depth over breadth - the $500+ ARPU segment is underserved
2. Invest in domain-specific models for finance, legal, and healthcare verticals
3. Build data moat through proprietary source partnerships
4. Prioritize SOC2 Type II and HIPAA compliance for enterprise deals`,
  "default": `# Research Analysis Report

## Overview

This document contains the analysis results generated from collected sources. The data was processed using AI-powered extraction and synthesis methods.

## Data Collection

- Sources analyzed: 12
- Total tokens processed: 145,660
- Extraction success rate: 83.3%
- Average confidence score: 87.5%

## Summary of Findings

The research identified several key trends and patterns across the analyzed sources. Primary findings indicate strong market growth in the target segment with increasing competitive pressure from new entrants.

## Methodology

Data was collected through automated web scraping, API integrations, and manual source verification. Each source was evaluated for reliability, recency, and relevance before inclusion in the final analysis.

## Next Steps

1. Validate findings with primary research (customer interviews)
2. Expand source coverage to include patent databases
3. Update financial projections based on Q2 2025 earnings
4. Schedule stakeholder review meeting`,
};

function getTableData(artifact: ArtifactRow): string[][] {
  if (ARTIFACT_SPREADSHEET_DATA[artifact.name]) {
    return ARTIFACT_SPREADSHEET_DATA[artifact.name];
  }
  if (artifact.fileType === "csv") return ARTIFACT_SPREADSHEET_DATA["default_csv"];
  return ARTIFACT_SPREADSHEET_DATA["default_xlsx"];
}

function getDocumentContent(artifact: ArtifactRow): string {
  return ARTIFACT_DOCUMENT_DATA[artifact.name] ?? ARTIFACT_DOCUMENT_DATA["default"];
}

export function ArtifactPreviewDrawer({ artifact, open, onClose }: ArtifactPreviewDrawerProps) {
  const [widthMode, setWidthMode] = useState<"auto" | "50%" | "80%" | "100%">("auto");

  useEffect(() => {
    if (open) setWidthMode("auto");
  }, [open, artifact?.id]);

  if (!artifact) return null;

  const isSpreadsheet = artifact.fileType === "xlsx" || artifact.fileType === "csv";
  const isPdf = artifact.fileType === "pdf" || artifact.fileType === "docx" || artifact.fileType === "pptx";
  const drawerWidth = widthMode === "auto" ? "720px" : widthMode;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 h-full z-[70] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-l border-gray-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{ width: drawerWidth }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200 bg-gray-50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Artifacts</span>
            <div className="w-px h-5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Select value={widthMode} onValueChange={(v) => setWidthMode(v as typeof widthMode)}>
                <SelectTrigger className="h-7 w-20 text-xs border-gray-300 bg-white">
                  <SelectValue placeholder="Width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="50%">50%</SelectItem>
                  <SelectItem value="80%">80%</SelectItem>
                  <SelectItem value="100%">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* File info bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <ArtifactTypeIcon fileType={artifact.fileType} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{artifact.name}</p>
              <p className="text-[11px] text-gray-500">{artifact.createdAt} &middot; {artifact.fileSize}</p>
            </div>
          </div>
          {artifact.downloadUrl && (
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" asChild>
              <a href={artifact.downloadUrl}>
                <Download className="w-3 h-3" />
                Download
              </a>
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isSpreadsheet ? (
            <SpreadsheetView data={getTableData(artifact)} />
          ) : (
            <DocumentView content={getDocumentContent(artifact)} />
          )}
        </div>
      </div>
    </>
  );
}

function SpreadsheetView({ data }: { data: string[][] }) {
  if (data.length === 0) return null;

  const headers = data[0];
  const rows = data.slice(1);

  return (
    <div className="overflow-auto h-full">
      <table className="w-full border-collapse text-xs">
        <thead className="sticky top-0 z-10">
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="w-10 px-2 py-1.5 text-center text-gray-400 font-normal border-r border-gray-200 bg-gray-100" />
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-200 bg-gray-100 min-w-[120px]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={cn(
                "border-b border-gray-100 hover:bg-blue-50/30 transition-colors",
                ri % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              )}
            >
              <td className="px-2 py-1.5 text-center text-gray-400 font-mono border-r border-gray-200 bg-gray-50 select-none">
                {ri + 1}
              </td>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-1.5 text-gray-800 border-r border-gray-100 truncate max-w-[200px]"
                  title={cell}
                >
                  {cell}
                </td>
              ))}
              {row.length < headers.length &&
                Array.from({ length: headers.length - row.length }).map((_, ci) => (
                  <td key={`empty-${ci}`} className="px-3 py-1.5 border-r border-gray-100" />
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentView({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) {
          return <h1 key={i} className="text-xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">{line.slice(2)}</h1>;
        }
        if (line.startsWith("## ")) {
          return <h2 key={i} className="text-lg font-semibold text-gray-800 mb-3 mt-5">{line.slice(3)}</h2>;
        }
        if (line.startsWith("### ")) {
          return <h3 key={i} className="text-base font-semibold text-gray-700 mb-2 mt-4">{line.slice(4)}</h3>;
        }
        if (line.startsWith("- ")) {
          const text = line.slice(2);
          return (
            <div key={i} className="flex gap-2 text-sm text-gray-700 mb-1 pl-2">
              <span className="text-gray-400 shrink-0">&bull;</span>
              <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </div>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          const text = line.replace(/^\d+\.\s/, "");
          return (
            <div key={i} className="flex gap-2 text-sm text-gray-700 mb-1 pl-2">
              <span className="text-gray-500 shrink-0 font-medium">{line.match(/^(\d+)\./)?.[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </div>
          );
        }
        if (line.trim() === "") {
          return <div key={i} className="h-3" />;
        }
        return <p key={i} className="text-sm text-gray-700 mb-2 leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

function ArtifactTypeIcon({ fileType }: { fileType: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    xlsx: { bg: "bg-green-100", text: "text-green-700", label: "XLS" },
    csv: { bg: "bg-green-100", text: "text-green-700", label: "CSV" },
    pdf: { bg: "bg-red-100", text: "text-red-700", label: "PDF" },
    docx: { bg: "bg-blue-100", text: "text-blue-700", label: "DOC" },
    pptx: { bg: "bg-orange-100", text: "text-orange-700", label: "PPT" },
    json: { bg: "bg-gray-100", text: "text-gray-700", label: "JSON" },
    txt: { bg: "bg-gray-100", text: "text-gray-700", label: "TXT" },
  };
  const c = config[fileType] ?? config.txt;

  return (
    <div className={cn("w-9 h-9 rounded-md flex items-center justify-center shrink-0", c.bg)}>
      <span className={cn("text-[10px] font-bold", c.text)}>{c.label}</span>
    </div>
  );
}
