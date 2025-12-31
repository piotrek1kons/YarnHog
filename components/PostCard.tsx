import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, Modal, Animated } from 'react-native';
import ProfileAvatar from '../assets/img/profile.png';

interface PostCardProps {
  post: any;
  userId: string | null;
  postAuthors: Record<string, string>;
  userAvatars: Record<string, string>;
  onLike: (postId: string, likes: string[]) => void;
  onRating: (postId: string, rating: number) => void;
  onOpenComments: (post: any) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  userId,
  postAuthors,
  userAvatars,
  onLike,
  onRating,
  onOpenComments,
}) => {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isLiked = post.likes?.includes(userId);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;
  const authorName = postAuthors[post.user_id] || 'Anonymous';
  const authorAvatar = userAvatars[post.user_id] || '';
  const authorAvatarSource = authorAvatar ? { uri: authorAvatar } : ProfileAvatar;
  const userRating = userId && post.ratings ? post.ratings[userId] || 0 : 0;
  const averageRating = getAverageRating(post.ratings);
  const ratingCount = Object.keys(post.ratings || {}).length;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowOverlay(false));
    }, 1500);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  function getAverageRating(ratings: Record<string, number> = {}): string {
    const values = Object.values(ratings);
    if (values.length === 0) return '0';
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  }

  function renderStars(rating: number, size: number = 16) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ fontSize: size }}>
          {i <= rating ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  }

  return (
    <>
      <View style={styles.postCard}>
        {post.image && (
          <TouchableOpacity activeOpacity={0.9} onPress={() => setIsImageModalVisible(true)}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: post.image }} style={styles.postImage} />
              {showOverlay && (
                <Animated.View style={[styles.imageOverlay, { opacity: fadeAnim }]}>
                  <Text style={styles.zoomText}>🔍 Click to zoom</Text>
                </Animated.View>
              )}
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.postContent}>
        <Text style={styles.postTitle}>{post.title}</Text>

        {/* Author with Avatar */}
        <View style={styles.authorContainer}>
          <Image source={authorAvatarSource} style={styles.avatarSmall} />
          <Text style={styles.postAuthor}>by {authorName}</Text>
        </View>

        {post.project_title ? (
          <View style={styles.projectChipInline}>
            <Text style={styles.projectChipText}>
              Based on: {post.project_title}
            </Text>
          </View>
        ) : null}
        <Text style={styles.postText}>{post.content}</Text>

        {/* Rating Section - Combined */}
        <View style={styles.ratingContainer}>
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Average Rating</Text>
            <View style={styles.ratingDisplay}>
              <View style={styles.starsRow}>
                {renderStars(Math.round(parseFloat(averageRating as string)))}
              </View>
              <Text style={styles.ratingValue}>
                {averageRating}
              </Text>
              <Text style={styles.ratingCount}>({ratingCount} votes)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Your Rating</Text>
            <View style={styles.userRatingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => onRating(post.id, star)}
                >
                  <Text
                    style={[
                      styles.ratingStar,
                      userRating === star && styles.ratingStarSelected,
                    ]}
                  >
                    {userRating >= star ? '⭐' : '☆'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Likes and Comments Section */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onLike(post.id, post.likes || [])}
          >
            <Text style={[styles.actionIcon, isLiked && styles.liked]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.actionCount}>{likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onOpenComments(post)}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>{commentsCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>

      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsImageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Pressable onPress={() => setIsImageModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
            {post.image ? (
              <Image
                source={{ uri: post.image }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#FFF8DB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E7B469',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B5E4B',
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  postAuthor: {
    fontSize: 12,
    color: '#B0A898',
    fontStyle: 'italic',
  },
  projectChipInline: {
    alignSelf: 'flex-start',
    backgroundColor: '#F9E7C6',
    borderWidth: 1,
    borderColor: '#E7B469',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  projectChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B5E4B',
  },
  postText: {
    fontSize: 14,
    color: '#1C1C1C',
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9E7C6',
    borderRadius: 12,
    gap: 16,
  },
  ratingSection: {
    flex: 1,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A7E70',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingDisplay: {
    alignItems: 'center',
    gap: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B5E4B',
  },
  ratingCount: {
    fontSize: 10,
    color: '#B0A898',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#E7B469',
    opacity: 0.5,
  },
  userRatingRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  ratingStar: {
    fontSize: 18,
  },
  ratingStarSelected: {
    fontSize: 22,
    transform: [{ scale: 1.15 }],
  },
  ratingLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#B0A898',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7B469',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 20,
  },
  liked: {
    transform: [{ scale: 1.1 }],
  },
  actionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B5E4B',
  },
  imageContainer: {
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: 'rgba(231, 180, 105, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    height: '90%',
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#E7B469',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1C',
  },
});
