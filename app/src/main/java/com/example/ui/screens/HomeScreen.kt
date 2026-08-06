package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SkillsSwapRepository
import com.example.model.CoinTransaction
import com.example.model.SwapStatus
import com.example.ui.components.*
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldenCoin
import com.example.ui.theme.IndigoPrimary
import com.example.ui.theme.RoseDanger
import com.example.ui.theme.VioletSecondary
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun HomeScreen(
    onNavigateTab: (Int) -> Unit,
    onOpenAddSkill: () -> Unit
) {
    val currentUser by SkillsSwapRepository.currentUser.collectAsState()
    val swapRequests by SkillsSwapRepository.swapRequests.collectAsState()
    val transactions by SkillsSwapRepository.coinTransactions.collectAsState()
    var showTransactionsDialog by remember { mutableStateOf(false) }

    val user = currentUser ?: return

    val mySwaps = swapRequests.filter { it.requesterId == user.id || it.recipientId == user.id }
    val activeSwapsCount = mySwaps.count { it.status == SwapStatus.ACCEPTED }
    val completedSwapsCount = mySwaps.count { it.status == SwapStatus.COMPLETED }
    val myTransactions = transactions.filter { it.userId == user.id }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Header Bar (Glass Translucent)
        item {
            TranslucentGlassCard(
                borderColor = Color.White.copy(alpha = 0.3f),
                backgroundColor = Color.White.copy(alpha = 0.18f)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        AvatarView(
                            imageUrl = user.avatarUrl,
                            name = user.name,
                            size = 52.dp,
                            isOnline = user.isOnline
                        )
                        Column {
                            Text(
                                text = "Welcome back, ${user.name}! 👋",
                                fontWeight = FontWeight.Bold,
                                fontSize = 17.sp,
                                color = Color.White
                            )
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.School,
                                    contentDescription = null,
                                    tint = Color.White.copy(alpha = 0.8f),
                                    modifier = Modifier.size(14.dp)
                                )
                                Text(
                                    text = "${user.college} • ${user.city}",
                                    fontSize = 12.sp,
                                    color = Color.White.copy(alpha = 0.8f),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }

                    SkillCoinBadge(
                        balance = user.coinBalance,
                        onClick = { showTransactionsDialog = true }
                    )
                }
            }
        }

        // Daily Login Claim Banner (Glow Card)
        item {
            val gradient = Brush.horizontalGradient(
                colors = listOf(Color(0xFFA855F7), Color(0xFF6366F1))
            )
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .border(1.dp, Color.White.copy(alpha = 0.4f), RoundedCornerShape(24.dp)),
                shape = RoundedCornerShape(24.dp),
                color = Color.Transparent,
                shadowElevation = 8.dp
            ) {
                Row(
                    modifier = Modifier
                        .background(gradient)
                        .padding(18.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(text = "🎁", fontSize = 18.sp)
                            Text(
                                text = "Daily Check-in Bonus",
                                fontWeight = FontWeight.Black,
                                color = Color.White,
                                fontSize = 15.sp
                            )
                        }
                        Text(
                            text = if (user.dailyCheckInClaimed) "You claimed +2 Skill Coins today!" else "Claim +2 Skill Coins for checking in today!",
                            fontSize = 12.sp,
                            color = Color.White.copy(alpha = 0.9f),
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }

                    Button(
                        onClick = { SkillsSwapRepository.claimDailyCheckIn() },
                        enabled = !user.dailyCheckInClaimed,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.White,
                            contentColor = IndigoPrimary,
                            disabledContainerColor = Color.White.copy(alpha = 0.3f),
                            disabledContentColor = Color.White
                        ),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text(
                            text = if (user.dailyCheckInClaimed) "Claimed ✓" else "Claim +2 🪙",
                            fontWeight = FontWeight.Black,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }

        // Key Stats Cards Grid
        item {
            Text(
                text = "Platform Statistics",
                fontWeight = FontWeight.Black,
                fontSize = 17.sp,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                VibrantStatCard(
                    modifier = Modifier.weight(1f),
                    title = "SKILLS SHARED",
                    value = "${user.skillsOffered.size}",
                    highlightTag = user.skillsOffered.firstOrNull() ?: "React",
                    valueColor = IndigoPrimary,
                    onClick = { onNavigateTab(1) }
                )
                VibrantStatCard(
                    modifier = Modifier.weight(1f),
                    title = "SKILLS LEARNT",
                    value = "$completedSwapsCount",
                    highlightTag = user.skillsWanted.firstOrNull() ?: "Design",
                    valueColor = EmeraldSuccess,
                    onClick = { onNavigateTab(3) }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                VibrantStatCard(
                    modifier = Modifier.weight(1f),
                    title = "ACTIVE SWAPS",
                    value = "$activeSwapsCount",
                    highlightTag = "In Progress",
                    valueColor = VioletSecondary,
                    onClick = { onNavigateTab(3) }
                )
                VibrantStatCard(
                    modifier = Modifier.weight(1f),
                    title = "STUDENT RATING",
                    value = String.format("%.1f ★", user.rating),
                    highlightTag = "${user.reviewCount} Reviews",
                    valueColor = GoldenCoin,
                    onClick = { onNavigateTab(6) }
                )
            }
        }

        // Quick Actions Row
        item {
            Text(
                text = "Quick Actions",
                fontWeight = FontWeight.Black,
                fontSize = 17.sp,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                VibrantActionButton(
                    modifier = Modifier.weight(1f),
                    title = "Marketplace",
                    icon = Icons.Default.Storefront,
                    onClick = { onNavigateTab(1) }
                )
                VibrantActionButton(
                    modifier = Modifier.weight(1f),
                    title = "Smart Match",
                    icon = Icons.Default.AutoAwesome,
                    onClick = { onNavigateTab(2) }
                )
                VibrantActionButton(
                    modifier = Modifier.weight(1f),
                    title = "+ Teach Skill",
                    icon = Icons.Default.AddCircle,
                    onClick = onOpenAddSkill
                )
            }
        }

        // Recommended for You / Active Exchanges
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = " ✨ Active & Pending Swaps",
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp,
                    color = Color.White
                )
                TextButton(onClick = { onNavigateTab(3) }) {
                    Text("View All →", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }

            if (mySwaps.isEmpty()) {
                GlassCard {
                    Text(
                        text = "No active swaps yet. Browse the Marketplace or try Smart Match to start exchanging skills!",
                        fontSize = 13.sp,
                        color = Color(0xFF4B5563)
                    )
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    mySwaps.take(3).forEach { swap ->
                        SwapQuickItem(
                            swap = swap,
                            currentUserId = user.id,
                            onChatClick = { onNavigateTab(4) }
                        )
                    }
                }
            }
        }
    }

    // Coin Transactions History Dialog Modal
    if (showTransactionsDialog) {
        AlertDialog(
            onDismissRequest = { showTransactionsDialog = false },
            title = {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = "🪙", fontSize = 22.sp)
                    Text(
                        text = "Skill Coin Ledger",
                        fontWeight = FontWeight.Black
                    )
                }
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 350.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFFEF3C7),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Current Balance:",
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF92400E)
                            )
                            Text(
                                text = "${user.coinBalance} Skill Coins",
                                fontWeight = FontWeight.Black,
                                color = Color(0xFFB45309),
                                fontSize = 16.sp
                            )
                        }
                    }

                    if (myTransactions.isEmpty()) {
                        Text(
                            text = "No transactions logged yet.",
                            fontSize = 13.sp,
                            color = Color.Gray
                        )
                    } else {
                        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(myTransactions) { tx ->
                                TransactionRow(tx = tx)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showTransactionsDialog = false }) {
                    Text("Close", fontWeight = FontWeight.Bold, color = IndigoPrimary)
                }
            }
        )
    }
}

@Composable
fun VibrantStatCard(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    highlightTag: String,
    valueColor: Color,
    onClick: () -> Unit
) {
    GlassCard(
        modifier = modifier,
        onClick = onClick
    ) {
        Column {
            Text(
                text = title,
                fontSize = 11.sp,
                fontWeight = FontWeight.Black,
                color = Color.Gray
            )
            Text(
                text = value,
                fontSize = 28.sp,
                fontWeight = FontWeight.Black,
                color = valueColor,
                modifier = Modifier.padding(vertical = 4.dp)
            )
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = valueColor.copy(alpha = 0.12f)
            ) {
                Text(
                    text = highlightTag,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = valueColor,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                )
            }
        }
    }
}

@Composable
fun VibrantActionButton(
    modifier: Modifier = Modifier,
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit
) {
    Surface(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .border(1.dp, Color.White.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
        shape = RoundedCornerShape(16.dp),
        color = Color.White.copy(alpha = 0.95f),
        shadowElevation = 4.dp
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = IndigoPrimary,
                modifier = Modifier.size(24.dp)
            )
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.Black,
                color = Color(0xFF1E293B)
            )
        }
    }
}

@Composable
fun SwapQuickItem(
    swap: com.example.model.SwapRequest,
    currentUserId: String,
    onChatClick: () -> Unit
) {
    val otherName = if (swap.requesterId == currentUserId) swap.recipientName else swap.requesterName
    val otherAvatar = if (swap.requesterId == currentUserId) swap.recipientAvatar else swap.requesterAvatar

    GlassCard {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.weight(1f)
            ) {
                AvatarView(imageUrl = otherAvatar, name = otherName, size = 42.dp)
                Column {
                    Text(
                        text = otherName,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF1E293B)
                    )
                    Text(
                        text = "Exchanging: ${swap.skillRequested}",
                        fontSize = 12.sp,
                        color = Color.Gray,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                StatusBadge(status = swap.status)
                if (swap.status == SwapStatus.ACCEPTED) {
                    IconButton(onClick = onChatClick) {
                        Icon(
                            imageVector = Icons.Default.Chat,
                            contentDescription = "Chat",
                            tint = IndigoPrimary
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TransactionRow(tx: CoinTransaction) {
    val isPositive = tx.amount > 0
    val color = if (isPositive) EmeraldSuccess else RoseDanger
    val sdf = SimpleDateFormat("MMM dd, hh:mm a", Locale.getDefault())
    val dateStr = sdf.format(Date(tx.timestamp))

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(Color(0xFFF1F5F9))
            .padding(10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = tx.reason,
                fontWeight = FontWeight.SemiBold,
                fontSize = 13.sp,
                color = Color(0xFF1E293B)
            )
            Text(
                text = dateStr,
                fontSize = 11.sp,
                color = Color.Gray
            )
        }
        Text(
            text = "${if (isPositive) "+" else ""}${tx.amount} 🪙",
            fontWeight = FontWeight.Black,
            color = color,
            fontSize = 14.sp
        )
    }
}
