import Feed from "./feed";

const createFeedService = async(
  {
    userId,
    videoId,
  } : {
    userId: string,
    videoId: string,
  }
) => {
  
  try {
    const feed = await Feed.create({
      user: userId,
      video: videoId,
    });
    return {
      status : 201,
      message : "Feed created successfully",
      data : feed,
      success: true
    }
  } catch (error) {
    console.log(error);
    return {
      status : 500,
      message : "Internal server error",
      data : error,
      success: false
    }
  }
}

const getFeedsService = async() => {
  try {
    const feeds = await Feed.find({})
      .populate('user', 'username profilePicture')
      .populate({
        path: 'video',
        select: 'videoUrl type title style language voiceCharacter',
      })
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });
    return {
      status: 200,
      message: "Feeds retrieved successfully",
      data: feeds,
      success: true
    }
  } catch (error) {
    console.log(error);
    return {
      status : 500,
      message : "Internal server error",
      data : error,
      success: false
    }
  }
}

const deletedFeedService = async(
  {
    feedId
  } : {
    feedId: string
  }
) => {
  try {
    const deletedFeed = await Feed.findByIdAndDelete(feedId);
    if (!deletedFeed) {
      return {
        status: 404,
        message: "Feed not found",
        data: null,
        success: false
      }
    }
    return {
      status: 200,
      message: "Feed deleted successfully",
      data: deletedFeed,
      success: true
    }
  } catch (error) {
    return {
      status : 500,
      message : "Internal server error",
      data : error,
      success: false
    }
  }
}

const LikeCountUpdateService = async(
  {
    feedId,
    userId,
  } :{ 
    feedId: string,
    userId: string,
  }
)  => {
  try {
    const feed = await Feed.findById(feedId);

    if(!feed){
      return {
        status: 404,
        message: "Feed not found",
        data: null,
        success: false
      }
    }

    const isLiked = feed.likes.includes(userId as any);

    if(isLiked){
      feed.likes = feed.likes.filter((likeId:string) => likeId.toString() !== userId);
    } else {
      feed.likes = [...feed.likes,{
        user: userId
      }];
    }

    await feed.save();

    return {
      status: 200,
      message: isLiked ? "Like removed successfully" : "Like added successfully",
      data: {
        likeCount : feed.likes.length,
        isLiked: !isLiked
      },
      success: true
    }

  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      data: error,
      success: false
    }
  }
}

const feedCommentService = async(
  {
    feedId,
    userId,
    content,
  } : {
    feedId: string,
    userId: string,
    content: string,
  }
) => {
  try {
    const feed = await Feed.findById(feedId);

    if(!feed){
      return {
        status: 404,
        message: "Feed not found",
        data: null,
        success: false
      }
    }

    feed.comments.push({
      user: userId,
      content: content
    } as any);

    const newFeed = await feed.save();
    const populatedFeed = await newFeed.populate('comments.user', 'username profilePicture');

    return {
      status: 200,
      message: "Comment added successfully",
      data:{
        _id: feed.comments[feed.comments.length - 1]._id,
        content: content,
        createdAt: feed.comments[feed.comments.length - 1].createdAt,
        updatedAt: feed.comments[feed.comments.length - 1].updatedAt,
        user: populatedFeed.comments[populatedFeed.comments.length - 1].user
      },
      success: true
    }
  }
  catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      data: error,
      success: false
    }
  }
}

const feedCommentDeleteService = async(
  {
    commentId,
  } : {
    commentId: string,
  }
) => {
  try {
    const feed = await Feed.findOne({ 'comments._id': commentId });

    if(!feed){
      return {
        status: 404,
        message: "Comment not found",
        data: null,
        success: false
      }
    }

    feed.comments = feed.comments.filter((comment:any) => comment._id.toString() !== commentId);

    await feed.save();

    return {
      status: 200,
      message: "Comment deleted successfully",
      data: feed,
      success: true
    }
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      data: error,
      success: false
    }
  }
}

export {
  createFeedService,
  getFeedsService,
  deletedFeedService,
  LikeCountUpdateService,
  feedCommentService,
  feedCommentDeleteService
}