package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SkillsSwapRepository
import com.example.model.*
import com.example.ui.components.*
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldenCoin
import com.example.ui.theme.IndigoPrimary

@Composable
fun MarketplaceScreen(
    onOpenAddSkill: () -> Unit,
    onRequestSwapCreated: () -> Unit
) {
    val skills by SkillsSwapRepository.allSkills.collectAsState()
    val currentUser by SkillsSwapRepository.currentUser.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(SkillCategory.ALL) }
    var selectedFormat by remember { mutableStateOf(FormatType.ALL) }
    var selectedCityFilter by remember { mutableStateOf("All Cities") }

    var selectedSkillToSwap by remember { mutableStateOf<SkillItem?>(null) }
    var swapOfferedSkillText by remember { mutableStateOf("") }
    var swapNoteText by remember { mutableStateOf("") }

    val cities = listOf("All Cities", "Delhi", "Mumbai", "Kolkata", "Bengaluru", "Chennai")

    val filteredSkills = skills.filter { skill ->
        val matchesQuery = searchQuery.isBlank() ||
                skill.title.contains(searchQuery, ignoreCase = true) ||
                skill.description.contains(searchQuery, ignoreCase = true) ||
                skill.userName.contains(searchQuery, ignoreCase = true) ||
                skill.userCollege.contains(searchQuery, ignoreCase = true) ||
                skill.tags.any { it.contains(searchQuery, ignoreCase = true) }

        val matchesCategory = selectedCategory == SkillCategory.ALL || skill.category == selectedCategory
        val matchesFormat = selectedFormat == FormatType.ALL || skill.format == selectedFormat
        val matchesCity = selectedCityFilter == "All Cities" || skill.userCity.equals(selectedCityFilter, ignoreCase = true)

        matchesQuery && matchesCategory && matchesFormat && matchesCity
    }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header Bar
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Skill Marketplace 🛒",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Text(
                            text = "Exchange skills for virtual Skill Coins",
                            fontSize = 13.sp,
                            color = Color.White.copy(alpha = 0.85f)
                        )
                    }

                    Button(
                        onClick = onOpenAddSkill,
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = IndigoPrimary),
                        shape = RoundedCornerShape(14.dp),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Add Skill", fontWeight = FontWeight.Black)
                    }
                }
            }

            // Glass Search Bar
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search skills, tech, campus, tutor...", color = Color.Gray) },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = null,
                            tint = IndigoPrimary
                        )
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(imageVector = Icons.Default.Clear, contentDescription = "Clear", tint = Color.Gray)
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White, RoundedCornerShape(20.dp)),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = Color.White,
                        focusedTextColor = Color(0xFF1E293B),
                        unfocusedTextColor = Color(0xFF1E293B)
                    )
                )
            }

            // Category Filter Chips
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    contentPadding = PaddingValues(vertical = 4.dp)
                ) {
                    items(SkillCategory.values()) { category ->
                        CategoryChip(
                            category = category,
                            isSelected = selectedCategory == category,
                            onSelect = { selectedCategory = category }
                        )
                    }
                }
            }

            // Format & City Filter Row
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Format Filters
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Color.White.copy(alpha = 0.9f),
                        modifier = Modifier.weight(1f)
                    ) {
                        Row(modifier = Modifier.padding(4.dp)) {
                            FormatType.values().forEach { fmt ->
                                val isSelected = selectedFormat == fmt
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(if (isSelected) IndigoPrimary else Color.Transparent)
                                        .clickable { selectedFormat = fmt }
                                        .padding(vertical = 6.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = fmt.name,
                                        fontSize = 11.sp,
                                        fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
                                        color = if (isSelected) Color.White else Color(0xFF1E293B)
                                    )
                                }
                            }
                        }
                    }

                    // City Filter Dropdown
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Color.White.copy(alpha = 0.9f),
                        modifier = Modifier.padding(vertical = 2.dp)
                    ) {
                        var expanded by remember { mutableStateOf(false) }
                        Box {
                            Row(
                                modifier = Modifier
                                    .clickable { expanded = true }
                                    .padding(horizontal = 12.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.LocationOn,
                                    contentDescription = null,
                                    tint = IndigoPrimary,
                                    modifier = Modifier.size(16.dp)
                                )
                                Text(
                                    text = selectedCityFilter,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF1E293B)
                                )
                                Icon(
                                    imageVector = Icons.Default.ArrowDropDown,
                                    contentDescription = null,
                                    tint = Color.Gray,
                                    modifier = Modifier.size(18.dp)
                                )
                            }

                            DropdownMenu(
                                expanded = expanded,
                                onDismissRequest = { expanded = false }
                            ) {
                                cities.forEach { c ->
                                    DropdownMenuItem(
                                        text = { Text(c, fontWeight = FontWeight.Bold) },
                                        onClick = {
                                            selectedCityFilter = c
                                            expanded = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Results count
            item {
                Text(
                    text = "Available Listings (${filteredSkills.size})",
                    fontSize = 13.sp,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            }

            // Skill Cards List
            if (filteredSkills.isEmpty()) {
                item {
                    GlassCard {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.SearchOff,
                                contentDescription = null,
                                modifier = Modifier.size(48.dp),
                                tint = Color.Gray
                            )
                            Text(
                                text = "No skills match your search filters",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = Color(0xFF1E293B)
                            )
                            Text(
                                text = "Try clearing search keywords or switching category.",
                                fontSize = 12.sp,
                                color = Color.Gray
                            )
                        }
                    }
                }
            } else {
                items(filteredSkills) { skill ->
                    SkillCard(
                        skill = skill,
                        currentUserId = currentUser?.id,
                        onRequestSwap = {
                            selectedSkillToSwap = skill
                            swapOfferedSkillText = currentUser?.skillsOffered?.firstOrNull() ?: "General Tutoring"
                        }
                    )
                }
            }
        }

        // Request Swap Dialog Modal
        if (selectedSkillToSwap != null) {
            val skill = selectedSkillToSwap!!
            AlertDialog(
                onDismissRequest = { selectedSkillToSwap = null },
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.SwapHoriz,
                            contentDescription = null,
                            tint = IndigoPrimary
                        )
                        Text(
                            text = "Request Skill Exchange",
                            fontWeight = FontWeight.Black
                        )
                    }
                },
                text = {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            text = "Learning: ${skill.title}",
                            fontWeight = FontWeight.Bold,
                            color = IndigoPrimary,
                            fontSize = 14.sp
                        )
                        Text(
                            text = "Teacher: ${skill.userName} (${skill.userCollege})",
                            fontSize = 12.sp,
                            color = Color.Gray
                        )

                        Text(
                            text = "What skill will you teach in return?",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )

                        OutlinedTextField(
                            value = swapOfferedSkillText,
                            onValueChange = { swapOfferedSkillText = it },
                            label = { Text("Your Skill to Teach") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = swapNoteText,
                            onValueChange = { swapNoteText = it },
                            label = { Text("Message / Proposed Times (Optional)") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 2
                        )

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Color(0xFFFEF3C7)
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Text(text = "🪙", fontSize = 16.sp)
                                Text(
                                    text = "20 Skill Coins transferred upon successful session",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF92400E)
                                )
                            }
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (swapOfferedSkillText.isNotBlank()) {
                                SkillsSwapRepository.createSwapRequest(
                                    recipientId = skill.userId,
                                    skillOffered = swapOfferedSkillText,
                                    skillRequested = skill.title,
                                    message = swapNoteText
                                )
                                selectedSkillToSwap = null
                                onRequestSwapCreated()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary)
                    ) {
                        Text("Send Request", fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { selectedSkillToSwap = null }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}

@Composable
fun SkillCard(
    skill: SkillItem,
    currentUserId: String?,
    onRequestSwap: () -> Unit
) {
    val isMySkill = currentUserId == skill.userId

    GlassCard {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            // Student User Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    AvatarView(
                        imageUrl = skill.userAvatarUrl,
                        name = skill.userName,
                        size = 44.dp,
                        isOnline = true
                    )
                    Column {
                        Text(
                            text = skill.userName,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = Color(0xFF1E293B)
                        )
                        Text(
                            text = "${skill.userCollege} • ${skill.userCity}",
                            fontSize = 11.sp,
                            color = Color.Gray,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }

                RatingStars(rating = skill.rating, reviewCount = 10)
            }

            Divider(color = Color.LightGray.copy(alpha = 0.5f))

            // Skill Title & Description
            Text(
                text = skill.title,
                fontWeight = FontWeight.Black,
                fontSize = 16.sp,
                color = Color(0xFF1E293B)
            )

            Text(
                text = skill.description,
                fontSize = 13.sp,
                color = Color(0xFF4B5563),
                maxLines = 3,
                overflow = TextOverflow.Ellipsis
            )

            // Tags Row
            if (skill.tags.isNotEmpty()) {
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(skill.tags) { tag ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = IndigoPrimary.copy(alpha = 0.12f)
                        ) {
                            Text(
                                text = "#$tag",
                                color = IndigoPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                    }
                }
            }

            // Footer: Format, Coins cost, Request Button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Format pill
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color(0xFFF1F5F9)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = if (skill.format == FormatType.ONLINE) Icons.Default.Computer else Icons.Default.Person,
                                contentDescription = null,
                                modifier = Modifier.size(12.dp),
                                tint = IndigoPrimary
                            )
                            Text(
                                text = skill.format.name,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1E293B)
                            )
                        }
                    }

                    // Cost Pill
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color(0xFFFEF3C7)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(text = "🪙", fontSize = 12.sp)
                            Text(
                                text = "${skill.coinsCost} Coins",
                                fontWeight = FontWeight.Black,
                                fontSize = 11.sp,
                                color = Color(0xFF92400E)
                            )
                        }
                    }
                }

                if (!isMySkill) {
                    Button(
                        onClick = onRequestSwap,
                        colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                        shape = RoundedCornerShape(12.dp),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.SwapHoriz,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Swap Now", fontSize = 12.sp, fontWeight = FontWeight.Black)
                    }
                } else {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFF1F5F9)
                    ) {
                        Text(
                            text = "Your Listing",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Gray,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }
        }
    }
}
