
// User Statistics Interfaces
export interface UserSubstats {
  _id: null;
  users: number;
  credits: number;
}

export interface TodayCreatedUsers {
  _id: string;
  count: number;
}

export interface DailyUser {
  _id: string;
  count: number;
}

export interface MonthlyUser {
  _id: {
    month: number;
    year: number;
  };
  count: number;
}

export interface ProviderUsers {
  _id: null;
  count: number;
}

export interface UserStats {
  substats: UserSubstats[];
  todayCreatedUsers: TodayCreatedUsers[];
  dailyUsers: DailyUser[];
  monthlyUsers: MonthlyUser[];
  googleUsers: ProviderUsers[];
  credentialUsers: ProviderUsers[];
}

// Developer Statistics Interfaces
export interface DeveloperSubstats {
  _id: null;
  developers: number;
  apps: number;
  apiCalls: number;
}

export interface TodayDevelopers {
  _id: string;
  count: number;
}

export interface DailyDeveloper {
  _id: string;
  count: number;
}

export interface MonthlyDeveloper {
  _id: {
    month: number;
    year: number;
  };
  count: number;
}

export interface DeveloperStats {
  substats: DeveloperSubstats[];
  todayDevelopers: TodayDevelopers[];
  dailyUsers: DailyDeveloper[];
  monthlyUsers: MonthlyDeveloper[];
}

// Revenue Statistics Interfaces
export interface RevenueSubstats {
  _id: null;
  totalTranscations: number; 
  totalAmount: number; 
  totalCreditSend: number;
}

export interface TodayRevenue {
  _id: string;
  amount: number;
}

export interface DailyRevenue {
  _id: string; // date format: "YYYY-MM-DD"
  amount: number;
}

export interface MonthlyRevenue {
  _id: {
    month: number;
    year: number;
  };
  amount: number;
}

export interface RevenueStats {
  substats: RevenueSubstats[];
  todayRevenue: TodayRevenue[];
  dailyRevenue: DailyRevenue[];
  monthlyRevenue: MonthlyRevenue[];
}

// Transaction History Interfaces
export interface Transaction {
  _id: string;
  amount: number;
  credits_received: number;
  createdAt: Date | string;
  payment_id: string;
}

export interface TransactionHistory {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

// Video Statistics Interfaces
export interface TotalVideos {
  _id: null;
  totalVideos: number;
}

export interface TodayVideos {
  _id: null;
  count: number;
}

export interface TopLanguage {
  _id: string; // language name
  count: number;
}

export interface VideoStyle {
  _id: string; // style name
  count: number;
}

export interface VideoTypeCount {
  _id: null;
  count: number;
}

export interface DailyVideo {
  _id: string; // date format: "YYYY-MM-DD"
  count: number;
}

export interface MonthlyVideo {
  _id: {
    month: number;
    year: number;
  };
  count: number;
}

export interface VideoStats {
  totalVideos: TotalVideos[];
  todayVideos: TodayVideos[];
  topLanguages: TopLanguage[];
  allStyles: VideoStyle[];
  sadtalkerVideos: VideoTypeCount[];
  magicVideos: VideoTypeCount[];
  dailyVideo: DailyVideo[];
  monthlyVideo: MonthlyVideo[];
}

/** final transcationstat */
export interface TransactionStat {
  revenue :  RevenueStats;
  transactionHistory : TransactionHistory;
}
