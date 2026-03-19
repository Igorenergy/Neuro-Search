import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ProjectListItem, ArchivedProject, SidebarProject, ResearchStatus } from "@/lib/types";

const MOCK_PROJECTS: ProjectListItem[] = [
  { id: 1, title: "Американская Фабрика: Полный анализ и стратегический обзор", date: "5 дек. 2025 г.", sources: 4, status: "success", hasAttachment: true, iconIdx: 0, query: "Провести полный стратегический анализ документального фильма «Американская фабрика», включая экономические и культурные аспекты", engine: "Ultimate" },
  { id: 2, title: "Startup: AI Deep Research — Анализ рынка и конкурентов", date: "2 дек. 2025 г.", sources: 51, status: "success", hasAttachment: true, iconIdx: 1, query: "Анализ рынка AI Deep Research стартапов, ключевые конкуренты, бизнес-модели и инвестиционный потенциал в секторе", engine: "Pro" },
  { id: 3, title: "Research name one", date: "5 дек. 2025 г.", sources: 0, status: "in-progress", hasAttachment: true, iconIdx: 3, query: "Relevant query text for research name one that demonstrates the first 100 symbols of the search task", engine: "Standard" },
  { id: 4, title: "Abacus.AI: Корпоративный анализ и оценка платформы", date: "2 дек. 2025 г.", sources: 61, status: "success", hasAttachment: false, iconIdx: 3, query: "Корпоративный анализ платформы Abacus.AI: технологический стек, рыночная позиция, ключевые продукты и конкурентные преимущества", engine: "Ultimate" },
  { id: 5, title: "Инновации, Капитал и Стратегии Роста в Технологическом Секторе", date: "2 дек. 2025 г.", sources: 25, status: "failed", hasAttachment: true, iconIdx: 2, query: "Исследование инноваций и стратегий роста в технологическом секторе: венчурный капитал, тренды и прогнозы на 2025 год", engine: "Pro" },
  { id: 6, title: "Реестр 492 Компаний: Полный анализ и стратегический обзор", date: "2 дек. 2025 г.", sources: 2, status: "success", hasAttachment: false, iconIdx: 5, query: "Составить реестр 492 компаний с полным анализом финансовых показателей, рыночной капитализации и стратегических позиций", engine: "Ultimate" },
  { id: 7, title: "Research name two", date: "30 нояб. 2025 г.", sources: 0, status: "in-progress", hasAttachment: false, iconIdx: 3, query: "Relevant query text for research name two that demonstrates the first 100 symbols of the search task", engine: "Standard" },
  { id: 8, title: "Потеря $1,8 млн на крипте: уроки и выводы для инвесторов", date: "24 нояб. 2025 г.", sources: 1, status: "canceled", hasAttachment: false, iconIdx: 2, query: "Анализ случая потери $1,8 млн на криптовалютном рынке: причины, ошибки инвестора и практические выводы", engine: "Standard" },
  { id: 9, title: "Мемуары Криптана: Ретродропи, стратегии и анализ", date: "23 нояб. 2025 г.", sources: 1, status: "success", hasAttachment: false, iconIdx: 4, query: "Ретроспективный анализ криптовалютных стратегий: ретродропы, DeFi-протоколы и инвестиционные подходы", engine: "Pro" },
  { id: 10, title: "Искусственный Интеллект и Будущее Технологий", date: "17 нояб. 2025 г.", sources: 24, status: "failed", hasAttachment: false, iconIdx: 5, query: "Обзор перспектив искусственного интеллекта: генеративные модели, AGI, этические вопросы и влияние на рынок труда", engine: "Ultimate" },
  { id: 11, title: "15 Жестоких Правд о Неконкурентных Рынках", date: "16 нояб. 2025 г.", sources: 1, status: "success", hasAttachment: false, iconIdx: 4, query: "Анализ 15 ключевых факторов неконкурентных рынков: барьеры входа, монополии и стратегии выживания", engine: "Standard" },
  { id: 12, title: "Анализ Рынка Электромобилей: Tesla vs BYD vs Rivian — Конкурентный анализ и доля рынка", date: "15 нояб. 2025 г.", sources: 42, status: "success", hasAttachment: false, iconIdx: 1, query: "Сравнительный анализ лидеров рынка электромобилей: финансовые показатели, технологии и стратегии экспансии", engine: "Pro" },
  { id: 13, title: "Кибербезопасность в Эпоху AI: Новые Угрозы и Стратегии Защиты данных", date: "14 нояб. 2025 г.", sources: 12, status: "canceled", hasAttachment: false, iconIdx: 0, query: "Исследование влияния AI на кибербезопасность: новые векторы атак и современные методы защиты корпоративных данных", engine: "Ultimate" },
  { id: 14, title: "Глобальные Цепочки Поставок 2025: Реструктуризация и Геополитические вызовы", date: "12 нояб. 2025 г.", sources: 35, status: "success", hasAttachment: false, iconIdx: 2, query: "Анализ трансформации глобальных логистических цепочек под влиянием геополитики и новых торговых соглашений", engine: "Pro" },
  { id: 15, title: "Метавселенная для Бизнеса: ROI Анализ Корпоративных Внедрений и пользовательского опыта", date: "10 нояб. 2025 г.", sources: 8, status: "failed", hasAttachment: false, iconIdx: 5, query: "Оценка эффективности внедрения метавселенных в корпоративный сектор: кейсы, затраты и возврат инвестиций", engine: "Standard" },
  { id: 16, title: "Зелёная Энергетика: Инвестиционные Возможности в Солнечной и Ветровой энергетике", date: "8 нояб. 2025 г.", sources: 21, status: "success", hasAttachment: false, iconIdx: 4, query: "Обзор инвестиционного ландшафта возобновляемой энергетики: государственные субсидии и технологические прорывы", engine: "Pro" },
  { id: 17, title: "Нейроинтерфейсы и BCI: Медицинские Применения и Этические Вопросы будущего", date: "5 нояб. 2025 г.", sources: 19, status: "success", hasAttachment: false, iconIdx: 3, query: "Анализ достижений в области нейротехнологий: от медицинских протезов до массового использования BCI", engine: "Ultimate" },
  { id: 18, title: "Рынок SaaS B2B: Тренды Консолидации и Стратегии Выхода 2025–2027 годов", date: "3 нояб. 2025 г.", sources: 14, status: "canceled", hasAttachment: false, iconIdx: 1, query: "Прогноз развития рынка B2B SaaS: слияния, поглощения и новые ниши для технологических стартапов", engine: "Pro" },
  { id: 19, title: "Автономное Вождение Level 4: Регуляторные Барьеры и Дорожная Карта развития", date: "1 нояб. 2025 г.", sources: 27, status: "success", hasAttachment: false, iconIdx: 2, query: "Исследование готовности инфраструктуры и законодательства к внедрению полностью автономного транспорта", engine: "Ultimate" },
  { id: 20, title: "Цифровой Рубль и CBDC: Макроэкономический Анализ и Сценарии Внедрения в РФ", date: "28 окт. 2025 г.", sources: 16, status: "failed", hasAttachment: false, iconIdx: 0, query: "Анализ влияния цифровых валют центральных банков на банковскую систему и денежно-кредитную политику", engine: "Standard" },
];

const MOCK_ARCHIVED: ArchivedProject[] = [
  { id: 101, title: "Анализ Глобальных Тенденций в Секторе FinTech 2024", date: "15 окт. 2025 г.", sources: 34, status: "success" },
  { id: 102, title: "Исследование Рынка Нефти: Прогнозы и Стратегии", date: "10 окт. 2025 г.", sources: 18, status: "success" },
  { id: 103, title: "Конкурентный Анализ SaaS-платформ для HR", date: "5 окт. 2025 г.", sources: 42, status: "failed" },
  { id: 104, title: "Обзор Стартапов в Области Квантовых Вычислений", date: "28 сент. 2025 г.", sources: 15, status: "success" },
  { id: 105, title: "Рынок Электронной Коммерции в Азии: Тренды 2024–2025", date: "20 сент. 2025 г.", sources: 27, status: "success" },
  { id: 106, title: "Стратегический Обзор Венчурного Капитала в Европе", date: "15 сент. 2025 г.", sources: 31, status: "canceled" },
  { id: 107, title: "Кибербезопасность: Угрозы для Малого и Среднего Бизнеса", date: "10 сент. 2025 г.", sources: 22, status: "success" },
  { id: 108, title: "Децентрализованные Финансы: Риски и Перспективы", date: "5 сент. 2025 г.", sources: 19, status: "failed" },
  { id: 109, title: "Анализ Логистических Цепочек: Постпандемическая Оптимизация", date: "1 сент. 2025 г.", sources: 38, status: "success" },
  { id: 110, title: "Цифровая Трансформация в Банковском Секторе", date: "25 авг. 2025 г.", sources: 45, status: "success" },
  { id: 111, title: "Рынок Облачных Вычислений: AWS vs Azure vs GCP", date: "20 авг. 2025 г.", sources: 29, status: "success" },
  { id: 112, title: "Искусственный Интеллект в Медицине: Применения и Этика", date: "15 авг. 2025 г.", sources: 33, status: "canceled" },
  { id: 113, title: "Анализ Криптовалютного Рынка: Q3 2025", date: "10 авг. 2025 г.", sources: 16, status: "success" },
  { id: 114, title: "Зеленая Энергетика: Инвестиционный Ландшафт 2025", date: "5 авг. 2025 г.", sources: 21, status: "success" },
  { id: 115, title: "Стратегия Экспансии на Рынки Юго-Восточной Азии", date: "1 авг. 2025 г.", sources: 14, status: "failed" },
  { id: 116, title: "Обзор Рынка Недвижимости: Коммерческий Сегмент", date: "25 июля 2025 г.", sources: 26, status: "success" },
  { id: 117, title: "Анализ Конкуренции в Секторе EdTech", date: "20 июля 2025 г.", sources: 37, status: "success" },
  { id: 118, title: "Роботизация Производства: ROI и Внедрение", date: "15 июля 2025 г.", sources: 20, status: "success" },
  { id: 119, title: "Перспективы Рынка Полупроводников 2025–2030", date: "10 июля 2025 г.", sources: 41, status: "canceled" },
  { id: 120, title: "Маркетинговые Стратегии для B2B SaaS Компаний", date: "5 июля 2025 г.", sources: 12, status: "success" },
];

function mapDbProjectToListItem(dbProject: Record<string, unknown>, idx: number): ProjectListItem {
  return {
    id: typeof dbProject.id === "string" ? parseInt(dbProject.id, 10) || idx : (dbProject.id as number),
    title: (dbProject.query as string) || (dbProject.title as string) || "Untitled Project",
    date: dbProject.createdAt
      ? new Date(dbProject.createdAt as string).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })
      : "",
    sources: (dbProject.sourcesCount as number) ?? 0,
    status: (dbProject.status as ResearchStatus) || "in-progress",
    hasAttachment: false,
    iconIdx: idx % 6,
    query: (dbProject.query as string) || "",
    engine: (dbProject.dataEngine as string) || "Standard",
  };
}

export function useProjects() {
  return useQuery<ProjectListItem[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return MOCK_PROJECTS;
        const mapped = data.map(mapDbProjectToListItem);
        return [...mapped, ...MOCK_PROJECTS];
      } catch {
        return MOCK_PROJECTS;
      }
    },
  });
}

export function useArchivedProjects() {
  return useQuery<ArchivedProject[]>({
    queryKey: ["/api/projects/archived"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/projects?archived=true");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.length === 0) return MOCK_ARCHIVED;
        return data;
      } catch {
        return MOCK_ARCHIVED;
      }
    },
  });
}

export function useSidebarProjects() {
  const { data: projects = [] } = useProjects();
  const sidebarItems: SidebarProject[] = projects.map(p => ({
    id: p.id,
    title: p.title,
    status: p.status,
  }));
  return sidebarItems;
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: number) => {
      await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}
