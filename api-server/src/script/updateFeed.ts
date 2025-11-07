import { Request, Response } from "express";
import Feed from "../api/feed/feed";
import { User } from "../auth/model/User";
import expressAsyncHandler from "../utils/expressAsync";


const SAMPLE_COMMENTS = [
  "This is amazing! 🔥",
  "Love this content!",
  "Great work! Keep it up 👏",
  "Wow, this is so creative!",
  "Absolutely incredible!",
  "Can't stop watching this!",
  "This made my day! 😊",
  "So inspiring!",
  "Mind-blowing! 🤯",
  "Pure genius!",
  "This is gold! ⭐",
  "Fantastic video!",
  "I need more of this!",
  "Brilliant work!",
  "This is fire! 🔥🔥",
  "Outstanding!",
  "So good! 💯",
  "Chef's kiss! 👨‍🍳💋",
  "Speechless! 😮",
  "Top tier content!",
  "This deserves more views!",
  "Incredible stuff!",
  "Loving the vibes! ✨",
  "This hit different! 💪",
  "Obsessed with this!",
  "Can't believe how good this is!",
  "This is what I needed today!",
  "Absolutely stunning!",
  "You're so talented!",
  "Best thing I've seen all day!",
];


const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomComment = (): string => {
  return SAMPLE_COMMENTS[Math.floor(Math.random() * SAMPLE_COMMENTS.length)];
};


const populateAllFeedsService = async (
  minLikes: number = 1,
  maxLikes: number = 20,
  minComments: number = 0,
  maxComments: number = 10
) => {
  try {

    const users = await User.find({}, '_id');
    const allUserIds = users.map(user => user._id.toString());

    if (allUserIds.length === 0) {
      return {
        status: 404,
        message: "No users found in database",
        data: null,
        success: false
      };
    }

    const feeds = await Feed.find({});

    if (feeds.length === 0) {
      return {
        status: 404,
        message: "No feeds found in database",
        data: null,
        success: false
      };
    }

    const results = [];
    let totalLikesAdded = 0;
    let totalCommentsAdded = 0;

    for (const feed of feeds) {
      const likeCount = getRandomNumber(minLikes, maxLikes);
      const usersToLike = getRandomItems(allUserIds, Math.min(likeCount, allUserIds.length));

      const existingLikes = feed.likes.map((like: any) => like.user.toString());
      const newLikes = usersToLike
        .filter(userId => !existingLikes.includes(userId))
        .map(userId => ({ user: userId }));
      
      feed.likes.push(...newLikes);

      const commentCount = getRandomNumber(minComments, maxComments);
      const usersToComment = getRandomItems(allUserIds, commentCount);
      
      for (const userId of usersToComment) {
        feed.comments.push({
          user: userId,
          content: getRandomComment()
        } as any);
      }

      await feed.save();
      
      totalLikesAdded += newLikes.length;
      totalCommentsAdded += usersToComment.length;

      results.push({
        feedId: feed._id,
        likesAdded: newLikes.length,
        commentsAdded: usersToComment.length
      });
    }

    return {
      status: 200,
      message: "All feeds populated successfully",
      data: {
        totalFeedsProcessed: results.length,
        totalLikesAdded,
        totalCommentsAdded,
        details: results
      },
      success: true
    };

  } catch (error) {
    console.error('Error in populateAllFeedsService:', error);
    return {
      status: 500,
      message: "Internal server error",
      data: error,
      success: false
    };
  }
};

export const populateAllFeedsController = async (req: Request, res: Response) => {
  try {
    const minLikes = parseInt(req.query.minLikes as string) || 1;
    const maxLikes = parseInt(req.query.maxLikes as string) || 300;
    const minComments = parseInt(req.query.minComments as string) || 0;
    const maxComments = parseInt(req.query.maxComments as string) || 100;

    if (minLikes < 0 || maxLikes < minLikes) {
      return res.status(400).json({
        status: 400,
        message: "Invalid like range. Ensure minLikes >= 0 and maxLikes >= minLikes",
        success: false
      });
    }

    if (minComments < 0 || maxComments < minComments) {
      return res.status(400).json({
        status: 400,
        message: "Invalid comment range. Ensure minComments >= 0 and maxComments >= minComments",
        success: false
      });
    }

    const result = await populateAllFeedsService(
      minLikes,
      maxLikes,
      minComments,
      maxComments
    );

    return res.status(result.status).json(result);

  } catch (error) {
    console.error('Error in populateAllFeedsController:', error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error,
      success: false
    });
  }
};

