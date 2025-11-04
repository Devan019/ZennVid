import { User } from "../../../auth/model/User";
import { ISendResponse } from "../../../constants/interfaces";
import { Provider } from "../../../constants/provider";
import { getToday } from "../../../utils/getTodayDate";
import OpenApi from "../../openapi/model";
import { Transaction } from "../../pricing/model";
import VideoGenerater, { VideoType } from "../../video_generater/models/VideoSave";

export const userStatsService = async (): Promise<ISendResponse> => {
  try {
    const today = getToday();
    const stats = await User.aggregate([
      {
        $facet: {

          //calculate total users, credits
          substats: [
            {
              $group: {
                _id: null,
                users: {
                  $sum: 1
                },
                credits: {
                  $sum: "$credits"
                }
              }
            }
          ],

          //today
          todayCreatedUsers: [
            {
              $match: {
                createdAt: {
                  $gte: new Date()
                },
              },
            },
            {
              $group: {
                _id: today,
                count: {
                  $sum: 1
                }
              }
            }
          ],

          //daily users
          dailyUsers: [
            {
              $match: {
                createdAt: { $type: "date" }
              }
            },
            {
              $group: {

                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                  }
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: {
                _id: -1
              }
            },
            {
              $limit: 10
            }
          ],

          // //monthly users
          monthlyUsers: [
            {
              $match: {
                createdAt: { $type: "date" }
              }
            },
            {
              $group: {
                _id: {
                  month: { "$month": "$createdAt" },
                  year: { "$year": "$createdAt" },
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: {
                "_id.year": -1,
                "_id.month": -1
              }
            },
            {
              $limit: 12
            }
          ],


          //google users
          googleUsers: [
            {
              $match: {
                provider: Provider.GOOGLE
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ],

          //creditial users
          credentialUsers: [
            {
              $match: {
                provider: Provider.CREDENTIALS
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ]
        }
      },

    ])
    const userStats = stats[0] ?? {};

     const months = [1,2,3,4,5,6,7,8,9,10,11,12];
    const last12Days = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    userStats.dailyUsers = last12Days.map((day) => {
      const found = userStats.dailyUsers.find((item: any) => item._id === day);
      return {
        _id: day,
        count: found ? found.count : 0
      };
    });
    userStats.monthlyUsers = months.map((month) => {
      const found = userStats.monthlyUsers.find((item: any) => item._id.month === month);
      return {
        _id: {
          month,
          year: new Date().getFullYear()
        },
        count: found ? found.count : 0
      };
    })

    return {
      status: 200,
      data: userStats,
      message: "User stats fetched successfully",
      success: true
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: "Internal server error",
      success: false
    }
  }
}

export const developerStatsService = async (): Promise<ISendResponse> => {
  try {
    const today = getToday();
    const stats = await OpenApi.aggregate([
      {
        $facet: {

          //developers
          substats: [
            {
              $group: {
                _id: null,
                developers: { $sum: 1 },
                apps: { $sum: { $size: "$apps" } },
                apiCalls: { $sum: "$apiCalls" }
              }
            }
          ],

          //today developers
          todayDevelopers: [
            {
              $match: {
                createdAt: {
                  $gte: new Date()
                }
              }
            },
            {
              $group: {
                _id: today,
                count: {
                  $sum: 1
                }
              }
            }
          ],

          //dailyUsers
          dailyUsers: [
            {
              $match: {
                createdAt: {
                  $type: "date"
                }
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                  }
                },
                count: {
                  $sum: 1
                }
              }
            },
            {
              $sort: {
                _id: -1
              }
            },
            {
              $limit: 10
            }
          ],

          //montlyUsers
          monthlyUsers: [
            {
              $match: {
                createdAt: {
                  $type: "date"
                }
              }
            },
            {
              $group: {
                _id: {
                  month: {
                    $month: "$createdAt"
                  },
                  year: {
                    $year: "$createdAt"
                  }
                },
                count: {
                  $sum: 1
                }
              }
            },
            {
              $sort: {
                "_id.year": -1,
                "_id.month": -1
              }
            },
            {
              $limit: 12
            }
          ],

        }
      }
    ]);

    const developerStats = stats[0] ?? {};

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const last12Days = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();


    developerStats.dailyUsers = last12Days.map((day) => {
      const found = developerStats.dailyUsers.find((item: any) => item._id === day);
      return {
        _id: day,
        count: found ? found.count : 0
      };
    });

    developerStats.monthlyUsers = months.map((month) => {
      const found = developerStats.monthlyUsers.find((item: any) => item._id.month === month);
      return {
        _id: {
          month,
          year: new Date().getFullYear()
        },
        count: found ? found.count : 0
      };
    })

    return {
      status: 200,
      data: developerStats,
      message: "Developer stats fetched successfully",
      success: true
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: "Internal server error",
      success: false
    }
  }
}

export const revenueStatsService = async (): Promise<ISendResponse> => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const twelveDaysAgo = new Date(startOfToday);
    twelveDaysAgo.setDate(twelveDaysAgo.getDate() - 11);

    const currentYear = new Date().getFullYear();

    const stats = await Transaction.aggregate([
      {
        $facet: {
          // total transactions
          substats: [
            {
              $group: {
                _id: null,
                totalTranscations: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
                totalCreditSend: { $sum: "$credits_received" }
              }
            }
          ],

          // today revenue
          todayRevenue: [
            {
              $match: { createdAt: { $gte: startOfToday } }
            },
            {
              $group: {
                _id: null,
                amount: { $sum: "$amount" }
              }
            }
          ],
          dailyRevenue: [
            {
              $match: {
                createdAt: { $gte: twelveDaysAgo }
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                  }
                },
                amount: { $sum: "$amount" }
              }
            }
          ],
          monthlyRevenue: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(`${currentYear}-01-01`),
                  $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
                }
              }
            },
            {
              $group: {
                _id: {
                  month: { $month: "$createdAt" },
                  year: { $year: "$createdAt" }
                },
                amount: { $sum: "$amount" }
              }
            },
            {
              $sort: { "_id.month": -1 }
            }
          ]
        }
      },
    ])

    const statsData = stats[0] ?? {};

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const last12Days = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    statsData.dailyRevenue = last12Days.map((day) => {
      const found = statsData.dailyRevenue.find((item: any) => item._id === day);
      return {
        _id: day,
        amount: found ? found.amount : 0
      };
    });

    statsData.monthlyRevenue = months.map((month) => {
      const found = statsData.monthlyRevenue.find((item: any) => item._id.month === month);
      return {
        _id: {
          month,
          year: currentYear
        },
        amount: found ? found.amount : 0
      };
    })

    return {
      status: 200,
      data: statsData,
      message: "Revenue stats fetched successfully",
      success: true
    }
  } catch (error) {
    console.error(error)
    return {
      status: 500,
      data: null,
      message: "Internal server error",
      success: false
    }
  }
}

export const transcationHistroyService = async ({
  page = 1,
  limit = 10,
  search,
  createdAt,
}: {
  page?: number;
  limit?: number;
  search?: string;
  createdAt?: string;
}): Promise<ISendResponse> => {
  try {
    const isNumber = !isNaN(search as any);

    const matchConditions: any = {};


    if (search) {
      matchConditions.$or = [
        { payment_id: { $regex: search, $options: "i" } },
        ...(isNumber
          ? [
            { amount: Number(search) },
            { credits_received: Number(search) },
          ]
          : []),
      ];
    }

    if (createdAt) {
      const startOfDay = new Date(createdAt);
      const endOfDay = new Date(createdAt);
      endOfDay.setHours(23, 59, 59, 999);

      matchConditions.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const transactions = await Transaction.aggregate([
      { $match: matchConditions },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const total = await Transaction.countDocuments(matchConditions);

    return {
      status: 200,
      data: { transactions, total, page, limit },
      message: "Transaction history fetched successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      data: null,
      message: "Internal server error",
      success: false,
    };
  }
};

export const videoStatsService = async (): Promise<ISendResponse> => {
  try {
    const today = getToday();
    const stats = await VideoGenerater.aggregate([
      {
        $facet: {
          //total videos
          totalVideos: [
            {
              $group: {
                _id: null,
                totalVideos: {
                  $sum: 1
                }
              }
            }
          ],

          //today videos
          todayVideos: [
            {
              $match: {
                createdAt: {
                  $gte: new Date()
                }
              }
            },
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1
                }
              }
            }
          ],

          //top 7 lanuages used
          topLanguages: [
            {
              $group: {
                _id: "$language",
                count: {
                  $sum: 1
                }
              }
            },
            {
              $sort: {
                count: -1
              }
            },
            {
              $limit: 7
            }
          ],

          //all styles used
          allStyles: [
            {
              $group: {
                _id: "$style",
                count: {
                  $sum: 1
                }
              }
            }
          ],

          //sadtalker 
          sadtalkerVideos: [
            {
              $match: {
                type: VideoType.SADTALKER
              }
            },
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1
                }
              }
            }
          ],

          //magic videos
          magicVideos: [
            {
              $match: {
                type: VideoType.MAGIC_VIDEO
              }
            },
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1
                }
              }
            }
          ],


          //daily video generated
          dailyVideo: [
            {
              $match: {
                createdAt: {
                  $type: "date"
                }
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                  }
                },
                count: {
                  $sum: 1
                }
              }
            },
            {
              $sort: {
                _id: -1
              }
            },
            {
              $limit: 10
            }
          ],

          //montly 
          monthlyVideo: [
            {
              $match: {
                createdAt: {
                  $type: "date"
                }
              }
            },
            {
              $group: {
                _id: {
                  month: {
                    $month: "$createdAt"
                  },
                  year: {
                    $year: "$createdAt"
                  }
                },
                count: {
                  $sum: 1
                }
              }
            },
            {
              $sort: {
                "_id.year": -1,
                "_id.month": -1
              }
            },
            {
              $limit: 12
            }
          ],

        }
      }
    ])
    const statsData = stats[0] ?? {};
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const last12Days = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    statsData.dailyVideo = last12Days.map((day) => {
      const found = statsData.dailyVideo.find((item: any) => item._id === day);
      return {
        _id: day,
        count: found ? found.count : 0
      };
    });
    statsData.monthlyVideo = months.map((month) => {
      const found = statsData.monthlyVideo.find((item: any) => item._id.month === month);
      return {
        _id: {
          month,
          year: new Date().getFullYear()
        },
        count: found ? found.count : 0
      };
    });

    return {
      status: 200,
      data: stats[0],
      message: "Video stats fetched successfully",
      success: true
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: "Internal server error",
      success: false
    }
  }
}

export const changeDailyRevenueService = async (date: Date, state: "Prev" | "Next") => {
  try {
    const stDate = new Date(date);
    const endDate = new Date(date);
    if (state === "Prev") {
      stDate.setDate(stDate.getDate() - 12);
    }
    if (state === "Next") {
      endDate.setDate(endDate.getDate() + 12);
    }

    const dailyRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          amount: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $addFields: {
          amount: { $ifNull: ["$amount", 0] }
        }
      }
    ]);

    let stats = dailyRevenue[0] ?? {};

    if (state === "Prev") {
      const last12Days = Array.from({ length: 12 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - (i + 1));
        return newDate.toISOString().split('T')[0];
      }).reverse();
      stats = last12Days.map((day) => {
        const found = dailyRevenue.find((item: any) => item._id === day);
        return {
          _id: day,
          amount: found ? found.amount : 0
        };
      });
    } else {
      const next12Days = Array.from({ length: 12 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + (i + 1));
        return newDate.toISOString().split('T')[0];
      });
      stats = next12Days.map((day) => {
        const found = dailyRevenue.find((item: any) => item._id === day);
        return {
          _id: day,
          amount: found ? found.amount : 0
        };
      });
    }
    return {
      status: 200,
      data: stats,
      message: "Daily revenue fetched successfully",
      success: true
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
      message: "Internal server error",
      success: false
    }
  }
}

export const changeDailyUserService = async (date: Date, state: "Prev" | "Next") => {
  try {
    const stDate = new Date(date);
    const endDate = new Date(date);
    if (state === "Prev") {
      stDate.setDate(stDate.getDate() - 12);
    }
    if (state === "Next") {
      endDate.setDate(endDate.getDate() + 12);
    }

    const dailyRevenue = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $addFields: {
          count: { $ifNull: ["$count", 0] }
        }
      }
    ]);

    let stats = dailyRevenue[0] ?? {};

    if (state === "Prev") {
      const last12Days = Array.from({ length: 12 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - (i + 1));
        return newDate.toISOString().split('T')[0];
      }).reverse();
      stats = last12Days.map((day) => {
        const found = dailyRevenue.find((item: any) => item._id === day);
        return {
          _id: day,
          count: found ? found.count : 0
        };
      });
    } else {
      const next12Days = Array.from({ length: 12 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + (i + 1));
        return newDate.toISOString().split('T')[0];
      });
      stats = next12Days.map((day) => {
        const found = dailyRevenue.find((item: any) => item._id === day);
        return {
          _id: day,
          count: found ? found.count : 0
        };
      });
    }
    return {
      status: 200,
      data: stats,
      message: "Daily user fetched successfully",
      success: true
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
      message: "Internal server error",
      success: false
    }
  }
}

export const changeDailyDeveloperService = async (date: Date, state: "Prev" | "Next") => {
  try {
    const stDate = new Date(date);
    const endDate = new Date(date);
    if (state === "Prev") {
      stDate.setDate(stDate.getDate() - 12);
    }
    if (state === "Next") {
      endDate.setDate(endDate.getDate() + 12);
    }

    const dailyRevenue = await OpenApi.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $addFields: {
          count: { $ifNull: ["$count", 0] }
        }
      }
    ]);

    let stats = dailyRevenue[0] ?? {};

    if (state === "Prev") {
      const last12Days = Array.from({ length: 12 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - (i + 1));
        return newDate.toISOString().split('T')[0];
      }).reverse();
      stats = last12Days.map((day) => {
        const found = dailyRevenue.find((item: any) => item._id === day);
        return {
          _id: day,
          count: found ? found.count : 0
        };
      });
    } else {
      const next12Days = Array.from({ length: 12 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + (i + 1));
        return newDate.toISOString().split('T')[0];
      });
      stats = next12Days.map((day) => {
        const found = dailyRevenue.find((item: any) => item._id === day);
        return {
          _id: day,
          count: found ? found.count : 0
        };
      });
    }
    return {
      status: 200,
      data: stats,
      message: "Daily developer fetched successfully",
      success: true
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
      message: "Internal server error",
      success: false
    }
  }
}

export const changeDailyVideoService = async (date: Date, state: "Prev" | "Next") => {
  try {
    const stDate = new Date(date);
    const endDate = new Date(date);
    if (state === "Prev") {
      stDate.setDate(stDate.getDate() - 12);
    }
    if (state === "Next") {
      endDate.setDate(endDate.getDate() + 12);
    }

    const dailyRevenue = await VideoGenerater.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $addFields: {
          count: { $ifNull: ["$count", 0] }
        }
      }
    ]);

    let stats = dailyRevenue[0] ?? {};

    if (state === "Prev") {
      const last12Days = Array.from({ length: 12 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - (i + 1));
        return newDate.toISOString().split('T')[0];
      }).reverse();
      stats = last12Days.map((day) => {
        const found = dailyRevenue.find((item: any) => item._id === day);
        return {
          _id: day,
          count: found ? found.count : 0
        };
      });
    } else {
      const next12Days = Array.from({ length: 12 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + (i + 1));
        return newDate.toISOString().split('T')[0];
      });
      stats = next12Days.map((day) => {
        const found = dailyRevenue.find((item: any) => item._id === day);
        return {
          _id: day,
          count: found ? found.count : 0
        };
      });
    }
    return {
      status: 200,
      data: stats,
      message: "Daily video fetched successfully",
      success: true
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
      message: "Internal server error",
      success: false
    }
  }
}