import { useQuery } from "@tanstack/react-query";
import type { ThoughtNode, ResearchProgress } from "@/lib/types";

const MOCK_THOUGHT_STREAM: ThoughtNode[] = [
  {
    id: "t1", type: "thinking", title: "Determining the architecture of Parallel.ai",
    content: 'I am starting with a detailed study of the Parallel.ai platform to precisely determine what lies behind the term "processors." At this stage, I assume that these are specialized agent structures or modules for data processing, and not physical equipment. I need to understand their internal classification and working principles to match them accurately with the intellectual tools of search.',
  },
  {
    id: "t2", type: "thinking", title: "Competitive environment analysis",
    content: "In parallel, I am synthesizing information about the current capabilities of deep search modes from leading market players such as OpenAI, Perplexity, Google, xAI and Anthropic. This will allow me to identify key metrics for comparison, including the depth of autonomous research, the ability for complex reasoning, and the quality of the final data synthesis, in order to objectively assess the position of Parallel.ai.",
  },
  {
    id: "t3", type: "thinking", title: "Directions for further search",
    content: "My next steps will be aimed at finding specific technical descriptions of processor types within Parallel.ai and their functional differences. I plan to collect detailed characteristics for each type in order to form a complete comparative table structure and clearly display the advantages and limitations of each solution in the context of deep research.",
  },
  {
    id: "s1", type: "sources", title: "Researching websites",
    sources: [
      { favicon: "https://www.google.com/s2/favicons?domain=parallelai.tech&sz=16", domain: "parallelai.tech", title: "ParallelAI" },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Parallel | Web Sea..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "The best web sea..." },
      { favicon: "https://www.google.com/s2/favicons?domain=docs.parallel.ai&sz=16", domain: "docs.p...", title: "Processors - Par..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing the P..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing the P..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing the T..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Building a real-ti..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Introducing Parall..." },
      { favicon: "https://www.google.com/s2/favicons?domain=reddit.com&sz=16", domain: "reddit...", title: "I compared the r..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Parallel Task API ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "How to build a m..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "Parallel Deep Res..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "State of the Art D..." },
      { favicon: "https://www.google.com/s2/favicons?domain=parallel.ai&sz=16", domain: "paralle...", title: "A new pareto-fro..." },
    ],
  },
  {
    id: "t4", type: "thinking", title: "Classification of intelligent processors",
    content: 'I have studied the architecture of Parallel.ai in detail and found that different levels of AI agent power for web research are hidden behind the term "processors." The lineup ranges from lightweight solutions for quickly extracting metadata to ultra-deep systems capable of conducting complex searches of up to 90 minutes. I found that the system divides processors into standard and fast, offering a flexible choice between data relevance and task execution speed.',
  },
  {
    id: "t5", type: "thinking", title: "Data synthesis and identified contradictions",
    content: 'Synthesizing the information received, I have recorded ambitious claims by the platform about surpassing human researchers and leading models like GPT-5 and Gemini in specialized tests. However, to create a complete picture, I need to fill in the gaps in the descriptions of specific "deep search" modes from competitors such as Anthropic and xAI, to understand whether they offer comparable agent autonomy or are limited only to an extended search context.',
  },
  {
    id: "t6", type: "thinking", title: "Next steps for system comparison",
    content: "In the near future, I plan to focus on studying the official documentation and tariff plans to correlate the cost and efficiency of each type of processor. In parallel, I will conduct a deep analysis of the Deep Research functionality of the largest market players, including OpenAI and Perplexity. This will allow me to form the final comparative table, where the time of autonomous work, the depth of analysis, and the cost of each solution will be clearly reflected.",
  },
  {
    id: "s2", type: "sources", title: "Researching websites",
    sources: [
      { favicon: "https://www.google.com/s2/favicons?domain=help.openai.com&sz=16", domain: "help.o...", title: "Apps in ChatGPT ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=platform.openai.com&sz=16", domain: "platform.o...", title: "Changelog | ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=medium.com&sz=16", domain: "mediu...", title: "OpenAI releases ..." },
      { favicon: "https://www.google.com/s2/favicons?domain=openai.com&sz=16", domain: "openr...", title: "o3 Deep Researc..." },
      { favicon: "https://www.google.com/s2/favicons?domain=openai.com&sz=16", domain: "openai...", title: "ChatGPT agent S..." },
      { favicon: "https://www.google.com/s2/favicons?domain=docs.perplexity.ai&sz=16", domain: "docs.pe...", title: "Sonar deep rese..." },
      { favicon: "https://www.google.com/s2/favicons?domain=apidog.com&sz=16", domain: "apidog...", title: "How to Use Perpl..." },
      { favicon: "https://www.google.com/s2/favicons?domain=openai.com&sz=16", domain: "openr...", title: "Sonar Deep Rese..." },
    ],
  },
];

export function useResearchProgress(projectId: string) {
  return useQuery<ResearchProgress>({
    queryKey: ["/api/projects", projectId, "progress"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/progress`);
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } catch {
        return {
          projectId,
          elapsedSeconds: 45,
          thoughtStream: MOCK_THOUGHT_STREAM,
          status: "running" as const,
        };
      }
    },
    refetchInterval: 5000,
  });
}
