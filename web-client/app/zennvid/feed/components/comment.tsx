"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  X,
  Send,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { feedComment } from "@/lib/apiProvider";
import { useUser } from "@/context/UserProvider";
import { ResponseData } from "@/constants/response";
import { getTimeSince } from "@/lib/calculateTime";
import { IFeed } from "./video-card";

interface CommentPanelProps {
  feed: IFeed;
  onClose: () => void;
}

export function CommentPanel({
  feed,
  onClose,
}: CommentPanelProps) {
  const [newComment, setNewComment] =
    useState("");

  const [comments, setComments] =
    useState(feed.comments);

  const { user } = useUser();

  const commentMutation =
    useMutation({
      mutationKey: [
        "addComment",
      ],

      mutationFn:
        async () => {
          return await feedComment(
            {
              feedId:
                feed._id,

              userId:
                user?._id ?? "",

              content:
                newComment,
            }
          );
        },

      onSuccess: (
        data: ResponseData
      ) => {
        if (data.SUCCESS) {
          const addedComment =
            data.DATA;

          setComments(
            (
              prevComments
            ) => [
              ...prevComments,
              addedComment,
            ]
          );

          setNewComment("");

          toast.success(
            data.MESSAGE ||
              "Comment added successfully"
          );
        } else {
          toast.error(
            data.MESSAGE ||
              "Failed to add comment"
          );
        }
      },

      onError: () => {
        toast.error(
          "An error occurred while adding the comment"
        );
      },
    });

  const handleAddComment = () => {
    if (!newComment.trim())
      return;

    commentMutation.mutate();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.2,
        }}
        onClick={onClose}
        className="
          fixed
          inset-0
          z-[999999]
          bg-black/60
          backdrop-blur-sm
        "
      >
        {/* PANEL */}
        <motion.div
          initial={{
            x: 500,
          }}
          animate={{
            x: 0,
          }}
          exit={{
            x: 500,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 28,
          }}
          onClick={(e) =>
            e.stopPropagation()
          }
          className="
            absolute
            right-0
            top-0
            z-[1000000]
            flex
            h-full
            w-full
            flex-col
            overflow-hidden
            border-l
            border-black/10
            bg-[#F4F1EA]
            shadow-2xl

            md:max-w-[430px]
          "
        >
          {/* HEADER */}
          <div
            className="
              sticky
              top-0
              z-20
              flex
              items-center
              justify-between
              border-b
              border-black/10
              bg-[#F4F1EA]/95
              px-5
              py-5
              backdrop-blur-xl
            "
          >
            <div>
              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                  text-black
                "
              >
                Comments
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-black/50
                "
              >
                {
                  comments?.length
                }{" "}
                comments
              </p>
            </div>

            {/* CLOSE */}
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                border-black/10
                bg-white
                text-black
                shadow-sm
                transition-all
                hover:bg-black
                hover:text-white
              "
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          {/* COMMENTS */}
          <div
            className="
              flex-1
              overflow-y-auto
              px-5
              py-5
            "
          >
            <div className="space-y-4">
              {comments.map(
                (
                  comment,
                  idx
                ) => (
                  <motion.div
                    key={
                      comment._id
                    }
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        idx * 0.03,
                    }}
                    className="
                      rounded-3xl
                      border
                      border-black/10
                      bg-white
                      p-4
                      shadow-sm
                    "
                  >
                    <div className="flex gap-3">
                      {/* AVATAR */}
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-black
                          text-sm
                          font-semibold
                          uppercase
                          text-white
                        "
                      >
                        {comment?.user?.username
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <span
                            className="
                              truncate
                              text-sm
                              font-semibold
                              text-black
                            "
                          >
                            {
                              comment
                                ?.user
                                ?.username
                            }
                          </span>

                          <span
                            className="
                              text-xs
                              text-black/40
                            "
                          >
                            {getTimeSince(
                              new Date(
                                comment?.createdAt
                              )
                            )}
                          </span>
                        </div>

                        <p
                          className="
                            mt-2
                            break-words
                            text-sm
                            leading-6
                            text-black/70
                          "
                        >
                          {
                            comment?.content
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>

          {/* INPUT */}
          <div
            className="
              border-t
              border-black/10
              bg-[#F4F1EA]
              p-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <input
                type="text"
                placeholder="Write a comment..."
                value={
                  newComment
                }
                onChange={(e) =>
                  setNewComment(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    handleAddComment();
                  }
                }}
                className="
                  h-14
                  flex-1
                  rounded-2xl
                  border
                  border-black/10
                  bg-white
                  px-5
                  text-sm
                  text-black
                  outline-none
                  transition-all

                  placeholder:text-black/40

                  focus:border-black/20
                  focus:ring-2
                  focus:ring-black/5
                "
              />

              <motion.button
                type="button"
                onClick={
                  handleAddComment
                }
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                disabled={
                  !newComment.trim()
                }
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-black
                  text-white
                  transition-all

                  hover:opacity-90
                  disabled:opacity-40
                "
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}