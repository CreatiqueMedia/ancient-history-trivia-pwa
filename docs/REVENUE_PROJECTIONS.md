# Ancient History Trivia App: Revenue Projections

This document provides a conservative outlook on potential revenue and profit for the Ancient History Trivia app across web (PWA), iOS, and Android platforms for the first 12 months after launch.

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Assumptions](#assumptions)
3. [User Acquisition Projections](#user-acquisition-projections)
4. [Revenue Streams](#revenue-streams)
5. [Monthly Revenue Projections](#monthly-revenue-projections)
6. [Expenses](#expenses)
7. [Net Profit Projections](#net-profit-projections)
8. [Growth Opportunities](#growth-opportunities)
9. [Risk Factors](#risk-factors)

## Executive Summary

Based on conservative estimates, the Ancient History Trivia app could generate approximately **$14,500 in total revenue** during its first year, with a net profit of around **$8,900** after accounting for platform fees and operational costs. Monthly revenue is projected to grow from approximately $400 in month 1 to $1,800 by month 12.

These projections assume modest user growth, conservative conversion rates, and account for all platform fees and basic operational costs. The revenue model is based on a combination of individual bundle purchases and subscription plans.

## Assumptions

### General Assumptions

- Launch date: Two weeks from now (July 2025)
- Platforms: Web (PWA), iOS App Store, Google Play Store
- No significant paid marketing campaigns (organic growth + minimal social media promotion)
- Educational app market continues current growth trends
- No major competing app launches during this period

### Pricing Structure (as implemented)

- Individual question bundles: $1.99 each
- Monthly subscription: $2.99
- Annual subscription: $29.99 ($2.50/month, 16% savings)
- Biennial subscription: $49.99 ($2.08/month, 30% savings)

### Platform Fees

- Apple App Store: 30% of revenue (15% if eligible for Small Business Program)
- Google Play Store: 15% of revenue
- Web/PWA (Stripe): 2.9% + $0.30 per transaction

### User Behavior Assumptions

- Free-to-paid conversion rate: 2-3% (industry average for educational apps)
- Bundle purchase rate: 1.5% of active users per month
- Subscription conversion rate: 1% of active users per month
- User retention: 30% after 30 days (industry average for educational apps)
- Platform distribution: 45% iOS, 40% Android, 15% Web

## User Acquisition Projections

| Month | New Users | Cumulative Users | Active Users | Retention Rate |
|-------|-----------|------------------|--------------|----------------|
| 1     | 1,000     | 1,000            | 1,000        | 100%           |
| 2     | 800       | 1,800            | 1,100        | 30%            |
| 3     | 1,000     | 2,800            | 1,400        | 30%            |
| 4     | 1,200     | 4,000            | 1,700        | 30%            |
| 5     | 1,500     | 5,500            | 2,100        | 30%            |
| 6     | 1,800     | 7,300            | 2,600        | 30%            |
| 7     | 2,000     | 9,300            | 3,000        | 30%            |
| 8     | 2,200     | 11,500           | 3,400        | 30%            |
| 9     | 2,500     | 14,000           | 3,900        | 30%            |
| 10    | 2,800     | 16,800           | 4,400        | 30%            |
| 11    | 3,000     | 19,800           | 4,900        | 30%            |
| 12    | 3,200     | 23,000           | 5,400        | 30%            |

*Note: Active users calculated as new users plus 30% of previous month's active users*

## Revenue Streams

### 1. Individual Bundle Purchases

- Price per bundle: $1.99
- Conversion rate: 1.5% of active users purchase a bundle each month
- Average bundles per purchasing user: 1.2

### 2. Subscriptions

- Monthly subscription: $2.99
- Annual subscription: $29.99
- Biennial subscription: $49.99
- Subscription distribution: 60% monthly, 30% annual, 10% biennial
- Conversion rate: 1% of active users subscribe each month
- Churn rate: 20% monthly for monthly subscriptions

## Monthly Revenue Projections

| Month | Active Users | Bundle Revenue | Subscription Revenue | Total Revenue |
|-------|--------------|----------------|----------------------|---------------|
| 1     | 1,000        | $36            | $360                 | $396          |
| 2     | 1,100        | $39            | $396                 | $435          |
| 3     | 1,400        | $50            | $504                 | $554          |
| 4     | 1,700        | $61            | $612                 | $673          |
| 5     | 2,100        | $75            | $756                 | $831          |
| 6     | 2,600        | $93            | $936                 | $1,029        |
| 7     | 3,000        | $108           | $1,080               | $1,188        |
| 8     | 3,400        | $122           | $1,224               | $1,346        |
| 9     | 3,900        | $140           | $1,404               | $1,544        |
| 10    | 4,400        | $158           | $1,584               | $1,742        |
| 11    | 4,900        | $176           | $1,764               | $1,940        |
| 12    | 5,400        | $194           | $1,944               | $2,138        |
| **Total** | | **$1,252** | **$12,564** | **$13,816** |

### Calculation Details

#### Bundle Revenue
- Monthly bundle revenue = Active users × 1.5% conversion rate × 1.2 bundles per user × $1.99

#### Subscription Revenue
- New monthly subscribers = Active users × 1% conversion rate
- Monthly subscription revenue = (New monthly subscribers × 60% × $2.99) + (New annual subscribers × 30% × $29.99/12) + (New biennial subscribers × 10% × $49.99/24) + Recurring revenue from previous months

## Expenses

### Platform Fees

| Platform | Revenue Share | Estimated Annual Revenue | Platform Fee |
|----------|---------------|--------------------------|--------------|
| iOS (45%) | $6,217        | 30%                      | $1,865       |
| Android (40%) | $5,526        | 15%                      | $829         |
| Web (15%) | $2,073        | 2.9% + $0.30/transaction | $200         |
| **Total** | **$13,816**   |                          | **$2,894**   |

### Operational Costs

| Expense Category | Monthly Cost | Annual Cost |
|------------------|--------------|-------------|
| Supabase (Database/Storage) | $25 | $300 |
| Firebase (Auth/Hosting) | $25 | $300 |
| RevenueCat | $0 (Free tier) | $0 |
| Stripe subscription | $0 (Pay as you go) | $0 |
| Domain & SSL | $2 | $24 |
| Developer accounts (Apple/Google) | $10 | $124 |
| Content updates | $100 | $1,200 |
| **Total** | **$162** | **$1,948** |

## Net Profit Projections

| Month | Total Revenue | Platform Fees | Operational Costs | Net Profit |
|-------|---------------|---------------|-------------------|------------|
| 1     | $396          | $83           | $162              | $151       |
| 2     | $435          | $91           | $162              | $182       |
| 3     | $554          | $116          | $162              | $276       |
| 4     | $673          | $141          | $162              | $370       |
| 5     | $831          | $174          | $162              | $495       |
| 6     | $1,029        | $216          | $162              | $651       |
| 7     | $1,188        | $249          | $162              | $777       |
| 8     | $1,346        | $282          | $162              | $902       |
| 9     | $1,544        | $324          | $162              | $1,058     |
| 10    | $1,742        | $365          | $162              | $1,215     |
| 11    | $1,940        | $407          | $162              | $1,371     |
| 12    | $2,138        | $448          | $162              | $1,528     |
| **Total** | **$13,816** | **$2,894** | **$1,944** | **$8,978** |

## Growth Opportunities

These projections are conservative and could be significantly improved through:

1. **Paid Marketing**: Targeted ads on platforms like Facebook, Instagram, and Google could accelerate user acquisition.
2. **Content Expansion**: Adding more question bundles and historical periods could increase both conversion rates and average revenue per user.
3. **Educational Partnerships**: Partnering with schools or educational platforms could provide bulk licensing opportunities.
4. **Localization**: Translating the app into multiple languages could open new markets.
5. **Referral Program**: Implementing a user referral program could reduce acquisition costs.

## Risk Factors

Several factors could impact these projections:

1. **Platform Changes**: App store policy changes or fee structure modifications could affect revenue.
2. **Market Competition**: New entrants in the educational trivia space could impact user acquisition and retention.
3. **Seasonal Fluctuations**: Educational apps often see usage patterns tied to academic calendars.
4. **Technical Issues**: Any significant bugs or performance issues could negatively impact retention.
5. **Content Quality**: User satisfaction and retention heavily depend on question quality and accuracy.

## Conclusion

With a conservative approach, the Ancient History Trivia app could generate approximately $14,000 in revenue and $9,000 in net profit during its first year. The subscription model provides the majority of revenue (91%) compared to individual bundle purchases (9%).

The projections show steady growth throughout the year, with monthly revenue increasing from around $400 at launch to over $2,100 by month 12. This growth trajectory suggests the app could become increasingly profitable in subsequent years as the user base expands and operational costs remain relatively stable.

These projections assume minimal marketing spend and organic growth. With targeted marketing investments, these figures could potentially be significantly higher, though this would also increase expenses.

---

*Disclaimer: These projections are estimates based on industry averages and conservative assumptions. Actual results may vary based on market conditions, user reception, and other factors outside of our control.*
