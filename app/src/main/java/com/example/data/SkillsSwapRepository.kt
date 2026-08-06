package com.example.data

import com.example.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID

object SkillsSwapRepository {

    // Default sample users representing students across various colleges
    private val sampleUsers = mutableListOf(
        User(
            id = "user_1",
            name = "Aarav Sharma",
            email = "aarav.s@iitd.ac.in",
            college = "IIT Delhi",
            city = "Delhi",
            avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            bio = "CS Senior passionate about Full Stack Web Dev, Machine Learning, and Competitive Programming. Always eager to exchange tech skills!",
            skillsOffered = listOf("Python & Data Science", "React & Next.js", "Data Structures & Algorithms"),
            skillsWanted = listOf("Spanish Speaking", "Guitar Fundamentals", "UI/UX Design in Figma"),
            coinBalance = 140,
            languages = listOf("English", "Hindi"),
            availability = "Mon, Wed, Sat (6 PM - 9 PM)",
            rating = 4.9f,
            reviewCount = 12,
            isProfileComplete = true,
            isOnline = true,
            lastActive = "Online"
        ),
        User(
            id = "user_2",
            name = "Priya Patel",
            email = "priya.p@mu.ac.in",
            college = "Mumbai University",
            city = "Mumbai",
            avatarUrl = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
            bio = "Design enthusiast & acoustic guitarist. I craft clean user interfaces and teach acoustic guitar basics to beginners.",
            skillsOffered = listOf("UI/UX Design in Figma", "Acoustic Guitar Basics", "Digital Illustration"),
            skillsWanted = listOf("Python & Data Science", "Public Speaking", "Financial Literacy"),
            coinBalance = 120,
            languages = listOf("English", "Hindi", "Gujarati"),
            availability = "Tue, Thu, Sun (4 PM - 8 PM)",
            rating = 4.8f,
            reviewCount = 8,
            isProfileComplete = true,
            isOnline = true,
            lastActive = "Online"
        ),
        User(
            id = "user_3",
            name = "Rahul Verma",
            email = "rahul.v@du.ac.in",
            college = "Delhi University (SRCC)",
            city = "Delhi",
            avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            bio = "Finance major with 3+ years experience in stock market basics, Excel financial modeling, and spoken Spanish.",
            skillsOffered = listOf("Financial Literacy & Stocks", "Advanced Excel & PowerBI", "Spanish Speaking"),
            skillsWanted = listOf("React & Next.js", "Video Editing in Premiere", "Data Structures & Algorithms"),
            coinBalance = 90,
            languages = listOf("English", "Hindi", "Spanish"),
            availability = "Weekends All Day",
            rating = 4.7f,
            reviewCount = 6,
            isProfileComplete = true,
            isOnline = false,
            lastActive = "15 mins ago"
        ),
        User(
            id = "user_4",
            name = "Ananya Sen",
            email = "ananya.sen@ju.ac.in",
            college = "Jadavpur University",
            city = "Kolkata",
            avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            bio = "Media & Communications student creating YouTube video tutorials. Fluent in German and video editing.",
            skillsOffered = listOf("Video Editing in Premiere", "German Language Level A2", "Creative Content Writing"),
            skillsWanted = listOf("UI/UX Design in Figma", "Acoustic Guitar Basics", "Public Speaking"),
            coinBalance = 160,
            languages = listOf("English", "Bengali", "German"),
            availability = "Mon - Fri (7 PM - 10 PM)",
            rating = 5.0f,
            reviewCount = 15,
            isProfileComplete = true,
            isOnline = true,
            lastActive = "Online"
        ),
        User(
            id = "user_5",
            name = "Vikram Reddy",
            email = "vikram.r@bits-pilani.ac.in",
            college = "BITS Pilani",
            city = "Bengaluru",
            avatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            bio = "Mechanical Engineering student love calculus, physics problem solving, and public speaking coaching.",
            skillsOffered = listOf("Calculus & Differential Equations", "Public Speaking", "Physics Problem Solving"),
            skillsWanted = listOf("Python & Data Science", "German Language Level A2", "Financial Literacy & Stocks"),
            coinBalance = 110,
            languages = listOf("English", "Telugu", "Hindi"),
            availability = "Everyday after 8 PM",
            rating = 4.6f,
            reviewCount = 5,
            isProfileComplete = true,
            isOnline = false,
            lastActive = "1 hour ago"
        ),
        User(
            id = "admin_user",
            name = "Platform Administrator",
            email = "admin@studentskillsswap.edu",
            college = "Student Skills Swap HQ",
            city = "Delhi",
            avatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            bio = "Official System Administrator monitoring platform safety, Skill Coin integrity, and swap analytics.",
            skillsOffered = listOf("Community Management", "Platform Safety"),
            skillsWanted = listOf("User Feedback"),
            coinBalance = 999,
            languages = listOf("English", "Hindi"),
            availability = "24/7",
            rating = 5.0f,
            reviewCount = 50,
            isProfileComplete = true,
            isOnline = true,
            lastActive = "Online",
            isAdmin = true
        )
    )

    private val sampleSkills = mutableListOf(
        SkillItem(
            id = "skill_1",
            userId = "user_1",
            userName = "Aarav Sharma",
            userCollege = "IIT Delhi",
            userCity = "Delhi",
            userAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            title = "Python for Machine Learning & Data Science",
            description = "Learn pandas, numpy, matplotlib, and scikit-learn hands-on with real dataset projects.",
            category = SkillCategory.PROGRAMMING,
            format = FormatType.ONLINE,
            coinsCost = 20,
            rating = 4.9f,
            tags = listOf("Python", "AI", "Data Science", "Machine Learning")
        ),
        SkillItem(
            id = "skill_2",
            userId = "user_2",
            userName = "Priya Patel",
            userCollege = "Mumbai University",
            userCity = "Mumbai",
            userAvatarUrl = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
            title = "UI/UX Design Basics with Figma",
            description = "Master wireframing, auto-layout, interactive prototyping, and mobile design systems.",
            category = SkillCategory.DESIGN,
            format = FormatType.ONLINE,
            coinsCost = 20,
            rating = 4.8f,
            tags = listOf("Figma", "UI Design", "UX", "Web Design")
        ),
        SkillItem(
            id = "skill_3",
            userId = "user_2",
            userName = "Priya Patel",
            userCollege = "Mumbai University",
            userCity = "Mumbai",
            userAvatarUrl = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
            title = "Acoustic Guitar for Beginners",
            description = "Chords, strumming patterns, and playing popular acoustic songs in just 4 sessions.",
            category = SkillCategory.MUSIC,
            format = FormatType.OFFLINE,
            coinsCost = 20,
            rating = 4.9f,
            tags = listOf("Guitar", "Music", "Acoustic", "Chords")
        ),
        SkillItem(
            id = "skill_4",
            userId = "user_3",
            userName = "Rahul Verma",
            userCollege = "Delhi University (SRCC)",
            userCity = "Delhi",
            userAvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            title = "Conversational Spanish Speaking",
            description = "Practice everyday dialogues, pronunciation, and essential vocabulary with native-paced guidance.",
            category = SkillCategory.LANGUAGES,
            format = FormatType.ONLINE,
            coinsCost = 20,
            rating = 4.7f,
            tags = listOf("Spanish", "Languages", "Conversation")
        ),
        SkillItem(
            id = "skill_5",
            userId = "user_4",
            userName = "Ananya Sen",
            userCollege = "Jadavpur University",
            userCity = "Kolkata",
            userAvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            title = "Video Editing in Adobe Premiere Pro",
            description = "Color grading, audio tuning, jump cuts, and motion graphics for YouTube & social reels.",
            category = SkillCategory.PHOTO_VIDEO,
            format = FormatType.ONLINE,
            coinsCost = 20,
            rating = 5.0f,
            tags = listOf("Premiere Pro", "Video Editing", "Reels", "YouTube")
        ),
        SkillItem(
            id = "skill_6",
            userId = "user_5",
            userName = "Vikram Reddy",
            userCollege = "BITS Pilani",
            userCity = "Bengaluru",
            userAvatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            title = "Engineering Calculus & Differential Equations",
            description = "Clear step-by-step concepts, exam prep techniques, and intuition for complex engineering math.",
            category = SkillCategory.MATHEMATICS,
            format = FormatType.ONLINE,
            coinsCost = 20,
            rating = 4.6f,
            tags = listOf("Math", "Calculus", "Engineering", "Exams")
        )
    )

    private val sampleSwaps = mutableListOf(
        SwapRequest(
            id = "swap_1",
            requesterId = "user_1",
            requesterName = "Aarav Sharma",
            requesterAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            recipientId = "user_2",
            recipientName = "Priya Patel",
            recipientAvatar = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
            skillOffered = "Python for Machine Learning & Data Science",
            skillRequested = "UI/UX Design Basics with Figma",
            message = "Hey Priya! I can teach you Python ML modeling in exchange for learning Figma design. Let me know!",
            status = SwapStatus.ACCEPTED,
            createdAt = System.currentTimeMillis() - 86400000L * 2
        ),
        SwapRequest(
            id = "swap_2",
            requesterId = "user_4",
            requesterName = "Ananya Sen",
            requesterAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            recipientId = "user_1",
            recipientName = "Aarav Sharma",
            recipientAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            skillOffered = "Video Editing in Adobe Premiere Pro",
            skillRequested = "Python for Machine Learning & Data Science",
            message = "Hi Aarav! Loved your Python syllabus. Want to exchange with Premiere Pro editing?",
            status = SwapStatus.PENDING,
            createdAt = System.currentTimeMillis() - 3600000L * 4
        ),
        SwapRequest(
            id = "swap_3",
            requesterId = "user_3",
            requesterName = "Rahul Verma",
            requesterAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            recipientId = "user_1",
            recipientName = "Aarav Sharma",
            recipientAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            skillOffered = "Conversational Spanish Speaking",
            skillRequested = "Python for Machine Learning & Data Science",
            message = "Hola Aarav! I completed a 2-hour session teaching Spanish basics to you.",
            status = SwapStatus.COMPLETED,
            createdAt = System.currentTimeMillis() - 86400000L * 5,
            completedAt = System.currentTimeMillis() - 86400000L * 1
        )
    )

    private val sampleChats = mutableListOf(
        ChatMessage(
            id = "msg_1",
            swapId = "swap_1",
            senderId = "user_1",
            senderName = "Aarav Sharma",
            receiverId = "user_2",
            text = "Hi Priya! Thanks for accepting the swap. When are you free for our first Figma session?",
            timestamp = System.currentTimeMillis() - 7200000L,
            isRead = true
        ),
        ChatMessage(
            id = "msg_2",
            swapId = "swap_1",
            senderId = "user_2",
            senderName = "Priya Patel",
            receiverId = "user_1",
            text = "Hey Aarav! I am available this Thursday at 5 PM. I can share my Figma starter template link beforehand!",
            timestamp = System.currentTimeMillis() - 3600000L,
            isRead = true
        ),
        ChatMessage(
            id = "msg_3",
            swapId = "swap_1",
            senderId = "user_1",
            senderName = "Aarav Sharma",
            receiverId = "user_2",
            text = "Sounds awesome! I prepared a Python Jupyter notebook for you too 🚀",
            timestamp = System.currentTimeMillis() - 1800000L,
            isRead = false
        )
    )

    private val sampleNotifications = mutableListOf(
        NotificationItem(
            id = "notif_1",
            userId = "user_1",
            title = "New Swap Request Received!",
            message = "Ananya Sen wants to swap Video Editing for your Python skill.",
            type = NotificationType.SWAP_REQUEST,
            timestamp = System.currentTimeMillis() - 3600000L * 4,
            isRead = false
        ),
        NotificationItem(
            id = "notif_2",
            userId = "user_1",
            title = "Swap Request Accepted",
            message = "Priya Patel accepted your UI/UX Design swap request!",
            type = NotificationType.SWAP_ACCEPTED,
            timestamp = System.currentTimeMillis() - 86400000L,
            isRead = true
        ),
        NotificationItem(
            id = "notif_3",
            userId = "user_1",
            title = "Skill Coins Received (+20)",
            message = "You earned 20 Skill Coins for completing Spanish-Python swap with Rahul Verma.",
            type = NotificationType.COIN_REWARD,
            timestamp = System.currentTimeMillis() - 86400000L * 1,
            isRead = true
        )
    )

    private val sampleReviews = mutableListOf(
        ReviewItem(
            id = "rev_1",
            swapId = "swap_3",
            reviewerId = "user_1",
            reviewerName = "Aarav Sharma",
            reviewerAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            revieweeId = "user_3",
            skillName = "Conversational Spanish Speaking",
            rating = 5,
            comment = "Rahul is a super patient teacher! Taught me pronunciation tricks and essential verbs in just one session.",
            timestamp = System.currentTimeMillis() - 86400000L * 1
        ),
        ReviewItem(
            id = "rev_2",
            swapId = "swap_3",
            reviewerId = "user_3",
            reviewerName = "Rahul Verma",
            reviewerAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            revieweeId = "user_1",
            skillName = "Python for Machine Learning",
            rating = 5,
            comment = "Aarav made Python data science so intuitive. Best skill exchange platform!",
            timestamp = System.currentTimeMillis() - 86400000L * 1
        )
    )

    private val sampleTransactions = mutableListOf(
        CoinTransaction(
            id = "tx_1",
            userId = "user_1",
            amount = 100,
            reason = "Registration Bonus (+100 Coins)",
            timestamp = System.currentTimeMillis() - 86400000L * 10
        ),
        CoinTransaction(
            id = "tx_2",
            userId = "user_1",
            amount = 10,
            reason = "Completed Profile Bonus (+10 Coins)",
            timestamp = System.currentTimeMillis() - 86400000L * 9
        ),
        CoinTransaction(
            id = "tx_3",
            userId = "user_1",
            amount = 20,
            reason = "Completed Teaching Session (Python ML)",
            counterpartyName = "Rahul Verma",
            timestamp = System.currentTimeMillis() - 86400000L * 1
        ),
        CoinTransaction(
            id = "tx_4",
            userId = "user_1",
            amount = 10,
            reason = "Received 5-Star Review Bonus (+5 x 2)",
            counterpartyName = "Rahul Verma",
            timestamp = System.currentTimeMillis() - 86400000L * 1
        )
    )

    private val sampleReports = mutableListOf<ReportItem>()

    // State Flows
    private val _currentUser = MutableStateFlow<User?>(sampleUsers[0]) // default to Aarav Sharma
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()

    private val _allUsers = MutableStateFlow<List<User>>(sampleUsers)
    val allUsers: StateFlow<List<User>> = _allUsers.asStateFlow()

    private val _allSkills = MutableStateFlow<List<SkillItem>>(sampleSkills)
    val allSkills: StateFlow<List<SkillItem>> = _allSkills.asStateFlow()

    private val _swapRequests = MutableStateFlow<List<SwapRequest>>(sampleSwaps)
    val swapRequests: StateFlow<List<SwapRequest>> = _swapRequests.asStateFlow()

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(sampleChats)
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _notifications = MutableStateFlow<List<NotificationItem>>(sampleNotifications)
    val notifications: StateFlow<List<NotificationItem>> = _notifications.asStateFlow()

    private val _reviews = MutableStateFlow<List<ReviewItem>>(sampleReviews)
    val reviews: StateFlow<List<ReviewItem>> = _reviews.asStateFlow()

    private val _coinTransactions = MutableStateFlow<List<CoinTransaction>>(sampleTransactions)
    val coinTransactions: StateFlow<List<CoinTransaction>> = _coinTransactions.asStateFlow()

    private val _reports = MutableStateFlow<List<ReportItem>>(sampleReports)
    val reports: StateFlow<List<ReportItem>> = _reports.asStateFlow()

    private val _isDarkMode = MutableStateFlow(true)
    val isDarkMode: StateFlow<Boolean> = _isDarkMode.asStateFlow()

    // Auth methods
    fun switchUser(userId: String) {
        val user = _allUsers.value.find { it.id == userId }
        if (user != null) {
            _currentUser.value = user
        }
    }

    fun login(email: String, pass: String): Boolean {
        val existing = _allUsers.value.find { it.email.equals(email, ignoreCase = true) }
        if (existing != null) {
            _currentUser.value = existing
            return true
        }
        return false
    }

    fun googleSignIn(): Boolean {
        // Log in or register Google user
        var user = _allUsers.value.find { it.email == "google.student@iitd.ac.in" }
        if (user == null) {
            user = User(
                id = "google_" + UUID.randomUUID().toString().take(6),
                name = "Google Student User",
                email = "google.student@iitd.ac.in",
                college = "IIT Delhi",
                city = "Delhi",
                avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                bio = "Signed in via Google. Ready to swap skills!",
                skillsOffered = listOf("Web Development", "Python"),
                skillsWanted = listOf("Digital Marketing", "Guitar"),
                coinBalance = 100
            )
            _allUsers.value = _allUsers.value + user
            addTransaction(user.id, 100, "Registration Bonus (+100 Skill Coins)")
        }
        _currentUser.value = user
        return true
    }

    fun register(name: String, email: String, pass: String, college: String, city: String): User {
        val newUser = User(
            id = "user_" + UUID.randomUUID().toString().take(6),
            name = name,
            email = email,
            college = college,
            city = city,
            avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            bio = "New student member. Excited to teach and learn!",
            skillsOffered = listOf("General Tutoring"),
            skillsWanted = listOf("Skill Exchange"),
            coinBalance = 100
        )
        _allUsers.value = _allUsers.value + newUser
        _currentUser.value = newUser
        addTransaction(newUser.id, 100, "Registration Bonus (+100 Skill Coins)")
        addNotification(
            userId = newUser.id,
            title = "Welcome to Student Skills Swap! 🎉",
            message = "You received 100 Skill Coins registration bonus. Explore skills and start swapping!",
            type = NotificationType.COIN_REWARD
        )
        return newUser
    }

    fun logout() {
        _currentUser.value = null
    }

    fun toggleDarkMode() {
        _isDarkMode.value = !_isDarkMode.value
    }

    // Daily Check-in Claim
    fun claimDailyCheckIn() {
        val user = _currentUser.value ?: return
        if (user.dailyCheckInClaimed) return

        val updatedUser = user.copy(
            coinBalance = user.coinBalance + 2,
            dailyCheckInClaimed = true
        )
        updateUser(updatedUser)
        addTransaction(user.id, 2, "Daily Login Bonus (+2 Coins)")
        addNotification(
            userId = user.id,
            title = "Daily Check-in Claimed! 🪙",
            message = "You earned +2 Skill Coins for checking in today.",
            type = NotificationType.COIN_REWARD
        )
    }

    // Complete Profile Bonus
    fun claimProfileCompleteBonus() {
        val user = _currentUser.value ?: return
        if (!user.isProfileComplete) {
            val updatedUser = user.copy(
                coinBalance = user.coinBalance + 10,
                isProfileComplete = true
            )
            updateUser(updatedUser)
            addTransaction(user.id, 10, "Completed Profile Bonus (+10 Coins)")
            addNotification(
                userId = user.id,
                title = "Profile Bonus Unlocked! ✨",
                message = "You earned +10 Skill Coins for completing your student profile.",
                type = NotificationType.COIN_REWARD
            )
        }
    }

    // Marketplace Actions
    fun addSkill(
        title: String,
        description: String,
        category: SkillCategory,
        format: FormatType,
        tags: List<String>
    ) {
        val user = _currentUser.value ?: return
        val newSkill = SkillItem(
            id = "skill_" + UUID.randomUUID().toString().take(6),
            userId = user.id,
            userName = user.name,
            userCollege = user.college,
            userCity = user.city,
            userAvatarUrl = user.avatarUrl,
            title = title,
            description = description,
            category = category,
            format = format,
            coinsCost = 20,
            rating = 5.0f,
            tags = tags
        )
        _allSkills.value = listOf(newSkill) + _allSkills.value

        // Update user offered skills
        if (!user.skillsOffered.contains(title)) {
            val updatedUser = user.copy(skillsOffered = user.skillsOffered + title)
            updateUser(updatedUser)
        }
    }

    fun editSkill(
        skillId: String,
        title: String,
        description: String,
        category: SkillCategory,
        format: FormatType,
        tags: List<String>
    ) {
        _allSkills.value = _allSkills.value.map { skill ->
            if (skill.id == skillId) {
                skill.copy(
                    title = title,
                    description = description,
                    category = category,
                    format = format,
                    tags = tags
                )
            } else skill
        }
    }

    fun deleteSkill(skillId: String) {
        _allSkills.value = _allSkills.value.filter { it.id != skillId }
    }

    // Swap Requests
    fun createSwapRequest(
        recipientId: String,
        skillOffered: String,
        skillRequested: String,
        message: String
    ): SwapRequest? {
        val user = _currentUser.value ?: return null
        val recipient = _allUsers.value.find { it.id == recipientId } ?: return null

        val newRequest = SwapRequest(
            id = "swap_" + UUID.randomUUID().toString().take(6),
            requesterId = user.id,
            requesterName = user.name,
            requesterAvatar = user.avatarUrl,
            recipientId = recipient.id,
            recipientName = recipient.name,
            recipientAvatar = recipient.avatarUrl,
            skillOffered = skillOffered,
            skillRequested = skillRequested,
            message = message,
            status = SwapStatus.PENDING
        )

        _swapRequests.value = listOf(newRequest) + _swapRequests.value

        // Notify recipient
        addNotification(
            userId = recipient.id,
            title = "New Swap Request Received! 🤝",
            message = "${user.name} wants to swap '$skillOffered' for your '$skillRequested'.",
            type = NotificationType.SWAP_REQUEST
        )

        return newRequest
    }

    fun acceptSwapRequest(swapId: String) {
        _swapRequests.value = _swapRequests.value.map { req ->
            if (req.id == swapId) {
                val updated = req.copy(status = SwapStatus.ACCEPTED)
                // Notify requester
                addNotification(
                    userId = req.requesterId,
                    title = "Swap Request Accepted! ✅",
                    message = "${req.recipientName} accepted your swap request for '${req.skillRequested}'!",
                    type = NotificationType.SWAP_ACCEPTED
                )
                updated
            } else req
        }
    }

    fun rejectSwapRequest(swapId: String) {
        _swapRequests.value = _swapRequests.value.map { req ->
            if (req.id == swapId) {
                val updated = req.copy(status = SwapStatus.REJECTED)
                addNotification(
                    userId = req.requesterId,
                    title = "Swap Request Declined",
                    message = "${req.recipientName} declined the swap request.",
                    type = NotificationType.SWAP_REJECTED
                )
                updated
            } else req
        }
    }

    fun completeSwapAndReview(
        swapId: String,
        rating: Int,
        reviewComment: String
    ) {
        val swap = _swapRequests.value.find { it.id == swapId } ?: return
        val currentUserVal = _currentUser.value ?: return

        // Identify learner and teacher
        // Learner loses 20 coins, Teacher earns 20 coins
        // Requester requested skillRequested from Recipient.
        // Recipient is teacher of skillRequested; Requester is learner of skillRequested.
        val teacherId = swap.recipientId
        val learnerId = swap.requesterId

        val teacher = _allUsers.value.find { it.id == teacherId }
        val learner = _allUsers.value.find { it.id == learnerId }

        if (teacher != null && learner != null) {
            // Deduct 20 coins from learner, Add 20 coins to teacher
            val updatedLearner = learner.copy(coinBalance = (learner.coinBalance - 20).coerceAtLeast(0))
            val updatedTeacher = teacher.copy(coinBalance = teacher.coinBalance + 20 + if (rating == 5) 5 else 0)

            updateUser(updatedLearner)
            updateUser(updatedTeacher)

            // Log transactions
            addTransaction(learner.id, -20, "Learned '${swap.skillRequested}'", teacher.name)
            addTransaction(teacher.id, +20, "Taught '${swap.skillRequested}'", learner.name)

            if (rating == 5) {
                addTransaction(teacher.id, +5, "5-Star Review Reward (+5 Coins)", learner.name)
            }

            // Notifications
            addNotification(
                userId = learner.id,
                title = "Swap Completed (-20 Skill Coins)",
                message = "Completed session with ${teacher.name}. 20 Skill Coins deducted.",
                type = NotificationType.COIN_REWARD
            )
            addNotification(
                userId = teacher.id,
                title = "Swap Completed (+20 Skill Coins) 🌟",
                message = "Completed session with ${learner.name}. You earned 20 Skill Coins!",
                type = NotificationType.COIN_REWARD
            )
        }

        // Mark swap completed
        _swapRequests.value = _swapRequests.value.map {
            if (it.id == swapId) it.copy(status = SwapStatus.COMPLETED, completedAt = System.currentTimeMillis()) else it
        }

        // Add Review
        val newReview = ReviewItem(
            id = "rev_" + UUID.randomUUID().toString().take(6),
            swapId = swapId,
            reviewerId = currentUserVal.id,
            reviewerName = currentUserVal.name,
            reviewerAvatar = currentUserVal.avatarUrl,
            revieweeId = if (currentUserVal.id == swap.requesterId) swap.recipientId else swap.requesterId,
            skillName = swap.skillRequested,
            rating = rating,
            comment = reviewComment
        )
        _reviews.value = listOf(newReview) + _reviews.value
    }

    // Chat
    fun sendMessage(swapId: String, receiverId: String, text: String, imageUrl: String? = null) {
        val sender = _currentUser.value ?: return
        val receiver = _allUsers.value.find { it.id == receiverId }

        val newMsg = ChatMessage(
            id = "msg_" + UUID.randomUUID().toString().take(6),
            swapId = swapId,
            senderId = sender.id,
            senderName = sender.name,
            receiverId = receiverId,
            text = text,
            imageUrl = imageUrl,
            timestamp = System.currentTimeMillis()
        )

        _chatMessages.value = _chatMessages.value + newMsg

        if (receiver != null) {
            addNotification(
                userId = receiver.id,
                title = "New Message from ${sender.name}",
                message = text.take(40) + if (text.length > 40) "..." else "",
                type = NotificationType.MESSAGE
            )
        }
    }

    // Smart Skill Matching Algorithm
    fun computeSmartMatches(): List<SmartMatchResult> {
        val current = _currentUser.value ?: return emptyList()
        val otherUsers = _allUsers.value.filter { it.id != current.id && !it.isAdmin && !it.isBlocked }

        return otherUsers.map { other ->
            var score = 30 // Base affinity
            val reasons = mutableListOf<String>()

            // 1. Direct Skill Swap Match:
            // Do they teach what current user wants?
            val matchOffered = other.skillsOffered.firstOrNull { offered ->
                current.skillsWanted.any { wanted ->
                    offered.contains(wanted, ignoreCase = true) || wanted.contains(offered, ignoreCase = true)
                }
            } ?: other.skillsOffered.firstOrNull() ?: "General Tutoring"

            val matchWanted = other.skillsWanted.firstOrNull { wanted ->
                current.skillsOffered.any { offered ->
                    wanted.contains(offered, ignoreCase = true) || offered.contains(wanted, ignoreCase = true)
                }
            } ?: current.skillsOffered.firstOrNull() ?: "Skill Exchange"

            if (current.skillsWanted.any { w -> other.skillsOffered.any { o -> o.contains(w, true) || w.contains(o, true) } }) {
                score += 35
                reasons.add("Teaches '${matchOffered}' which you want to learn")
            }

            if (current.skillsOffered.any { o -> other.skillsWanted.any { w -> w.contains(o, true) || o.contains(w, true) } }) {
                score += 25
                reasons.add("Wants to learn '${matchWanted}' which you teach")
            }

            // 2. Location & College match
            if (other.college.equals(current.college, ignoreCase = true)) {
                score += 10
                reasons.add("Same Campus (${current.college})")
            } else if (other.city.equals(current.city, ignoreCase = true)) {
                score += 5
                reasons.add("Same City (${current.city})")
            }

            // 3. High Rating
            if (other.rating >= 4.8f) {
                score += 5
                reasons.add("Top Rated Student (${other.rating} ★)")
            }

            SmartMatchResult(
                student = other,
                matchScore = score.coerceIn(40, 99),
                matchedOfferedSkill = matchOffered,
                matchedWantedSkill = matchWanted,
                matchReasons = reasons.ifEmpty { listOf("Nearby Student with complementary skill interests") }
            )
        }.sortedByDescending { it.matchScore }
    }

    // Report and Admin functions
    fun reportUser(reportedUserId: String, reason: String) {
        val reporter = _currentUser.value ?: return
        val reportedUser = _allUsers.value.find { it.id == reportedUserId } ?: return

        val report = ReportItem(
            id = "rep_" + UUID.randomUUID().toString().take(6),
            reporterId = reporter.id,
            reporterName = reporter.name,
            reportedUserId = reportedUser.id,
            reportedUserName = reportedUser.name,
            reason = reason
        )
        _reports.value = listOf(report) + _reports.value

        // Mark reported flag on user
        updateUser(reportedUser.copy(isReported = true))
    }

    fun adminBanUser(userId: String) {
        _allUsers.value = _allUsers.value.map {
            if (it.id == userId) it.copy(isBlocked = true) else it
        }
    }

    fun adminUnbanUser(userId: String) {
        _allUsers.value = _allUsers.value.map {
            if (it.id == userId) it.copy(isBlocked = false, isReported = false) else it
        }
    }

    fun adminDismissReport(reportId: String) {
        _reports.value = _reports.value.map {
            if (it.id == reportId) it.copy(status = "RESOLVED") else it
        }
    }

    // Helper utilities
    private fun updateUser(user: User) {
        _allUsers.value = _allUsers.value.map { if (it.id == user.id) user else it }
        if (_currentUser.value?.id == user.id) {
            _currentUser.value = user
        }
    }

    private fun addTransaction(userId: String, amount: Int, reason: String, counterparty: String? = null) {
        val tx = CoinTransaction(
            id = "tx_" + UUID.randomUUID().toString().take(6),
            userId = userId,
            amount = amount,
            reason = reason,
            counterpartyName = counterparty
        )
        _coinTransactions.value = listOf(tx) + _coinTransactions.value
    }

    fun addNotification(userId: String, title: String, message: String, type: NotificationType) {
        val notif = NotificationItem(
            id = "notif_" + UUID.randomUUID().toString().take(6),
            userId = userId,
            title = title,
            message = message,
            type = type
        )
        _notifications.value = listOf(notif) + _notifications.value
    }

    fun markNotificationsRead(userId: String) {
        _notifications.value = _notifications.value.map {
            if (it.userId == userId) it.copy(isRead = true) else it
        }
    }
}
