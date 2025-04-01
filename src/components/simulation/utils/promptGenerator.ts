import { BusinessReport } from '../../../lib/report';

export function generatePrompt(
  idea: string, 
  perspective: string, 
  followUpQuestion?: string,
  businessReport?: BusinessReport
) {
  const reportContext = businessReport ? formatReportContext(businessReport) : '';
  const baseContext = `Analyze the following business idea for the restaurant/hospitality industry: "${idea}"
${reportContext}`;
  
  const basePrompt = followUpQuestion 
    ? `Based on the previous analysis of the business idea: "${idea}", please answer the following question: ${followUpQuestion}\n\nProvide a detailed response from the ${perspective} perspective.`
    : baseContext;

  if (followUpQuestion) return basePrompt;

  const perspectives = {
    optimistic: `Focus on providing an optimistic analysis that:
1. Highlights historical success stories and parallels
2. Identifies strong market opportunities
3. Outlines potential for growth and success
4. Provides concrete examples of similar successful ventures
5. Suggests immediate actionable steps for success

Format the response with clear sections:
- Market Opportunity
- Historical Parallels
- Growth Potential
- Action Steps
- Success Metrics`,

    neutral: `Provide a balanced, neutral analysis that:
1. Evaluates both strengths and weaknesses
2. Identifies potential challenges and uncertainties
3. Suggests moderate success probability (around 60-40)
4. Recommends careful next steps
5. Highlights areas needing refinement

Format the response with clear sections:
- Balanced Overview
- Key Challenges
- Success Factors
- Risk Assessment
- Recommended Improvements`,

    disruptive: `Provide a disruptive, innovative analysis that:
1. Identifies cutting-edge opportunities
2. Suggests bold, contrarian strategies
3. References successful industry disruptions
4. Outlines high-risk, high-reward scenarios
5. Proposes innovative business model adaptations

Format the response with clear sections:
- Disruptive Potential
- Innovation Opportunities
- Market Revolution
- Bold Strategies
- Breakthrough Metrics`
  };

  return `${basePrompt}\n\n${perspectives[perspective as keyof typeof perspectives] || ''}`;
}

function formatReportContext(report: BusinessReport): string {
  return `
Additional Business Context:
- Business Type: ${report.overview.businessType}
- Target Audience: ${report.overview.targetAudience.join(', ')}
- Current Services: ${report.overview.services.join(', ')}
- Peak Hours: ${report.operations.peakHours.join(', ')}
- Revenue Streams: ${report.financial.revenue.streams.join(', ')}
- Marketing Strategies: ${report.marketing.strategies.join(', ')}
- Main Competitor: ${report.competition.mainCompetitor || 'Not specified'}
- Business Goals:
  * Short-term: ${report.competition.goals.shortTerm.join(', ')}
  * Long-term: ${report.competition.goals.longTerm.join(', ')}
`;
}