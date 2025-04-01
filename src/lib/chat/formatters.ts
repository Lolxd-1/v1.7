import { BusinessReport } from '../report';
import { formatList } from './utils';

export function formatBusinessContext(report: BusinessReport): string {
  return `
BUSINESS ANALYSIS REPORT

1. BUSINESS OVERVIEW
   • Type of Business: ${report.overview?.businessType || 'Not specified'}
   • Target Customer Base: ${formatList(report.overview?.targetAudience)}
   • Available Services: ${formatList(report.overview?.services)}

2. OPERATIONAL DETAILS
   • Peak Business Hours: ${formatList(report.operations?.peakHours)}
   • Seasonal Peak Periods: ${formatList(report.operations?.peakSeasons)}
   • Current Management Structure: ${report.operations?.staffing?.management || 'Not specified'}
   • Staff Average Monthly Salary: ${report.operations?.staffing?.avgSalary || 'Not specified'}

3. FINANCIAL OVERVIEW
   • Active Revenue Streams: ${formatList(report.financial?.revenue?.streams)}
   • Sales Target Achievement Rate: ${report.financial?.revenue?.targetAchievement || 'Not specified'}
   • Current Debt Status: ${report.financial?.debt?.exists ? `Yes - Amount: ${report.financial.debt.amount}` : 'No outstanding debt'}
   • Major Monthly Expenses: ${formatList(report.financial?.expenses)}

4. MARKETING AND PRICING
   • Marketing Strategies: ${formatList(report.marketing?.strategies)}
   • Analytics Usage: ${report.marketing?.analytics?.usage ? `Yes - Using: ${report.marketing.analytics.tools}` : 'No analytics tools in use'}
   • Dynamic Pricing System: ${report.marketing?.pricing?.dynamic ? `Yes - Strategy: ${report.marketing.pricing.strategy}` : 'No dynamic pricing implemented'}
   • Discounts & Promotions: ${report.marketing.discounts?.join(', ') || 'Not specified'}
   • Referral Program: ${report.marketing.referralProgram?.exists ? `Yes - ${report.marketing.referralProgram.details}` : 'No'}

5. COMPETITION & GOALS
   • Main Competitor: ${report.competition?.mainCompetitor || 'Not identified'}
   • Short-term Goals: ${formatList(report.competition?.goals?.shortTerm)}
   • Long-term Goals: ${formatList(report.competition?.goals?.longTerm)}

6. KEY RECOMMENDATIONS
${(report.recommendations || []).map((rec, index) => `   ${index + 1}. ${rec}`).join('\n')}`;
}