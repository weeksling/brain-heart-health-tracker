/**
 * HealthDataService
 *
 * Service for retrieving heart rate and activity data from Android health platforms.
 * Supports both Health Connect (Android 14+) and Google Fit (fallback for older devices).
 *
 * Required Android Permissions (to be added to AndroidManifest.xml):
 * - android.permission.ACTIVITY_RECOGNITION
 * - android.permission.BODY_SENSORS
 * - android.permission.BODY_SENSORS_BACKGROUND (for continuous monitoring)
 *
 * Health Connect Permissions (requested at runtime):
 * - android.health.permission.HeartRate.READ
 * - android.health.permission.ActivityRecognition.READ
 * - android.health.permission.Steps.READ
 *
 * Google Fit Permissions (OAuth 2.0):
 * - https://www.googleapis.com/auth/fitness.heart_rate.read
 * - https://www.googleapis.com/auth/fitness.activity.read
 * - https://www.googleapis.com/auth/fitness.location.read
 */

import { Platform } from "react-native";

// Data models for heart rate zones and activity
export interface HeartRateDataPoint {
  timestamp: number; // Unix timestamp in milliseconds
  value: number; // Heart rate in BPM
  source: "health_connect" | "google_fit" | "garmin_connect";
}

export interface HeartRateZone {
  id: string;
  name: string;
  description: string;
  minBpm: number;
  maxBpm: number;
  color: string;
}

export interface ZoneActivity {
  zone: HeartRateZone;
  totalMinutes: number;
  sessions: HeartRateSession[];
}

export interface HeartRateSession {
  startTime: number;
  endTime: number;
  averageBpm: number;
  maxBpm: number;
  minBpm: number;
  zoneMinutes: { [zoneId: string]: number };
}

export interface WeeklyHeartRateSummary {
  totalMinutes: number;
  zoneBreakdown: { [zoneId: string]: number };
  sessions: HeartRateSession[];
  averageHeartRate: number;
  maxHeartRate: number;
  minHeartRate: number;
}

export interface DailyHeartRateSummary {
  date: string; // YYYY-MM-DD format
  totalMinutes: number;
  zoneBreakdown: { [zoneId: string]: number };
  sessions: HeartRateSession[];
  averageHeartRate: number;
  maxHeartRate: number;
  minHeartRate: number;
}

export interface HealthDataPermissions {
  healthConnect: boolean;
  googleFit: boolean;
  bodySensors: boolean;
  activityRecognition: boolean;
}

export class HealthDataService {
  private static instance: HealthDataService;
  private isInitialized = false;
  private currentPlatform: "health_connect" | "google_fit" | "garmin_connect" =
    "health_connect";

  // Default heart rate zones (can be customized per user)
  private defaultZones: HeartRateZone[] = [
    {
      id: "zone1",
      name: "Zone 1",
      description: "Recovery",
      minBpm: 0,
      maxBpm: 120,
      color: "#81C784",
    },
    {
      id: "zone2",
      name: "Zone 2",
      description: "Aerobic Base",
      minBpm: 121,
      maxBpm: 140,
      color: "#64B5F6",
    },
    {
      id: "zone3",
      name: "Zone 3",
      description: "Tempo",
      minBpm: 141,
      maxBpm: 160,
      color: "#FFB74D",
    },
    {
      id: "zone4",
      name: "Zone 4",
      description: "Threshold",
      minBpm: 161,
      maxBpm: 180,
      color: "#F44336",
    },
    {
      id: "zone5",
      name: "Zone 5",
      description: "VO2 Max",
      minBpm: 181,
      maxBpm: 999,
      color: "#9C27B0",
    },
  ];

  private constructor() {}

  public static getInstance(): HealthDataService {
    if (!HealthDataService.instance) {
      HealthDataService.instance = new HealthDataService();
    }
    return HealthDataService.instance;
  }

  /**
   * Initialize the health data service
   * Checks platform capabilities and requests necessary permissions
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      // Check if running on Android
      if (Platform.OS !== "android") {
        console.warn("HealthDataService: Only Android is currently supported");
        return false;
      }

      // Determine best available platform
      this.currentPlatform = await this.detectBestPlatform();

      // Request permissions based on platform
      const permissionsGranted = await this.requestPermissions();

      if (permissionsGranted) {
        this.isInitialized = true;
        console.log(
          `HealthDataService: Initialized with ${this.currentPlatform}`
        );
        return true;
      } else {
        console.warn("HealthDataService: Required permissions not granted");
        return false;
      }
    } catch (error) {
      console.error("HealthDataService: Initialization failed", error);
      return false;
    }
  }

  /**
   * Detect the best available health platform
   * Priority: Health Connect > Google Fit > Garmin Connect
   */
  private async detectBestPlatform(): Promise<
    "health_connect" | "google_fit" | "garmin_connect"
  > {
    // TODO: Implement platform detection logic
    // - Check if Health Connect is available (Android 14+)
    // - Check if Google Fit is installed
    // - Check if Garmin Connect is available

    // For now, default to Health Connect
    return "health_connect";
  }

  /**
   * Request necessary permissions for the detected platform
   */
  private async requestPermissions(): Promise<boolean> {
    // TODO: Implement permission requests
    // - Health Connect: Use HealthConnectClient.requestPermissions()
    // - Google Fit: Use Google Sign-In and OAuth 2.0
    // - Garmin Connect: Use Garmin Connect API authentication

    // For now, return true to allow development with dummy data
    return true;
  }

  /**
   * Get current permission status
   */
  async getPermissionStatus(): Promise<HealthDataPermissions> {
    // TODO: Implement permission status checking
    return {
      healthConnect: true,
      googleFit: false,
      bodySensors: true,
      activityRecognition: true,
    };
  }

  /**
   * Get heart rate data for a specific time range
   */
  async getHeartRateData(
    startTime: number,
    endTime: number
  ): Promise<HeartRateDataPoint[]> {
    // TODO: Implement real data fetching
    // - Health Connect: Use HealthConnectClient.readRecords()
    // - Google Fit: Use Fitness API
    // - Garmin Connect: Use Garmin Connect API

    // Return dummy data for development
    const dummyData: HeartRateDataPoint[] = [];
    const interval = 5 * 60 * 1000; // 5 minutes

    for (let time = startTime; time <= endTime; time += interval) {
      dummyData.push({
        timestamp: time,
        value: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
        source: this.currentPlatform,
      });
    }

    return dummyData;
  }

  /**
   * Get weekly heart rate summary (current week)
   */
  async getWeeklyHeartRateData(): Promise<WeeklyHeartRateSummary> {
    const now = Date.now();
    const weekStart = this.getWeekStart(now);
    const weekEnd = now;

    const heartRateData = await this.getHeartRateData(weekStart, weekEnd);
    return this.calculateSummary(heartRateData, weekStart, weekEnd);
  }

  /**
   * Get daily heart rate summary for a specific date
   */
  async getDailyHeartRateData(date: string): Promise<DailyHeartRateSummary> {
    const dateObj = new Date(date);
    const dayStart = dateObj.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1;

    const heartRateData = await this.getHeartRateData(dayStart, dayEnd);
    const summary = this.calculateSummary(heartRateData, dayStart, dayEnd);

    return {
      ...summary,
      date,
    };
  }

  /**
   * Get heart rate zones (can be customized per user)
   */
  getHeartRateZones(): HeartRateZone[] {
    // TODO: Load user-specific zones from storage
    return this.defaultZones;
  }

  /**
   * Calculate heart rate zones for a given max heart rate
   * Uses Karvonen formula: Target HR = ((Max HR - Resting HR) × Intensity) + Resting HR
   */
  calculateHeartRateZones(
    maxHeartRate: number,
    restingHeartRate: number = 60
  ): HeartRateZone[] {
    const zones = [
      {
        name: "Zone 1",
        description: "Recovery",
        intensity: 0.5,
        color: "#81C784",
      },
      {
        name: "Zone 2",
        description: "Aerobic Base",
        intensity: 0.6,
        color: "#64B5F6",
      },
      {
        name: "Zone 3",
        description: "Tempo",
        intensity: 0.7,
        color: "#FFB74D",
      },
      {
        name: "Zone 4",
        description: "Threshold",
        intensity: 0.8,
        color: "#F44336",
      },
      {
        name: "Zone 5",
        description: "VO2 Max",
        intensity: 0.9,
        color: "#9C27B0",
      },
    ];

    return zones.map((zone, index) => {
      const minBpm = Math.round(
        (maxHeartRate - restingHeartRate) * zone.intensity + restingHeartRate
      );
      const maxBpm =
        index < zones.length - 1
          ? Math.round(
              (maxHeartRate - restingHeartRate) * zones[index + 1].intensity +
                restingHeartRate
            ) - 1
          : maxHeartRate;

      return {
        id: `zone${index + 1}`,
        name: zone.name,
        description: zone.description,
        minBpm,
        maxBpm,
        color: zone.color,
      };
    });
  }

  /**
   * Calculate summary statistics from heart rate data
   */
  private calculateSummary(
    heartRateData: HeartRateDataPoint[],
    startTime: number,
    endTime: number
  ): WeeklyHeartRateSummary {
    if (heartRateData.length === 0) {
      return {
        totalMinutes: 0,
        zoneBreakdown: {},
        sessions: [],
        averageHeartRate: 0,
        maxHeartRate: 0,
        minHeartRate: 0,
      };
    }

    const zones = this.getHeartRateZones();
    const zoneBreakdown: { [zoneId: string]: number } = {};
    zones.forEach((zone) => (zoneBreakdown[zone.id] = 0));

    let totalMinutes = 0;
    let totalHeartRate = 0;
    let maxHeartRate = 0;
    let minHeartRate = 999;

    // Group data into sessions (gaps > 5 minutes create new session)
    const sessions: HeartRateSession[] = [];
    let currentSession: HeartRateDataPoint[] = [];
    const sessionGap = 5 * 60 * 1000; // 5 minutes

    for (let i = 0; i < heartRateData.length; i++) {
      const point = heartRateData[i];

      if (currentSession.length > 0) {
        const lastPoint = currentSession[currentSession.length - 1];
        if (point.timestamp - lastPoint.timestamp > sessionGap) {
          // End current session and start new one
          sessions.push(this.createSession(currentSession, zones));
          currentSession = [];
        }
      }

      currentSession.push(point);

      // Update statistics
      totalHeartRate += point.value;
      maxHeartRate = Math.max(maxHeartRate, point.value);
      minHeartRate = Math.min(minHeartRate, point.value);
    }

    // Add final session
    if (currentSession.length > 0) {
      sessions.push(this.createSession(currentSession, zones));
    }

    // Calculate total minutes and zone breakdown
    sessions.forEach((session) => {
      const sessionMinutes =
        (session.endTime - session.startTime) / (60 * 1000);
      totalMinutes += sessionMinutes;

      Object.entries(session.zoneMinutes).forEach(([zoneId, minutes]) => {
        zoneBreakdown[zoneId] += minutes;
      });
    });

    return {
      totalMinutes: Math.round(totalMinutes),
      zoneBreakdown,
      sessions,
      averageHeartRate: Math.round(totalHeartRate / heartRateData.length),
      maxHeartRate,
      minHeartRate,
    };
  }

  /**
   * Create a heart rate session from data points
   */
  private createSession(
    dataPoints: HeartRateDataPoint[],
    zones: HeartRateZone[]
  ): HeartRateSession {
    const startTime = dataPoints[0].timestamp;
    const endTime = dataPoints[dataPoints.length - 1].timestamp;

    let totalHeartRate = 0;
    let maxHeartRate = 0;
    let minHeartRate = 999;
    const zoneMinutes: { [zoneId: string]: number } = {};
    zones.forEach((zone) => (zoneMinutes[zone.id] = 0));

    dataPoints.forEach((point) => {
      totalHeartRate += point.value;
      maxHeartRate = Math.max(maxHeartRate, point.value);
      minHeartRate = Math.min(minHeartRate, point.value);

      // Determine which zone this heart rate belongs to
      const zone = zones.find(
        (z) => point.value >= z.minBpm && point.value <= z.maxBpm
      );
      if (zone) {
        zoneMinutes[zone.id] += 1; // Assuming 1-minute intervals
      }
    });

    return {
      startTime,
      endTime,
      averageBpm: Math.round(totalHeartRate / dataPoints.length),
      maxBpm: maxHeartRate,
      minBpm: minHeartRate,
      zoneMinutes,
    };
  }

  /**
   * Get the start of the current week (Monday)
   */
  private getWeekStart(timestamp: number): number {
    const date = new Date(timestamp);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.getTime();
  }

  /**
   * Check if the service is ready to use
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get the current platform being used
   */
  getCurrentPlatform(): string {
    return this.currentPlatform;
  }
}

// Export singleton instance
export const healthDataService = HealthDataService.getInstance();
