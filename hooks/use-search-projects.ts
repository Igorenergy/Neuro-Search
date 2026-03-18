import { useQuery } from "@tanstack/react-query";
import type { SearchResultItem } from "@/lib/types";

const MOCK_RESULTS: SearchResultItem[] = [
  { id: 1, title: "Реестр 492 Компаний: Полный анализ и стратегический обзор для инвесторов", sources: 105, artifacts: 6, date: "today at 15:48" },
  { id: 2, title: "Мемуары Криптана: Ретроспективный анализ криптозимы и стратегии выживания", sources: 64, artifacts: 4, date: "today at 12:18" },
  { id: 3, title: "Искусственный Интеллект и Будущее Технологий: Глубокий анализ влияния AI", sources: 551, artifacts: 5, date: "today at 11:11" },
  { id: 4, title: "15 Жестоких Правд о Неконкурентных Рынках: Как выжить и преуспеть", sources: 41, artifacts: 4, date: "yesterday at 18:49" },
  { id: 5, title: "Блокчейн в Финтехе 2025: Анализ Рисков, Прогноз ROI и Стратегии Внедрения", sources: 14, artifacts: 4, date: "yesterday at 17:12" },
  { id: 6, title: "Биотехнологии 2.0: Инвестиции в Геномное Редактирование и Перспективы", sources: 35, artifacts: 5, date: "December 7" },
  { id: 7, title: "Стратегический Риск-менеджмент в Трейдинге: Психология, Инструменты", sources: 51, artifacts: 8, date: "December 6" },
  { id: 8, title: "NFT как Инвестиционный Актив: Анализ Волатильности, Ликвидности", sources: 17, artifacts: 7, date: "December 5" },
  { id: 9, title: "Фискальная Политика Евросоюза: Анализ Бюджета на 2026 год и Влияние", sources: 38, artifacts: 3, date: "December 5" },
  { id: 10, title: "Гиперинфляция в Латинской Америке: Уроки Истории и Стратегии", sources: 41, artifacts: 6, date: "December 5" },
  { id: 11, title: "Искусственный Интеллект и Будущее Технологий: Глубокий анализ", sources: 48, artifacts: 6, date: "December 5" },
  { id: 12, title: "Ключевые Метрики SaaS Бизнеса: LTV, CAC, Churn Rate и Стратегии", sources: 53, artifacts: 5, date: "December 4" },
  { id: 13, title: "Корпоративные Слияния и Поглощения (M&A): Постпандемийный Обзор Рынка", sources: 67, artifacts: 6, date: "December 4" },
  { id: 14, title: "Глобальная Инфляция 2025: Влияние на Фондовые Рынки, Акции", sources: 87, artifacts: 8, date: "December 4" },
  { id: 15, title: "Инфляция 2025: Влияние на акции... Инфляция 2025: Влияние на акции", sources: 93, artifacts: 9, date: "December 3" },
  { id: 16, title: "Применение Искусственного Интеллекта в Due Diligence: Автоматизация", sources: 174, artifacts: 14, date: "December 3" },
];

export function useSearchProjects(query: string) {
  return useQuery<SearchResultItem[]>({
    queryKey: ["/api/projects/search", query],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/projects/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.length === 0 && !query) return MOCK_RESULTS;
        return data;
      } catch {
        if (!query) return MOCK_RESULTS;
        return MOCK_RESULTS.filter(r =>
          r.title.toLowerCase().includes(query.toLowerCase())
        );
      }
    },
    enabled: true,
  });
}
