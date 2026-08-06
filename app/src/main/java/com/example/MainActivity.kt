package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SkillsSwapRepository
import com.example.ui.components.AddSkillDialog
import com.example.ui.screens.*
import com.example.ui.theme.IndigoPrimary
import com.example.ui.theme.SkillsSwapTheme
import com.example.ui.theme.VibrantBackgroundBrush

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SkillsSwapTheme {
                MainAppContainer()
            }
        }
    }
}

@Composable
fun MainAppContainer() {
    var selectedTab by remember { mutableStateOf(0) }
    var showAddSkillDialog by remember { mutableStateOf(false) }
    var selectedChatSwapId by remember { mutableStateOf<String?>(null) }
    var isAdminViewOpen by remember { mutableStateOf(false) }

    val currentUser by SkillsSwapRepository.currentUser.collectAsState()
    val notifications by SkillsSwapRepository.notifications.collectAsState()

    val user = currentUser
    val unreadNotifsCount = notifications.count { it.userId == user?.id && !it.isRead }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(VibrantBackgroundBrush)
    ) {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                // Top App Header
                Surface(
                    color = Color.White.copy(alpha = 0.15f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .statusBarsPadding()
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color.White
                            ) {
                                Text(
                                    text = "🔄",
                                    fontSize = 18.sp,
                                    modifier = Modifier.padding(6.dp)
                                )
                            }
                            Column {
                                Text(
                                    text = "Student Skills Swap",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 17.sp,
                                    color = Color.White
                                )
                                Text(
                                    text = "No Money • Pure Skill Exchange",
                                    fontSize = 11.sp,
                                    color = Color.White.copy(alpha = 0.85f),
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        // Notification Icon Badge
                        IconButton(onClick = {
                            selectedTab = 5
                            isAdminViewOpen = false
                        }) {
                            BadgedBox(
                                badge = {
                                    if (unreadNotifsCount > 0) {
                                        Badge(containerColor = Color(0xFFEF4444)) {
                                            Text(
                                                text = "$unreadNotifsCount",
                                                color = Color.White,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Notifications,
                                    contentDescription = "Notifications",
                                    tint = Color.White
                                )
                            }
                        }
                    }
                }
            },
            bottomBar = {
                if (!isAdminViewOpen) {
                    // Glassmorphic Bottom Navigation Bar
                    Surface(
                        modifier = Modifier
                            .navigationBarsPadding()
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                            .clip(RoundedCornerShape(24.dp)),
                        color = Color.White.copy(alpha = 0.95f),
                        tonalElevation = 12.dp,
                        shadowElevation = 12.dp
                    ) {
                        NavigationBar(
                            containerColor = Color.Transparent,
                            tonalElevation = 0.dp,
                            modifier = Modifier.height(64.dp)
                        ) {
                            val items = listOf(
                                Triple(0, "Home", Icons.Default.Home),
                                Triple(1, "Market", Icons.Default.Storefront),
                                Triple(2, "Match", Icons.Default.AutoAwesome),
                                Triple(3, "Swaps", Icons.Default.SwapHoriz),
                                Triple(4, "Chat", Icons.Default.Chat),
                                Triple(6, "Profile", Icons.Default.Person)
                            )

                            items.forEach { (index, label, icon) ->
                                val isSelected = selectedTab == index
                                NavigationBarItem(
                                    selected = isSelected,
                                    onClick = {
                                        selectedTab = index
                                        isAdminViewOpen = false
                                    },
                                    icon = {
                                        Icon(
                                            imageVector = icon,
                                            contentDescription = label,
                                            tint = if (isSelected) IndigoPrimary else Color.Gray
                                        )
                                    },
                                    label = {
                                        Text(
                                            text = label,
                                            fontSize = 10.sp,
                                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
                                            color = if (isSelected) IndigoPrimary else Color.Gray
                                        )
                                    },
                                    colors = NavigationBarItemDefaults.colors(
                                        indicatorColor = IndigoPrimary.copy(alpha = 0.15f)
                                    )
                                )
                            }
                        }
                    }
                }
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                if (isAdminViewOpen) {
                    AdminScreen(onBack = { isAdminViewOpen = false })
                } else {
                    AnimatedContent(
                        targetState = selectedTab,
                        label = "tabTransition"
                    ) { tab ->
                        when (tab) {
                            0 -> HomeScreen(
                                onNavigateTab = { newTab -> selectedTab = newTab },
                                onOpenAddSkill = { showAddSkillDialog = true }
                            )
                            1 -> MarketplaceScreen(
                                onOpenAddSkill = { showAddSkillDialog = true },
                                onRequestSwapCreated = { selectedTab = 3 }
                            )
                            2 -> SmartMatchScreen(
                                onRequestSwapCreated = { selectedTab = 3 }
                            )
                            3 -> SwapsScreen(
                                onOpenChat = { swapId ->
                                    selectedChatSwapId = swapId
                                    selectedTab = 4
                                }
                            )
                            4 -> ChatScreen(swapIdFilter = selectedChatSwapId)
                            5 -> NotificationsScreen()
                            6 -> ProfileScreen(
                                onNavigateAdmin = { isAdminViewOpen = true }
                            )
                            else -> HomeScreen(
                                onNavigateTab = { selectedTab = it },
                                onOpenAddSkill = { showAddSkillDialog = true }
                            )
                        }
                    }
                }
            }
        }

        // Add Skill Dialog Modal
        if (showAddSkillDialog) {
            AddSkillDialog(onDismiss = { showAddSkillDialog = false })
        }
    }
}
