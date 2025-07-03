# 💳 Stripe Bank Account Setup & Payout Guide

This guide covers setting up your bank account in Stripe and understanding how payouts work.

## 🏦 Stripe Payout System Overview

### How Stripe Holds & Transfers Money

**Yes, Stripe holds money temporarily before transferring to your bank account.** Here's how it works:

#### 1. **Payment Processing Flow**
```
Customer Payment → Stripe Account → Your Bank Account
     (Instant)    →   (Held)     →   (Scheduled)
```

#### 2. **Holding Periods**
- **New Accounts**: 7-14 days initial hold
- **Established Accounts**: 2-7 days standard hold
- **High-Risk Transactions**: Up to 90 days (rare)

#### 3. **Payout Schedule**
- **Daily**: Available for most accounts (recommended)
- **Weekly**: Standard option
- **Monthly**: Available but not recommended
- **Manual**: You control when payouts happen

## 🔧 Setting Up Your Bank Account

### Step 1: Access Stripe Dashboard
1. Go to: https://dashboard.stripe.com
2. Navigate to **Settings** → **Payouts**
3. Click **Add bank account**

### Step 2: Required Information
You'll need to provide:

#### **Business Information**
- Business name (or your legal name for sole proprietorship)
- Business type (Individual, LLC, Corporation, etc.)
- Tax ID (EIN or SSN)
- Business address

#### **Bank Account Details**
- **Routing Number**: 9-digit bank routing number
- **Account Number**: Your checking account number
- **Account Type**: Checking (recommended) or Savings
- **Account Holder Name**: Must match your Stripe account

#### **Identity Verification**
- **Government ID**: Driver's license, passport, or state ID
- **Address Verification**: Utility bill or bank statement
- **Business Documents**: Articles of incorporation (if applicable)

### Step 3: Verification Process
1. **Micro-deposits**: Stripe sends 2 small deposits (usually $0.01-$0.99)
2. **Verify amounts**: Enter the exact amounts in your Stripe dashboard
3. **Timeline**: 1-2 business days for verification

## 💰 Understanding Stripe Fees & Payouts

### Transaction Fees
- **Credit Cards**: 2.9% + $0.30 per transaction
- **ACH/Bank Transfers**: 0.8% (capped at $5.00)
- **International Cards**: +1.5% additional
- **Disputes/Chargebacks**: $15.00 fee

### Payout Fees
- **Standard Payouts**: FREE (ACH transfer)
- **Instant Payouts**: 1.5% (minimum $0.50, maximum $15.00)
- **International Payouts**: Varies by country

### Example Calculation
```
Customer pays: $29.99 (Pro Monthly)
Stripe fee: $1.17 (2.9% + $0.30)
Your payout: $28.82
```

## 📅 Payout Timeline & Schedule

### New Account Timeline
```
Day 1: First sale
Day 8-15: First payout (after verification)
Day 16+: Regular payout schedule begins
```

### Regular Payout Schedule
- **Daily Payouts**: Money from Monday goes out Tuesday
- **Weekend Sales**: Paid out on Monday
- **Holidays**: Delayed by 1 business day

### Payout Calendar Example
```
Monday Sale → Tuesday Payout
Tuesday Sale → Wednesday Payout
Friday Sale → Monday Payout
Saturday Sale → Monday Payout
Sunday Sale → Monday Payout
```

## 🚨 Common Issues & Solutions

### Account Verification Delays
**Problem**: Account verification taking longer than expected
**Solutions**:
- Ensure all documents are clear and legible
- Use official government-issued ID
- Provide recent utility bills (within 90 days)
- Contact Stripe support if delayed beyond 7 days

### Bank Account Verification Failed
**Problem**: Micro-deposit verification failing
**Solutions**:
- Check account number and routing number
- Ensure account is in your name
- Use checking account (not savings)
- Contact your bank to confirm account status

### Delayed Payouts
**Problem**: Payouts taking longer than expected
**Reasons**:
- New account (7-14 day hold)
- High transaction volume
- Risk assessment by Stripe
- Bank holidays or weekends

## 🔒 Security & Compliance

### Required Documentation
- **Individual**: Government ID + Bank statement
- **Business**: EIN + Articles of incorporation + Bank statement
- **International**: Additional country-specific requirements

### Compliance Requirements
- **PCI DSS**: Stripe handles this automatically
- **Tax Reporting**: 1099-K forms for $20,000+ annually
- **KYC/AML**: Know Your Customer verification required

## 💡 Best Practices

### 1. **Choose Daily Payouts**
- Faster cash flow
- Better for business operations
- No additional fees

### 2. **Monitor Your Dashboard**
- Check for failed payments
- Review dispute notifications
- Track payout schedules

### 3. **Keep Documentation**
- Save all verification documents
- Keep records of payouts
- Document any disputes

### 4. **Set Up Notifications**
- Email alerts for payouts
- Webhook notifications for your app
- SMS alerts for important events

## 🎯 For Your Ancient History Trivia App

### Expected Revenue Flow
```
Pro Monthly ($29.99):
- Stripe Fee: $1.17
- Your Revenue: $28.82
- Monthly Goal (100 users): $2,882

Pro Annual ($199.99):
- Stripe Fee: $6.10
- Your Revenue: $193.89
- Annual Goal (100 users): $19,389
```

### Recommended Setup
1. **Payout Schedule**: Daily
2. **Account Type**: Business checking account
3. **Notifications**: Enable all payout alerts
4. **Webhooks**: Set up for subscription events

## 📞 Getting Help

### Stripe Support
- **Dashboard**: Help section in Stripe dashboard
- **Email**: support@stripe.com
- **Phone**: Available for verified accounts
- **Documentation**: https://stripe.com/docs

### Common Support Topics
- Account verification issues
- Payout delays
- Fee questions
- Integration help

## 🔄 Next Steps

1. **Set up bank account** in Stripe dashboard
2. **Complete verification** process
3. **Test with small transaction** to verify flow
4. **Enable daily payouts** for better cash flow
5. **Set up monitoring** and notifications

---

**Important**: Stripe is required by law to verify your identity and business information. This process protects both you and your customers, and ensures compliance with financial regulations.

**Timeline**: Allow 3-7 business days for complete setup and first payout after verification.
