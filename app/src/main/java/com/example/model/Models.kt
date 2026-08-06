package com.example.model

enum class SkillCategory(val displayName: String, val iconName: String) {
    ALL("All Categories", "apps"),
    PROGRAMMING("Programming & Tech", "code"),
    DESIGN("UI/UX & Graphic Design", "palette"),
    MUSIC("Music & Instruments", "music_note"),
    LANGUAGES("Languages & Linguistics", "translate"),
    MATHEMATICS("Math & Statistics", "calculate"),
    SCIENCE("Science & Engineering", "science"),
    MARKETING("Marketing & Business", "trending_up"),
    PHOTO_VIDEO("Photo & Video Editing", "photo_camera"),
    PERSONAL_GROWTH("Personal Growth & Soft Skills", "psychology")
}

enum class FormatType {
    ALL, ONLINE, OFFLINE
}

enum class SwapStatus {
    PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED
}

enum class NotificationType {
    SWAP_REQUEST, SWAP_ACCEPTED, SWAP_REJECTED, MESSAGE, COIN_REWARD
}

data class User(
    val id: String,
    val name: String,
    val email: String,
    val college: String,
    val city: String,
    val avatarUrl: String,
    val bio: String,
    val skillsOffered: List<String>,
    val skillsWanted: List<String>,
    val coinBalance: Int = 100,
    val languages: List<String> = listOf("English", "Hindi"),
    val availability: String = "Evenings & Weekends",
    val rating: Float = 5.0f,
    val reviewCount: Int = 0,
    val isProfileComplete: Boolean = true,
    val isOnline: Boolean = true,
    val lastActive: String = "Just now",
    val isReported: Boolean = false,
    val isBlocked: Boolean = false,
    val isAdmin: Boolean = false,
    val dailyCheckInClaimed: Boolean = false
)

data class SkillItem(
    val id: String,
    val userId: String,
    val userName: String,
    val userCollege: String,
    val userCity: String,
    val userAvatarUrl: String,
    val title: String,
    val description: String,
    val category: SkillCategory,
    val format: FormatType,
    val coinsCost: Int = 20,
    val rating: Float = 4.8f,
    val tags: List<String> = emptyList(),
    val createdAt: Long = System.currentTimeMillis()
)

data class SwapRequest(
    val id: String,
    val requesterId: String,
    val requesterName: String,
    val requesterAvatar: String,
    val recipientId: String,
    val recipientName: String,
    val recipientAvatar: String,
    val skillOffered: String,
    val skillRequested: String,
    val message: String = "",
    val status: SwapStatus = SwapStatus.PENDING,
    val createdAt: Long = System.currentTimeMillis(),
    val completedAt: Long? = null
)

data class ChatMessage(
    val id: String,
    val swapId: String,
    val senderId: String,
    val senderName: String,
    val receiverId: String,
    val text: String,
    val imageUrl: String? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val isRead: Boolean = false
)

data class NotificationItem(
    val id: String,
    val userId: String,
    val title: String,
    val message: String,
    val type: NotificationType,
    val timestamp: Long = System.currentTimeMillis(),
    val isRead: Boolean = false
)

data class ReviewItem(
    val id: String,
    val swapId: String,
    val reviewerId: String,
    val reviewerName: String,
    val reviewerAvatar: String,
    val revieweeId: String,
    val skillName: String,
    val rating: Int,
    val comment: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class CoinTransaction(
    val id: String,
    val userId: String,
    val amount: Int, // e.g. +100, +20, -20, +2, +10, +5
    val reason: String,
    val counterpartyName: String? = null,
    val timestamp: Long = System.currentTimeMillis()
)

data class ReportItem(
    val id: String,
    val reporterId: String,
    val reporterName: String,
    val reportedUserId: String,
    val reportedUserName: String,
    val reason: String,
    val status: String = "PENDING", // PENDING, RESOLVED
    val timestamp: Long = System.currentTimeMillis()
)

data class SmartMatchResult(
    val student: User,
    val matchScore: Int, // percentage 0-100
    val matchedOfferedSkill: String,
    val matchedWantedSkill: String,
    val matchReasons: List<String>
)

data class AppAchievement(
    val id: String,
    val title: String,
    val description: String,
    val iconName: String,
    val rewardCoins: Int,
    val isUnlocked: Boolean = false
)
