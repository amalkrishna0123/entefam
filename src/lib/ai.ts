"use server";

export async function analyzeExpenses(expenses: any[]) {
  const summary = expenses.map(e => `${e.category}: $${e.amount} (${e.description})`).join(', ');
  const prompt = encodeURIComponent(`Analyze these monthly family expenses: ${summary}. Provide 3 short, actionable bullet points emphasizing waste detection and savings suggestions. Keep it brief and strictly format as bullet points.`);
  
  try {
    const res = await fetch(`https://gen.pollinations.ai/text/${prompt}`, {
      headers: {
        'Authorization': 'Bearer sk_XctNYsAVsBlMQzKp654gMdRjRQlBZWLC'
      }
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`AI fetch failed: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return await res.text();
  } catch (error) {
    console.error('AI Expense Analysis Error:', error);
    return "• Error generating AI insights\n• Please try again later";
  }
}

export async function analyzeHealth(metrics: any[]) {
  const summary = metrics.map(m => `${m.metric}: ${m.value}`).join(', ');
  const prompt = encodeURIComponent(`Analyze these family health metrics: ${summary}. Provide 3 short, actionable bullet points. Detect any abnormal values. Suggest relevant diet and lifestyle tips. Keep it brief and strictly format as bullet points.`);
  
  try {
    const res = await fetch(`https://gen.pollinations.ai/text/${prompt}`, {
      headers: {
        'Authorization': 'Bearer sk_XctNYsAVsBlMQzKp654gMdRjRQlBZWLC'
      }
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`AI fetch failed: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return await res.text();
  } catch (error) {
    console.error('AI Health Analysis Error:', error);
    return "• Error generating AI insights\n• Please try again later";
  }
}

