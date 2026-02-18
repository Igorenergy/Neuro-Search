import { useState } from "react";
import { Link } from "wouter";
import {
  Plus,
  MoreVertical,
  Paperclip,
  Rocket,
  DollarSign,
  Book,
  Bot,
  TrendingUp,
  Building2,
  Zap,
  FileText,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard2() {
  const [showBanner, setShowBanner] = useState(true);

  const searches = [
    {
      id: 1,
      title: "Американская Фабрика...",
      date: "5 дек. 2025 г.",
      sources: 4,
      icon: Rocket,
      color: "bg-cyan-100",
      iconColor: "text-red-500",
      iconBg: "bg-white",
      hasAttachment: true,
    },
    {
      id: 2,
      title: "Startup: AI Deep Research",
      date: "2 дек. 2025 г.",
      sources: 51,
      icon: DollarSign,
      color: "bg-purple-100",
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      hasAttachment: true,
    },
    {
      id: 3,
      title: "Untitled notebook",
      date: "5 дек. 2025 г.",
      sources: 0,
      icon: Book,
      color: "bg-purple-50",
      iconColor: "text-orange-400",
      iconBg: "bg-white",
      hasAttachment: true,
    },
    {
      id: 4,
      title: "Abacus.AI: Корпоративный...",
      date: "2 дек. 2025 г.",
      sources: 61,
      icon: Bot,
      color: "bg-yellow-50",
      iconColor: "text-gray-700",
      iconBg: "bg-gray-200",
      hasAttachment: false,
    },
    {
      id: 5,
      title: "Инновации, Капитал и...",
      date: "2 дек. 2025 г.",
      sources: 25,
      icon: TrendingUp,
      color: "bg-red-50",
      iconColor: "text-red-500",
      iconBg: "bg-white",
      hasAttachment: true,
    },
    {
      id: 6,
      title: "Реестр 492 Компаний",
      date: "2 дек. 2025 г.",
      sources: 2,
      icon: Building2,
      color: "bg-cyan-50",
      iconColor: "text-blue-500",
      iconBg: "bg-white",
      hasAttachment: false,
    },
    {
      id: 7,
      title: "Untitled notebook",
      date: "30 нояб. 2025 г.",
      sources: 0,
      icon: Book,
      color: "bg-purple-50",
      iconColor: "text-orange-400",
      iconBg: "bg-white",
      hasAttachment: false,
    },
    {
      id: 8,
      title: "Потеря $1,8 млн на крипте: уроки...",
      date: "24 нояб. 2025 г.",
      sources: 1,
      icon: TrendingUp, // Using TrendingUp as a graph placeholder
      color: "bg-indigo-50",
      iconColor: "text-blue-600",
      iconBg: "bg-white",
      hasAttachment: false,
    },
    {
      id: 9,
      title: "Мемуары Криптана: Ретродропи,...",
      date: "23 нояб. 2025 г.",
      sources: 1,
      icon: Zap, // Using Zap for racing car placeholder equivalent
      color: "bg-green-50",
      iconColor: "text-red-500",
      iconBg: "bg-white",
      hasAttachment: false,
    },
    {
      id: 10,
      title: "Искусственный Интеллект и...",
      date: "17 нояб. 2025 г.",
      sources: 24,
      icon: FileText, // Placeholder
      color: "bg-orange-50",
      iconColor: "text-red-600",
      iconBg: "bg-white",
      hasAttachment: false,
    },
    {
      id: 11,
      title: "15 Жестоких Правд о Неконкурентно...",
      date: "16 нояб. 2025 г.",
      sources: 1,
      icon: Zap, // Placeholder for flexing arm
      color: "bg-cyan-50",
      iconColor: "text-yellow-600",
      iconBg: "bg-white",
      hasAttachment: false,
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 font-sans">
      {/* Latest News Banner */}
      {showBanner && (
        <div className="bg-[#EBEBEB] border border-gray-300 rounded-sm relative overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-[#E0E0E0]">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-700" />
              <h2 className="font-bold text-gray-800 text-sm">
                Our Latest News
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs border-gray-400 text-[#006E7D] bg-white hover:bg-gray-50"
              >
                See all
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-[#006E7D] hover:bg-transparent"
                onClick={() => setShowBanner(false)}
              >
                <X className="w-5 h-5 stroke-[3]" />
              </Button>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 bg-[#EBEBEB]">
            <div>
              <a
                href="#"
                className="block text-sm font-medium text-gray-800 hover:underline decoration-gray-400 underline-offset-2 mb-0.5"
              >
                Introducing research models with Basis for the Parallel Chat API
              </a>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                PRODUCT UPDATE • 4 DAYS AGO
              </p>
            </div>
            <div>
              <a
                href="#"
                className="block text-sm font-medium text-gray-800 hover:underline decoration-gray-400 underline-offset-2 mb-0.5"
              >
                How Amp's coding agents build better software with ...
              </a>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                PRODUCT UPDATE • 4 DAYS AGO
              </p>
            </div>
            <div>
              <a
                href="#"
                className="block text-sm font-medium text-gray-800 hover:underline decoration-gray-400 underline-offset-2 mb-0.5"
              >
                Build a real-time fact checker with Acuras Proand Cerebras
              </a>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                PRODUCT UPDATE • 4 DAYS AGO
              </p>
            </div>
            <div>
              <a
                href="#"
                className="block text-sm font-medium text-gray-800 hover:underline decoration-gray-400 underline-offset-2 mb-0.5"
              >
                Latency improvements on the Acuras ProTask API
              </a>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                PRODUCT UPDATE • 4 DAYS AGO
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900">Your Searches (20)</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800">Research type</span>
          <Button
            variant="outline"
            className="h-8 bg-white border-gray-300 text-sm font-normal min-w-[100px] justify-between"
          >
            All: 20
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Create Research Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow min-h-[220px]">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Create research
          </h3>
          <div className="space-y-2 w-full">
            <Link href="/smart-search/new">
              <a className="block text-sm font-bold text-[#008DA8] hover:underline mb-2">
                SMART SEARCH
              </a>
            </Link>
            <Link href="#">
              <a className="block text-sm font-bold text-[#008DA8] hover:underline">
                SMART SHEET
              </a>
            </Link>
          </div>
        </div>

        {/* Project Cards */}
        {searches.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-xl p-5 relative group flex flex-col min-h-[220px] transition-all hover:shadow-md",
              item.color,
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center border-2 border-black/5",
                  item.iconBg,
                )}
              >
                <item.icon
                  className={cn("w-7 h-7 stroke-[1.5]", item.iconColor)}
                />
              </div>
              <div className="flex items-center gap-1">
                {item.hasAttachment && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:bg-black/5 rounded-full"
                  >
                    <Paperclip className="w-4 h-4 rotate-45" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:bg-black/5 rounded-full"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-auto">
              <h3 className="text-xl font-normal text-gray-800 leading-tight mb-3 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {item.date} • {item.sources} источников
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8 pb-12">
        <Button className="bg-[#008DA8] hover:bg-[#007A92] text-white px-8 h-10 rounded-sm font-medium">
          Show more (20)
        </Button>
      </div>
    </div>
  );
}
