"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send } from "lucide-react"
import { IFeed } from "./video-card"


interface CommentPanelProps {
  feed: IFeed
  onClose: () => void
}

export function CommentPanel({ feed, onClose }: CommentPanelProps) {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(feed.comments)

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        _id: `${comments.length + 1}`,
        user: {
          email: "current@user.com",
          username: "You",
        },
        content: newComment,
      }
      setComments([newCommentObj, ...comments])
      setNewComment("")
    }
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 right-0 w-full md:w-96 bg-background border-l border-border z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Comments</h3>
          <p className="text-xs text-muted-foreground">{comments.length} comments</p>
        </div>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 hover:bg-accent/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {comments.map((comment, idx) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: idx * 0.05 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">{comment.user.username}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">just now</span>
                </div>
                <p className="text-sm text-foreground/80 mt-1 break-words">{comment.content}</p>
                <button className="text-xs text-muted-foreground mt-1 hover:text-accent transition-colors">
                  ♥️ Like
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground"
          />
          <motion.button
            onClick={handleAddComment}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!newComment.trim()}
            className="p-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
