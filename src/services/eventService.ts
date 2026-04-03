import { GoogleGenAI, Type } from "@google/genai";
import { Event } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function fetchEvents(): Promise<Event[]> {
  try {
    const prompt = `
      오늘 날짜는 2026년 4월 3일입니다. 대한민국(한국)에서 열리는 최신 IT 및 AI 관련 행사(컨퍼런스, 세미나, 해커톤, 미트업)를 찾아주세요.
      특히 2026년 4월 이후에 열리는 행사들을 우선적으로 찾아주세요.
      무료 행사를 중심으로 찾아주되, 중요한 유료 행사도 포함할 수 있습니다.
      
      각 행사에 대해 다음 정보를 포함해야 합니다:
      1. 제목 (title)
      2. 날짜 (date) - 예: "2026.04.15" 또는 "2026년 5월 중"
      3. 장소 (location) - 오프라인 장소 또는 "온라인"
      4. 주최 (organizer)
      5. 무료 여부 (isFree) - boolean
      6. 등록 상태 (registrationStatus) - 'open'(신청 가능), 'closed'(마감), 'upcoming'(예정) 중 하나
      7. 카테고리 (category) - 'AI', 'IT', 'Development', 'Conference', 'Meetup' 중 하나
      8. 공식 신청 링크 (link)
      9. 상세 설명 (description) - 한국어로 1-2문장 요약.

      결과는 반드시 지정된 JSON 스키마 형식의 배열로 반환하세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              date: { type: Type.STRING },
              location: { type: Type.STRING },
              organizer: { type: Type.STRING },
              isFree: { type: Type.BOOLEAN },
              registrationStatus: { 
                type: Type.STRING,
                enum: ['open', 'closed', 'upcoming']
              },
              category: { 
                type: Type.STRING,
                enum: ['AI', 'IT', 'Development', 'Conference', 'Meetup']
              },
              link: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["title", "date", "location", "isFree", "registrationStatus", "link", "description"]
          }
        }
      },
    });

    const text = response.text;
    if (!text) return [];
    
    const events = JSON.parse(text) as Event[];
    // Add unique IDs if missing
    return events.map((e, index) => ({
      ...e,
      id: e.id || `event-${Date.now()}-${index}`
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
