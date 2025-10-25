

      <div className="comment-section">
        {comments.slice(0, 2).map((comment) => (
          <div key={comment._id || comment.createdAt || Math.random()} className="comment">
            <strong>{comment.user?.name || 'User'}</strong> {comment.text}
          </div>
        ))}
        {comments.length > 2 && <p>View all {comments.length} comments...</p>}

        {user && (
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" disabled={!newComment.trim()}>Post</button>
          </form>
        )}
      </div>

      {isShareModalOpen && (
        <ShareModal
          post={currentPost}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Post;
