import { useQuery } from "@tanstack/react-query";

export interface SourcePreview {
  content: string;
  rawFiles: { name: string; size: string; type: string }[];
  artifacts: { name: string; type: string; date: string }[];
}

const MOCK_PREVIEW_CONTENT = `Startup Obituary : Loopt
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

const MOCK_RAW_FILES = [
  { name: "loopt_financial_data.csv", size: "245 KB", type: "CSV" },
  { name: "screenshot_homepage.png", size: "1.2 MB", type: "Image" },
  { name: "press_release_2008.pdf", size: "890 KB", type: "PDF" },
];

const MOCK_ARTIFACTS = [
  { name: "Executive Summary - Loopt Analysis", type: "PDF", date: "10.05.2025" },
  { name: "Competitor Comparison Matrix", type: "XLSX", date: "10.05.2025" },
];

export function useSourceDetails(sourceId: number | null) {
  return useQuery<SourcePreview>({
    queryKey: ["/api/sources", sourceId, "details"],
    enabled: sourceId !== null,
    queryFn: async () => {
      try {
        const res = await fetch(`/api/sources/${sourceId}/details`);
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } catch {
        return {
          content: MOCK_PREVIEW_CONTENT,
          rawFiles: MOCK_RAW_FILES,
          artifacts: MOCK_ARTIFACTS,
        };
      }
    },
  });
}
