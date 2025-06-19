import { QuestionBundle, BundleVersion } from '../types/bundles';

export interface VersionedBundle extends QuestionBundle {
  allVersions: BundleVersion[];
  currentVersion: string;
}

export class VersionManagementService {
  /**
   * Get all current (latest) versions of bundles
   */
  static getCurrentVersionBundles(bundles: QuestionBundle[]): QuestionBundle[] {
    return bundles.filter(bundle => bundle.isCurrentVersion);
  }

  /**
   * Get all legacy versions of bundles
   */
  static getLegacyVersionBundles(bundles: QuestionBundle[]): QuestionBundle[] {
    return bundles.filter(bundle => !bundle.isCurrentVersion);
  }

  /**
   * Group bundles by base ID (without version)
   */
  static groupBundlesByBaseId(bundles: QuestionBundle[]): Map<string, VersionedBundle[]> {
    const grouped = new Map<string, VersionedBundle[]>();
    
    bundles.forEach(bundle => {
      const baseId = this.getBaseId(bundle.id);
      
      if (!grouped.has(baseId)) {
        grouped.set(baseId, []);
      }
      
      const versionedBundle: VersionedBundle = {
        ...bundle,
        allVersions: bundles
          .filter(b => this.getBaseId(b.id) === baseId)
          .map(b => ({
            version: b.version,
            releaseDate: b.releaseDate,
            questionCount: b.questionCount,
            sampleQuestions: b.sampleQuestions || [],
            isAvailable: true,
            price: b.price
          }))
          .sort((a, b) => this.compareVersions(b.version, a.version)), // Latest first
        currentVersion: bundle.version
      };
      
      grouped.get(baseId)!.push(versionedBundle);
    });
    
    return grouped;
  }

  /**
   * Get the base ID without version suffix
   */
  private static getBaseId(bundleId: string): string {
    // Remove version suffix like "_v1", "_v2" etc.
    return bundleId.replace(/_v\d+$/, '');
  }

  /**
   * Compare version strings (v1, v2, etc.)
   */
  private static compareVersions(a: string, b: string): number {
    const getVersionNumber = (version: string) => {
      const match = version.match(/v(\d+)/);
      return match ? parseInt(match[1]) : 0;
    };
    
    return getVersionNumber(a) - getVersionNumber(b);
  }

  /**
   * Generate next version string
   */
  static getNextVersion(currentVersion: string): string {
    const match = currentVersion.match(/v(\d+)/);
    if (!match) return 'v2';
    
    const versionNumber = parseInt(match[1]);
    return `v${versionNumber + 1}`;
  }

  /**
   * Create a new version of a bundle
   */
  static createNewVersion(
    baseBundle: QuestionBundle, 
    newQuestions: number[], 
    newSampleQuestions: number[]
  ): QuestionBundle {
    const nextVersion = this.getNextVersion(baseBundle.version);
    const today = new Date().toISOString().split('T')[0];
    
    return {
      ...baseBundle,
      id: `${this.getBaseId(baseBundle.id)}_${nextVersion}`,
      version: nextVersion,
      releaseDate: today,
      questions: newQuestions,
      sampleQuestions: newSampleQuestions,
      questionCount: newQuestions.length,
      isCurrentVersion: true,
      versionHistory: [
        ...(baseBundle.versionHistory || []),
        {
          version: baseBundle.version,
          releaseDate: baseBundle.releaseDate,
          questionCount: baseBundle.questionCount,
          sampleQuestions: baseBundle.sampleQuestions || [],
          isAvailable: true,
          price: baseBundle.price
        }
      ]
    };
  }

  /**
   * Mark old version as legacy
   */
  static markAsLegacy(bundle: QuestionBundle): QuestionBundle {
    return {
      ...bundle,
      isCurrentVersion: false
    };
  }

  /**
   * Get version display info for UI
   */
  static getVersionDisplayInfo(bundles: QuestionBundle[]): {
    currentVersionCount: number;
    legacyVersionCount: number;
    latestReleaseDate: string;
    nextScheduledRelease?: string;
  } {
    const currentBundles = this.getCurrentVersionBundles(bundles);
    const legacyBundles = this.getLegacyVersionBundles(bundles);
    
    const latestReleaseDate = currentBundles
      .map(b => b.releaseDate)
      .sort()
      .reverse()[0] || new Date().toISOString().split('T')[0];

    return {
      currentVersionCount: currentBundles.length,
      legacyVersionCount: legacyBundles.length,
      latestReleaseDate,
      nextScheduledRelease: this.getNextQuarterlyRelease()
    };
  }

  /**
   * Calculate next quarterly release date
   */
  private static getNextQuarterlyRelease(): string {
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const currentYear = now.getFullYear();
    
    // Quarterly release months: March (2), June (5), September (8), December (11)
    const quarterlyMonths = [2, 5, 8, 11];
    let nextQuarterMonth = quarterlyMonths[currentQuarter + 1];
    let nextYear = currentYear;
    
    if (!nextQuarterMonth) {
      nextQuarterMonth = quarterlyMonths[0];
      nextYear = currentYear + 1;
    }
    
    const nextRelease = new Date(nextYear, nextQuarterMonth, 1);
    return nextRelease.toISOString().split('T')[0];
  }
}

export default VersionManagementService;
