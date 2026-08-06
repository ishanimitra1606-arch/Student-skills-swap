package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.model.SkillCategory
import com.example.model.SwapStatus
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldenCoin
import com.example.ui.theme.IndigoPrimary
import com.example.ui.theme.RoseDanger
import com.example.ui.theme.VioletSecondary

@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 24.dp,
    borderWidth: Dp = 1.dp,
    borderColor: Color = Color.White.copy(alpha = 0.6f),
    backgroundColor: Color = Color.White.copy(alpha = 0.92f),
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val shape = RoundedCornerShape(cornerRadius)
    Surface(
        modifier = modifier
            .clip(shape)
            .border(borderWidth, borderColor, shape)
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier),
        shape = shape,
        color = backgroundColor,
        tonalElevation = 6.dp
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            content = content
        )
    }
}

@Composable
fun TranslucentGlassCard(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 24.dp,
    borderWidth: Dp = 1.dp,
    borderColor: Color = Color.White.copy(alpha = 0.25f),
    backgroundColor: Color = Color.White.copy(alpha = 0.15f),
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val shape = RoundedCornerShape(cornerRadius)
    Surface(
        modifier = modifier
            .clip(shape)
            .border(borderWidth, borderColor, shape)
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier),
        shape = shape,
        color = backgroundColor,
        tonalElevation = 0.dp
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            content = content
        )
    }
}

@Composable
fun SkillCoinBadge(
    balance: Int,
    onClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .border(1.dp, Color.White.copy(alpha = 0.6f), RoundedCornerShape(20.dp))
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier),
        shape = RoundedCornerShape(20.dp),
        color = Color.White,
        shadowElevation = 8.dp
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(26.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFFEF3C7)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "🪙", fontSize = 14.sp)
            }
            Column(verticalArrangement = Arrangement.Center) {
                Text(
                    text = "BALANCE",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray
                )
                Text(
                    text = "$balance",
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF1F2937),
                    fontSize = 15.sp,
                    lineHeight = 16.sp
                )
            }
        }
    }
}

@Composable
fun RatingStars(
    rating: Float,
    reviewCount: Int? = null,
    starSize: Dp = 16.dp,
    modifier: Modifier = Modifier
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(2.dp),
        modifier = modifier
    ) {
        repeat(5) { index ->
            val isFilled = index < rating.toInt()
            Icon(
                imageVector = if (isFilled) Icons.Default.Star else Icons.Outlined.Star,
                contentDescription = null,
                tint = if (isFilled) GoldenCoin else Color.LightGray,
                modifier = Modifier.size(starSize)
            )
        }
        Text(
            text = String.format("%.1f", rating),
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp,
            color = Color(0xFF1E293B),
            modifier = Modifier.padding(start = 4.dp)
        )
        if (reviewCount != null) {
            Text(
                text = "($reviewCount)",
                fontSize = 11.sp,
                color = Color.Gray
            )
        }
    }
}

@Composable
fun StatusBadge(status: SwapStatus) {
    val (bgColor, textColor, label) = when (status) {
        SwapStatus.PENDING -> Triple(GoldenCoin.copy(alpha = 0.15f), Color(0xFFD97706), "Pending")
        SwapStatus.ACCEPTED -> Triple(IndigoPrimary.copy(alpha = 0.15f), IndigoPrimary, "Active Swap")
        SwapStatus.COMPLETED -> Triple(EmeraldSuccess.copy(alpha = 0.15f), EmeraldSuccess, "Completed")
        SwapStatus.REJECTED -> Triple(RoseDanger.copy(alpha = 0.15f), RoseDanger, "Declined")
        SwapStatus.CANCELLED -> Triple(Color.LightGray.copy(alpha = 0.3f), Color.DarkGray, "Cancelled")
    }

    Surface(
        shape = RoundedCornerShape(12.dp),
        color = bgColor,
        modifier = Modifier.padding(2.dp)
    ) {
        Text(
            text = label,
            color = textColor,
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
        )
    }
}

@Composable
fun AvatarView(
    imageUrl: String,
    name: String,
    size: Dp = 48.dp,
    isOnline: Boolean = false,
    onClick: (() -> Unit)? = null
) {
    Box(
        modifier = Modifier
            .size(size)
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier)
    ) {
        AsyncImage(
            model = imageUrl,
            contentDescription = name,
            modifier = Modifier
                .fillMaxSize()
                .clip(CircleShape)
                .border(2.dp, Color.White, CircleShape),
            contentScale = ContentScale.Crop
        )

        if (isOnline) {
            Box(
                modifier = Modifier
                    .size(size * 0.28f)
                    .align(Alignment.BottomEnd)
                    .clip(CircleShape)
                    .background(EmeraldSuccess)
                    .border(2.dp, Color.White, CircleShape)
            )
        }
    }
}

@Composable
fun CategoryChip(
    category: SkillCategory,
    isSelected: Boolean,
    onSelect: () -> Unit
) {
    val animatedBg by animateColorAsState(
        if (isSelected) IndigoPrimary else Color.White.copy(alpha = 0.85f),
        label = "chipBg"
    )
    val animatedText by animateColorAsState(
        if (isSelected) Color.White else Color(0xFF1E293B),
        label = "chipText"
    )

    Surface(
        shape = RoundedCornerShape(18.dp),
        color = animatedBg,
        shadowElevation = if (isSelected) 4.dp else 1.dp,
        modifier = Modifier
            .clip(RoundedCornerShape(18.dp))
            .clickable { onSelect() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            val iconVector: ImageVector = getCategoryIcon(category)
            Icon(
                imageVector = iconVector,
                contentDescription = null,
                tint = animatedText,
                modifier = Modifier.size(16.dp)
            )
            Text(
                text = category.displayName,
                color = animatedText,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold,
                fontSize = 12.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun StatCard(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    iconTint: Color = IndigoPrimary,
    onClick: () -> Unit = {}
) {
    GlassCard(
        modifier = modifier,
        onClick = onClick
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(iconTint.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconTint,
                    modifier = Modifier.size(22.dp)
                )
            }
            Column {
                Text(
                    text = title,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Gray
                )
                Text(
                    text = value,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = subtitle,
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

fun getCategoryIcon(category: SkillCategory): ImageVector {
    return when (category) {
        SkillCategory.ALL -> Icons.Default.Apps
        SkillCategory.PROGRAMMING -> Icons.Default.Code
        SkillCategory.DESIGN -> Icons.Default.Palette
        SkillCategory.MUSIC -> Icons.Default.MusicNote
        SkillCategory.LANGUAGES -> Icons.Default.Translate
        SkillCategory.MATHEMATICS -> Icons.Default.Calculate
        SkillCategory.SCIENCE -> Icons.Default.Science
        SkillCategory.MARKETING -> Icons.Default.TrendingUp
        SkillCategory.PHOTO_VIDEO -> Icons.Default.PhotoCamera
        SkillCategory.PERSONAL_GROWTH -> Icons.Default.Psychology
    }
}
