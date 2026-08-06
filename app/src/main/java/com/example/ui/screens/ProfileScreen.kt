package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SkillsSwapRepository
import com.example.ui.components.AvatarView
import com.example.ui.components.GlassCard
import com.example.ui.components.RatingStars
import com.example.ui.components.SkillCoinBadge
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldenCoin
import com.example.ui.theme.IndigoPrimary
import com.example.ui.theme.VioletSecondary

@Composable
fun ProfileScreen(
    onNavigateAdmin: (() -> Unit)? = null
) {
    val currentUser by SkillsSwapRepository.currentUser.collectAsState()
    val allUsers by SkillsSwapRepository.allUsers.collectAsState()
    val reviews by SkillsSwapRepository.reviews.collectAsState()

    val user = currentUser ?: return
    val userReviews = reviews.filter { it.revieweeId == user.id }

    var showUserSwitchDialog by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // User Profile Header Card
        item {
            GlassCard {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    AvatarView(
                        imageUrl = user.avatarUrl,
                        name = user.name,
                        size = 80.dp,
                        isOnline = user.isOnline
                    )

                    Text(
                        text = user.name,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black,
                        color = Color(0xFF1E293B)
                    )

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.School,
                            contentDescription = null,
                            tint = IndigoPrimary,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "${user.college} • ${user.city}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF4B5563)
                        )
                    }

                    RatingStars(rating = user.rating, reviewCount = user.reviewCount)

                    Text(
                        text = user.bio,
                        fontSize = 13.sp,
                        color = Color(0xFF4B5563),
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        SkillCoinBadge(balance = user.coinBalance)

                        Button(
                            onClick = { showUserSwitchDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Icon(imageVector = Icons.Default.SwitchAccount, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Switch Profile", fontWeight = FontWeight.Bold)
                        }
                    }

                    if (user.isAdmin && onNavigateAdmin != null) {
                        Button(
                            onClick = onNavigateAdmin,
                            colors = ButtonDefaults.buttonColors(containerColor = VioletSecondary),
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(imageVector = Icons.Default.AdminPanelSettings, contentDescription = null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Admin Moderation Panel", fontWeight = FontWeight.Black)
                        }
                    }
                }
            }
        }

        // Skills Offered & Wanted Section
        item {
            GlassCard {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "TEACHING / SKILLS OFFERED",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = IndigoPrimary
                    )
                    user.skillsOffered.forEach { s ->
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = IndigoPrimary.copy(alpha = 0.12f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "🎓 $s",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = IndigoPrimary,
                                modifier = Modifier.padding(10.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "WANTS TO LEARN",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = VioletSecondary
                    )
                    user.skillsWanted.forEach { s ->
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = VioletSecondary.copy(alpha = 0.12f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "💡 $s",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = VioletSecondary,
                                modifier = Modifier.padding(10.dp)
                            )
                        }
                    }
                }
            }
        }

        // Student Reviews Received Section
        item {
            Text(
                text = "Student Peer Reviews (${userReviews.size})",
                fontWeight = FontWeight.Black,
                fontSize = 17.sp,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp))

            if (userReviews.isEmpty()) {
                GlassCard {
                    Text(
                        text = "No student reviews received yet. Complete skill sessions to earn reviews!",
                        fontSize = 13.sp,
                        color = Color.Gray
                    )
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    userReviews.forEach { rev ->
                        GlassCard {
                            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = rev.reviewerName,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp,
                                        color = Color(0xFF1E293B)
                                    )
                                    RatingStars(rating = rev.rating.toFloat())
                                }
                                Text(
                                    text = "Skill: ${rev.skillName}",
                                    fontSize = 11.sp,
                                    color = IndigoPrimary,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "\"${rev.comment}\"",
                                    fontSize = 12.sp,
                                    color = Color(0xFF4B5563)
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // Switch Profile Modal Dialog
    if (showUserSwitchDialog) {
        AlertDialog(
            onDismissRequest = { showUserSwitchDialog = false },
            title = {
                Text(
                    text = "Switch Student Account",
                    fontWeight = FontWeight.Black
                )
            },
            text = {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.heightIn(max = 300.dp)
                ) {
                    items(allUsers) { u ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (u.id == user.id) IndigoPrimary.copy(alpha = 0.15f) else Color(0xFFF1F5F9),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    SkillsSwapRepository.switchUser(u.id)
                                    showUserSwitchDialog = false
                                }
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                AvatarView(imageUrl = u.avatarUrl, name = u.name, size = 38.dp)
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = u.name + if (u.isAdmin) " (Admin)" else "",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = Color(0xFF1E293B)
                                    )
                                    Text(
                                        text = "${u.college} • ${u.coinBalance} 🪙",
                                        fontSize = 11.sp,
                                        color = Color.Gray
                                    )
                                }
                                if (u.id == user.id) {
                                    Text("Current", fontWeight = FontWeight.Black, color = IndigoPrimary, fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showUserSwitchDialog = false }) {
                    Text("Close", fontWeight = FontWeight.Bold)
                }
            }
        )
    }
}
