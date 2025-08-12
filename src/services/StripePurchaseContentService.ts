/**
 * Simplified Purchase Content Delivery - Stripe Only
 * Handles content delivery based on Stripe subscription status
 * No Firestore dependency - uses localStorage and Stripe webhooks
 */
import { Question } from '../types';
import { LocalQuestionService } from './LocalQuestionService';

interface PurchaseRecord {
  bundleId: string;
  stripeProductId: string;
  purchasedAt: Date;
  questionsDownloaded: boolean;
  downloadedAt?: Date;
  status: 'active' | 'refunded' | 'cancelled';
}

export class StripePurchaseContentService {
  private static readonly PURCHASES_KEY = 'stripe_purchases';

  /**
   * Record a purchase from Stripe webhook
   */
  static recordPurchase(stripeProductId: string, customerId: string): void {
    const bundleId = this.getProductToBundleMap()[stripeProductId];
    if (!bundleId) {
      console.warn('Unknown Stripe product ID:', stripeProductId);
      return;
    }

    const purchase: PurchaseRecord = {
      bundleId,
      stripeProductId,
      purchasedAt: new Date(),
      questionsDownloaded: false,
      status: 'active'
    };

    this.storePurchase(purchase);
    console.log('Purchase recorded:', purchase);
  }

  /**
   * Get questions for a purchased bundle
   */
  static getQuestionsForPurchase(bundleId: string): Question[] {
    if (!this.isPurchased(bundleId)) {
      throw new Error('Bundle not purchased');
    }

    const questions = LocalQuestionService.getQuestionsForBundle(bundleId);
    this.markQuestionsDownloaded(bundleId);
    
    return questions;
  }

  /**
   * Check if a bundle has been purchased
   */
  static isPurchased(bundleId: string): boolean {
    const purchases = this.getPurchases();
    return purchases.some(p => p.bundleId === bundleId && p.status === 'active');
  }

  /**
   * Get all purchased bundles
   */
  static getPurchasedBundles(): string[] {
    const purchases = this.getPurchases();
    return purchases
      .filter(p => p.status === 'active')
      .map(p => p.bundleId);
  }

  /**
   * Mark questions as downloaded
   */
  private static markQuestionsDownloaded(bundleId: string): void {
    const purchases = this.getPurchases();
    const purchase = purchases.find(p => p.bundleId === bundleId);
    
    if (purchase && !purchase.questionsDownloaded) {
      purchase.questionsDownloaded = true;
      purchase.downloadedAt = new Date();
      this.storePurchases(purchases);
    }
  }

  /**
   * Store a single purchase
   */
  private static storePurchase(purchase: PurchaseRecord): void {
    const purchases = this.getPurchases();
    
    // Remove any existing purchase for the same bundle
    const filtered = purchases.filter(p => p.bundleId !== purchase.bundleId);
    filtered.push(purchase);
    
    this.storePurchases(filtered);
  }

  /**
   * Store all purchases
   */
  private static storePurchases(purchases: PurchaseRecord[]): void {
    localStorage.setItem(this.PURCHASES_KEY, JSON.stringify(purchases));
  }

  /**
   * Get all purchases from localStorage
   */
  private static getPurchases(): PurchaseRecord[] {
    try {
      const stored = localStorage.getItem(this.PURCHASES_KEY);
      if (!stored) return [];
      
      const purchases = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      return purchases.map((p: any) => ({
        ...p,
        purchasedAt: new Date(p.purchasedAt),
        downloadedAt: p.downloadedAt ? new Date(p.downloadedAt) : undefined
      }));
    } catch (error) {
      console.error('Error reading purchases:', error);
      return [];
    }
  }

  /**
   * Cancel a purchase (from refund webhook)
   */
  static cancelPurchase(stripeProductId: string): void {
    const purchases = this.getPurchases();
    const purchase = purchases.find(p => p.stripeProductId === stripeProductId);
    
    if (purchase) {
      purchase.status = 'refunded';
      this.storePurchases(purchases);
      console.log('Purchase cancelled:', purchase);
    }
  }

  /**
   * Clear all purchase data (for testing)
   */
  static clearPurchases(): void {
    localStorage.removeItem(this.PURCHASES_KEY);
  }

  /**
   * Get purchase statistics
   */
  static getPurchaseStats(): {
    totalPurchases: number;
    activePurchases: number;
    downloadedBundles: number;
  } {
    const purchases = this.getPurchases();
    return {
      totalPurchases: purchases.length,
      activePurchases: purchases.filter(p => p.status === 'active').length,
      downloadedBundles: purchases.filter(p => p.questionsDownloaded).length
    };
  }

  /**
   * Map Stripe Product IDs to Bundle IDs
   */
  private static getProductToBundleMap(): Record<string, string> {
    return {
      // Regional Bundles
      'prod_Sc1cAYaPVIFRnm': 'region_pack_egypt',
      'prod_Sc1cJRaC4oR6kR': 'region_pack_rome',
      'prod_Sc1cheDu2aPo24': 'region_pack_greece',
      'prod_Sc1c49nwMU5uCa': 'region_pack_mesopotamia',
      'prod_Sc1cjZLEoeLV59': 'region_pack_china',
      'prod_ScLQ5j27CiOLtK': 'region_pack_india',
      'prod_ScLS6NZofkzkv3': 'region_pack_americas',
      'prod_ScLSh6yyVtIN11': 'region_pack_europe',
      
      // Time Period Packs
      'prod_ScLSVWDcZ7gh5T': 'age_pack_bronze_age',
      'prod_ScLSgqSFOxxnKH': 'age_pack_iron_age',
      'prod_ScLSrZyoSgGq1o': 'age_pack_classical',
      'prod_ScLT1y5vNi23o6': 'age_pack_medieval',
      'prod_ScLT7B9kXgZmQd': 'age_pack_renaissance'
    };
  }
}
