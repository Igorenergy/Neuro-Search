import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  Plus, 
  Settings, 
  Bell, 
  User, 
  Menu,
  ChevronDown,
  Paperclip,
  MoreVertical,
  Zap,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock data for the sidebar list matching the image
  const researchItems = [
    { id: 1, title: "Реестр 492 Компаний: Полный анализ и стратегический обзор...", icon: Paperclip },
    { id: 2, title: "Мемуары Криптана: Ретроспективный анализ криптозимы и стратегии...", icon: Paperclip },
    { id: 3, title: "Мемуары Криптана: Ретроспективный анализ криптозимы и стратегии...", icon: Paperclip },
    { id: 4, title: "1Искусственный Интеллект и Будущее Технологий: Глубокий анализ...", icon: MoreVertical },
    { id: 5, title: "15 Жестоких Правд о Неконкурентных Рынках: Как выжить и преуспеть ...", icon: MoreVertical },
    { id: 6, title: "Блокчейн в Финтехе 2025: Анализ Рисков, Прогноз ROI и Стратегии...", icon: MoreVertical },
    { id: 7, title: "Биотехнологии 2.0: Инвестиции в Геномное Редактирование и Персп ...", icon: MoreVertical },
    { id: 8, title: "Стратегический Риск-менеджмент в Трейдинге: Психология, Инстру...", icon: MoreVertical },
    { id: 9, title: "NFT как Инвестиционный Актив: Анализ Волатильности, Ликвиднос...", icon: MoreVertical },
    { id: 10, title: "Фискальная Политика Евросоюза: Анализ Бюджета на 2026 год и Вли ...", icon: MoreVertical },
  ];

  const SidebarContent = ({ collapsed }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full bg-[#F5F5F7] border-r border-gray-200 text-gray-800 font-sans">
      {/* Header */}
      <div className={cn("flex items-center justify-between p-3 border-b border-gray-200 bg-[#EBEBEB]", collapsed && "flex-col gap-4")}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 bg-gray-200 border border-gray-400 flex items-center justify-center rounded-sm shrink-0">
             <span className="text-[10px] font-bold text-gray-500">Logo</span>
          </div>
          {!collapsed && <span className="font-bold text-lg text-gray-800 tracking-tight">Acuras</span>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-black hover:bg-black/5"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {collapsed ? <PanelLeftOpen className="w-6 h-6" /> : <Menu className="w-8 h-8 stroke-[3]" />}
        </Button>
      </div>

      {!collapsed ? (
        <>
          {/* Actions Bar */}
          <div className="p-2 space-y-2">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-between bg-white border-gray-400 text-[#006E7D] font-bold hover:bg-gray-50 h-9 rounded-sm">
                    <span className="flex items-center gap-1">
                      <Plus className="w-4 h-4 stroke-[3]" /> Create Research
                    </span>
                    <ChevronDown className="w-4 h-4 text-black" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  <DropdownMenuItem>New Research Task</DropdownMenuItem>
                  <DropdownMenuItem>New Folder</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button size="icon" className="h-9 w-9 bg-[#5F8D4E] hover:bg-[#4d753e] rounded-sm shrink-0">
                <Search className="w-5 h-5 text-white stroke-[3]" />
              </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-black">Latest research</span>
              <div className="flex items-center gap-1 bg-white border border-gray-300 px-2 py-0.5 rounded-sm text-xs cursor-pointer">
                <span>All: 20</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Research List */}
          <div className="flex-1 overflow-hidden bg-[#E6E1EF] mx-2 mb-2 border border-gray-300 rounded-sm">
            <ScrollArea className="h-full">
              <div className="divide-y divide-gray-200/50">
                {researchItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 p-3 hover:bg-white/50 cursor-pointer group transition-colors">
                    <p className="text-[13px] leading-tight text-gray-800 line-clamp-3 font-medium flex-1">
                      {item.title}
                    </p>
                    <item.icon className={cn(
                      "w-4 h-4 shrink-0 mt-0.5", 
                      item.icon === Paperclip ? "text-[#8E4D6E] rotate-45" : "text-gray-600"
                    )} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="p-2 pt-0 flex items-center justify-between">
            <a href="#" className="text-[#008DA8] text-sm font-semibold underline decoration-[#008DA8] underline-offset-2 hover:text-[#006E7D] mx-auto">
              Show all (123)
            </a>
            <div className="bg-[#FFD700] p-1 rounded-sm border border-yellow-500/50 shadow-sm">
              <Zap className="w-4 h-4 text-black fill-current" />
            </div>
          </div>
        </>
      ) : (
        /* Collapsed State Icons */
        <div className="flex flex-col items-center gap-4 py-4">
          <Button size="icon" variant="ghost" className="h-10 w-10 text-[#006E7D]">
            <Plus className="w-6 h-6" />
          </Button>
          <Button size="icon" variant="ghost" className="h-10 w-10 text-[#5F8D4E]">
            <Search className="w-6 h-6" />
          </Button>
          <div className="w-8 h-[1px] bg-gray-300" />
          {researchItems.slice(0, 5).map(item => (
             <div key={item.id} className="w-8 h-8 rounded-full bg-[#E6E1EF] flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer" title={item.title}>
               <item.icon className="w-4 h-4" />
             </div>
          ))}
          <div className="mt-auto pb-4">
            <div className="bg-[#FFD700] p-2 rounded-sm">
              <Zap className="w-5 h-5 text-black fill-current" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:block fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out bg-[#F5F5F7] border-r border-gray-200",
          isCollapsed ? "w-[70px]" : "w-[300px]"
        )}
      >
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* Mobile Nav */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-sm border border-gray-200">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[300px] bg-[#F5F5F7]">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "md:ml-[70px]" : "md:ml-[300px]"
        )}
      >
        {/* Top Header - Contextual to the page */}
        <header className="h-14 border-b border-gray-200 bg-white sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-900">
              {location === "/" ? "Dashboard" : 
               location.includes("dashboard") ? "Dashboard" :
               location.includes("search") ? "Search" : 
               location.includes("new") ? "New Operation" : "Page"}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-600">System Online</span>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white shadow-sm" />
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-auto bg-gray-50/50">
          {children}
        </div>
      </main>
    </div>
  );
}
