# 🌐 Custom Domain Setup Guide: ancient-history-trivia.app

This guide shows you exactly where and how to configure your custom domain.

## 📋 Overview
We're setting up `ancient-history-trivia.app` as your custom domain to solve the Stripe redirect issue and provide professional branding.

---

## 🛒 Step 1: Purchase the Domain

### Where to Buy:
Choose any domain registrar. Popular options:

**Recommended Registrars:**
- **Namecheap** (https://www.namecheap.com) - Usually cheapest
- **Google Domains** (https://domains.google.com) - Easy integration
- **Cloudflare** (https://www.cloudflare.com/products/registrar/) - Best performance
- **GoDaddy** (https://www.godaddy.com) - Most popular

### What to Search For:
- Search for: `ancient-history-trivia.app`
- Price: Usually $10-15/year for .app domains
- Add to cart and complete purchase

---

## 🔧 Step 2: Firebase Domain Configuration

### Where to Configure:
1. **Go to Firebase Console**: https://console.firebase.google.com/project/ancient-history-trivia/hosting/main

2. **Navigate to Hosting**:
   - Click "Hosting" in the left sidebar
   - You should see your current site: `ancient-history-trivia.web.app`

3. **Add Custom Domain**:
   - Click the "Add custom domain" button
   - Enter: `ancient-history-trivia.app`
   - Click "Continue"

4. **Firebase Will Show You DNS Records**:
   Firebase will display something like:
   ```
   Add these DNS records to your domain:
   
   Type: A
   Name: @ (or leave blank)
   Value: 151.101.1.195
   
   Type: A  
   Name: @ (or leave blank)
   Value: 151.101.65.195
   
   Type: CNAME
   Name: www
   Value: ancient-history-trivia.web.app
   ```
   *(The actual IP addresses will be different)*

---

## 🌐 Step 3: DNS Configuration

### Where to Configure DNS:
Go to your domain registrar's DNS management panel:

#### **For Namecheap:**
1. Log into Namecheap account
2. Go to "Domain List"
3. Click "Manage" next to `ancient-history-trivia.app`
4. Click "Advanced DNS" tab

#### **For Google Domains:**
1. Log into Google Domains
2. Click on `ancient-history-trivia.app`
3. Click "DNS" in the left sidebar

#### **For Cloudflare:**
1. Log into Cloudflare
2. Click on `ancient-history-trivia.app`
3. Click "DNS" tab

#### **For GoDaddy:**
1. Log into GoDaddy account
2. Go to "My Products"
3. Click "DNS" next to `ancient-history-trivia.app`

### What DNS Records to Add:
Copy the exact records Firebase showed you. They'll look like:

**Record 1:**
- Type: `A`
- Name: `@` (or leave blank, or use `ancient-history-trivia.app`)
- Value: `[IP address from Firebase]`
- TTL: `Auto` or `3600`

**Record 2:**
- Type: `A`
- Name: `@` (or leave blank, or use `ancient-history-trivia.app`)
- Value: `[Second IP address from Firebase]`
- TTL: `Auto` or `3600`

**Record 3:**
- Type: `CNAME`
- Name: `www`
- Value: `ancient-history-trivia.web.app`
- TTL: `Auto` or `3600`

### Screenshots of Common DNS Panels:

#### Namecheap DNS Panel:
```
Type    Host    Value                   TTL
A       @       151.101.1.195          Automatic
A       @       151.101.65.195         Automatic  
CNAME   www     ancient-history-trivia.web.app    Automatic
```

#### Google Domains DNS Panel:
```
Name                          Type    TTL    Data
ancient-history-trivia.app    A       3600   151.101.1.195
ancient-history-trivia.app    A       3600   151.101.65.195
www                          CNAME   3600   ancient-history-trivia.web.app
```

---

## ⏱️ Step 4: Wait for DNS Propagation

### How Long:
- **Minimum**: 15 minutes
- **Typical**: 2-4 hours  
- **Maximum**: 48 hours

### How to Check:
1. **DNS Checker**: https://dnschecker.org
   - Enter: `ancient-history-trivia.app`
   - Check if A records show Firebase IPs globally

2. **Command Line** (Mac/Linux):
   ```bash
   dig ancient-history-trivia.app
   nslookup ancient-history-trivia.app
   ```

3. **Browser Test**:
   - Try visiting: `https://ancient-history-trivia.app`
   - Should show your app (may take time)

---

## 🔐 Step 5: SSL Certificate

### Automatic:
- Firebase automatically provisions SSL certificates
- Usually takes 15-60 minutes after DNS propagation
- You'll see a green lock icon when ready

### Verification:
- Visit: `https://ancient-history-trivia.app`
- Should show secure connection (green lock)

---

## 💳 Step 6: Update Stripe Payment Links

### Where to Update:
1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/payment-links

2. **For Each Payment Link**:
   - Click on the payment link
   - Click "Edit"
   - Update "After payment" redirect URL
   - Change from: `https://ancient-history-pwa.web.app/success`
   - Change to: `https://ancient-history-trivia.app/success`
   - Save changes

### Payment Links to Update:
- Pro Monthly subscription
- Pro Annual subscription  
- Egypt bundle
- Rome bundle
- Greece bundle
- Mesopotamia bundle
- China bundle

---

## 🧪 Step 7: Test Complete Flow

### Test Checklist:
1. ✅ Visit `https://ancient-history-trivia.app` - loads your app
2. ✅ Visit `https://www.ancient-history-trivia.app` - redirects to main domain
3. ✅ SSL certificate shows green lock
4. ✅ Click a purchase button → Stripe checkout loads
5. ✅ Complete test payment → Redirects to success page
6. ✅ Success page loads on custom domain

---

## 🆘 Troubleshooting

### Common Issues:

#### "Site Not Found" Error:
- **Cause**: DNS not propagated yet
- **Solution**: Wait longer, check DNS propagation

#### "Not Secure" Warning:
- **Cause**: SSL certificate not ready yet
- **Solution**: Wait 15-60 minutes after DNS propagation

#### Stripe Redirect Error:
- **Cause**: Haven't updated Stripe payment links yet
- **Solution**: Update all payment links in Stripe dashboard

#### DNS Records Not Working:
- **Cause**: Incorrect DNS configuration
- **Solution**: Double-check records match Firebase exactly

---

## 📞 Support Resources

### Firebase Support:
- Documentation: https://firebase.google.com/docs/hosting/custom-domain
- Community: https://firebase.google.com/support

### Domain Registrar Support:
- **Namecheap**: Live chat available
- **Google Domains**: Help center with guides
- **Cloudflare**: Community forum and docs
- **GoDaddy**: Phone and chat support

### DNS Tools:
- **DNS Checker**: https://dnschecker.org
- **What's My DNS**: https://www.whatsmydns.net
- **DNS Lookup**: https://mxtoolbox.com/DNSLookup.aspx

---

## ✅ Success Checklist

Mark each item when completed:

- [ ] Domain purchased: `ancient-history-trivia.app`
- [ ] Custom domain added in Firebase Console
- [ ] DNS A records added (2 records)
- [ ] DNS CNAME record added (www)
- [ ] DNS propagation confirmed
- [ ] SSL certificate active (green lock)
- [ ] Stripe payment links updated (7 links)
- [ ] Complete payment flow tested
- [ ] App accessible at custom domain

---

**🎉 Once all items are checked, your custom domain is fully configured and the Stripe redirect issue is solved!**
